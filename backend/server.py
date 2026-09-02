from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import re
import uuid
import logging
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict

import bcrypt
import jwt
from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends, Query
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict

from seed_data import STATES, STATE_NAMES, SITE_CONTENT, COURSE_IMAGES, DEFAULT_HOURS, build_courses, slugify_city

client = AsyncIOMotorClient(os.environ['MONGO_URL'])
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

JWT_ALGORITHM = "HS256"
JWT_SECRET = os.environ["JWT_SECRET"]


# ---------- Models ----------
class LoginIn(BaseModel):
    username: str
    password: str


class CourseIn(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str = Field(min_length=1)
    city: str = Field(min_length=1)
    state: str
    rating: float = Field(ge=0, le=5, default=4.5)
    reviewCount: int = Field(ge=0, default=0)
    featured: bool = False
    image: str = ""
    address: str = ""
    phone: str = ""
    website: str = ""
    priceRange: str = "$8 - $14 per round"
    description: str = ""
    hours: Dict[str, str] = Field(default_factory=lambda: dict(DEFAULT_HOURS))


class Course(CourseIn):
    id: str
    citySlug: str
    createdAt: str


class StatItem(BaseModel):
    title: str
    text: str


class SiteContent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    heroTitle1: str
    heroTitle2: str
    heroSubtitle: str
    introTitle: str
    introParagraphs: List[str]
    stats: List[StatItem]
    whyTitle: str
    whyParagraphs: List[str]
    shareTitle: str
    shareText: str


# ---------- Auth helpers ----------
def hash_password(p: str) -> str:
    return bcrypt.hashpw(p.encode(), bcrypt.gensalt()).decode()


def verify_password(p: str, h: str) -> bool:
    return bcrypt.checkpw(p.encode(), h.encode())


def create_token(user_id: str, username: str) -> str:
    payload = {"sub": user_id, "username": username, "type": "access",
               "exp": datetime.now(timezone.utc) + timedelta(hours=12)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_user(request: Request) -> dict:
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(auth[7:], JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"id": payload.get("sub")}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


MAX_ATTEMPTS, LOCK_MINUTES = 5, 15


async def check_lockout(identifier: str):
    rec = await db.login_attempts.find_one({"identifier": identifier})
    if rec and rec.get("count", 0) >= MAX_ATTEMPTS:
        locked_until = datetime.fromisoformat(rec["last"]) + timedelta(minutes=LOCK_MINUTES)
        if datetime.now(timezone.utc) < locked_until:
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")
        await db.login_attempts.delete_one({"identifier": identifier})


# ---------- Auth routes ----------
@api_router.post("/auth/login")
async def login(body: LoginIn, request: Request):
    username = body.username.strip().lower()
    ip = request.headers.get("X-Forwarded-For", "").split(",")[0].strip() or (request.client.host if request.client else "unknown")
    identifier = f"{ip}:{username}"
    await check_lockout(identifier)
    user = await db.users.find_one({"username": username})
    if not user or not verify_password(body.password, user["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"count": 1}, "$set": {"last": datetime.now(timezone.utc).isoformat()}},
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="Invalid username or password")
    await db.login_attempts.delete_one({"identifier": identifier})
    return {"token": create_token(user["id"], user["username"]),
            "user": {"id": user["id"], "username": user["username"], "role": user["role"]}}


@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user


# ---------- Public routes ----------
NO_ID = {"_id": 0}


@api_router.get("/states")
async def list_states():
    pipeline = [{"$group": {"_id": "$state", "count": {"$sum": 1}, "cities": {"$addToSet": "$city"}}}]
    agg = {r["_id"]: r async for r in db.courses.aggregate(pipeline)}
    return [
        {"code": code, "name": name, "count": agg.get(code, {}).get("count", 0),
         "cities": sorted(agg.get(code, {}).get("cities", []))}
        for code, name in STATES
    ]


@api_router.get("/courses", response_model=List[Course])
async def list_courses(
    state: Optional[str] = None, city: Optional[str] = None, featured: Optional[bool] = None,
    sort: Optional[str] = None, q: Optional[str] = None, limit: int = Query(default=500, le=1000),
):
    query = {}
    if state:
        query["state"] = state.lower()
    if city:
        query["citySlug"] = city.lower()
    if featured is not None:
        query["featured"] = featured
    if q and q.strip():
        rx = re.compile(re.escape(q.strip()), re.IGNORECASE)
        state_codes = [c for c, n in STATES if rx.search(n)]
        query["$or"] = [{"name": rx}, {"city": rx}, {"state": {"$in": state_codes}}]
    cursor = db.courses.find(query, NO_ID)
    if sort == "top":
        cursor = cursor.sort([("rating", -1), ("reviewCount", -1)])
    else:
        cursor = cursor.sort([("featured", -1), ("rating", -1), ("reviewCount", -1)])
    return await cursor.to_list(limit)


@api_router.get("/popular-cities")
async def popular_cities():
    pipeline = [
        {"$group": {"_id": {"state": "$state", "city": "$city", "slug": "$citySlug"},
                    "courses": {"$sum": 1}, "avgRating": {"$avg": "$rating"}}},
        {"$sort": {"courses": -1, "avgRating": -1}},
        {"$limit": 12},
    ]
    return [
        {"city": r["_id"]["city"], "state": r["_id"]["state"], "slug": r["_id"]["slug"],
         "courses": r["courses"], "avgRating": round(r["avgRating"], 1)}
        async for r in db.courses.aggregate(pipeline)
    ]


@api_router.get("/courses/{course_id}", response_model=Course)
async def get_course(course_id: str):
    doc = await db.courses.find_one({"id": course_id}, NO_ID)
    if not doc:
        raise HTTPException(status_code=404, detail="Course not found")
    return doc


@api_router.get("/content", response_model=SiteContent)
async def get_content():
    return await db.site_content.find_one({"key": "main"}, NO_ID)


# ---------- Admin routes ----------
def _validate_state(code: str) -> str:
    code = code.lower()
    if code not in STATE_NAMES:
        raise HTTPException(status_code=400, detail="Invalid state code")
    return code


@api_router.post("/courses", response_model=Course, status_code=201)
async def create_course(body: CourseIn, user: dict = Depends(get_current_user)):
    data = body.model_dump()
    data["state"] = _validate_state(data["state"])
    data["citySlug"] = slugify_city(data["city"])
    data["id"] = str(uuid.uuid4())
    data["createdAt"] = datetime.now(timezone.utc).isoformat()
    if not data["image"]:
        data["image"] = COURSE_IMAGES[uuid.UUID(data["id"]).int % len(COURSE_IMAGES)]
    await db.courses.insert_one(dict(data))
    return data


@api_router.put("/courses/{course_id}", response_model=Course)
async def update_course(course_id: str, body: CourseIn, user: dict = Depends(get_current_user)):
    existing = await db.courses.find_one({"id": course_id}, NO_ID)
    if not existing:
        raise HTTPException(status_code=404, detail="Course not found")
    data = body.model_dump()
    data["state"] = _validate_state(data["state"])
    data["citySlug"] = slugify_city(data["city"])
    if not data["image"]:
        data["image"] = existing["image"]
    await db.courses.update_one({"id": course_id}, {"$set": data})
    return {**existing, **data}


@api_router.delete("/courses/{course_id}")
async def delete_course(course_id: str, user: dict = Depends(get_current_user)):
    res = await db.courses.delete_one({"id": course_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Course not found")
    return {"ok": True}


@api_router.put("/content", response_model=SiteContent)
async def update_content(body: SiteContent, user: dict = Depends(get_current_user)):
    data = body.model_dump()
    await db.site_content.update_one({"key": "main"}, {"$set": data}, upsert=True)
    return data


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Startup seeding ----------
@app.on_event("startup")
async def seed():
    await db.users.create_index("username", unique=True)
    await db.courses.create_index("id", unique=True)
    await db.courses.create_index([("state", 1), ("citySlug", 1)])
    await db.login_attempts.create_index("identifier")

    username = os.environ["ADMIN_USERNAME"].lower()
    password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"username": username})
    if not existing:
        await db.users.insert_one({"id": str(uuid.uuid4()), "username": username, "role": "admin",
                                   "password_hash": hash_password(password),
                                   "createdAt": datetime.now(timezone.utc).isoformat()})
    elif not verify_password(password, existing["password_hash"]):
        await db.users.update_one({"username": username}, {"$set": {"password_hash": hash_password(password)}})

    if await db.courses.count_documents({}) == 0:
        now = datetime.now(timezone.utc).isoformat()
        docs = [{**c, "id": str(uuid.uuid4()), "createdAt": now} for c in build_courses()]
        await db.courses.insert_many(docs)
        logger.info("Seeded %d courses", len(docs))

    if await db.site_content.count_documents({"key": "main"}) == 0:
        await db.site_content.insert_one({"key": "main", **SITE_CONTENT})


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
