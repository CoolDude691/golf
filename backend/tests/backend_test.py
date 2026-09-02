"""Backend API tests for Mini Golf USA directory."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")
if not BASE_URL:
    # Fallback to frontend/.env
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip()
                break
BASE_URL = BASE_URL.rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def token():
    r = requests.post(f"{API}/auth/login", json={"username": "admin", "password": "admin123"})
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


# ---------- Public routes ----------
class TestCourses:
    def test_list_all(self):
        r = requests.get(f"{API}/courses")
        assert r.status_code == 200
        data = r.json()
        assert len(data) >= 100, f"Expected ~150 courses got {len(data)}"
        states = {c["state"] for c in data}
        assert len(states) == 50, f"Got {len(states)} states"

    def test_filter_state(self):
        r = requests.get(f"{API}/courses", params={"state": "fl"})
        assert r.status_code == 200
        data = r.json()
        assert all(c["state"] == "fl" for c in data)
        assert len(data) > 0

    def test_filter_city_state(self):
        r = requests.get(f"{API}/courses", params={"city": "port-orange", "state": "fl"})
        assert r.status_code == 200
        data = r.json()
        assert len(data) >= 1
        assert all(c["citySlug"] == "port-orange" for c in data)

    def test_featured(self):
        r = requests.get(f"{API}/courses", params={"featured": "true"})
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 3, f"Expected 3 featured, got {len(data)}"
        assert all(c["featured"] for c in data)

    def test_sort_top_limit(self):
        r = requests.get(f"{API}/courses", params={"sort": "top", "limit": 12})
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 12
        ratings = [c["rating"] for c in data]
        assert ratings == sorted(ratings, reverse=True)

    def test_search_q(self):
        r = requests.get(f"{API}/courses", params={"q": "tiki"})
        assert r.status_code == 200
        data = r.json()
        assert len(data) >= 1
        assert any("tiki" in c["name"].lower() for c in data)

    def test_get_course_by_id(self):
        list_r = requests.get(f"{API}/courses", params={"limit": 1}).json()
        cid = list_r[0]["id"]
        r = requests.get(f"{API}/courses/{cid}")
        assert r.status_code == 200
        assert r.json()["id"] == cid

    def test_get_course_404(self):
        r = requests.get(f"{API}/courses/nonexistent-id-xyz")
        assert r.status_code == 404


class TestMisc:
    def test_states(self):
        r = requests.get(f"{API}/states")
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 50
        assert {"code", "name", "count", "cities"} <= set(data[0].keys())

    def test_popular_cities(self):
        r = requests.get(f"{API}/popular-cities")
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 12

    def test_content(self):
        r = requests.get(f"{API}/content")
        assert r.status_code == 200
        data = r.json()
        assert "heroTitle1" in data
        assert data["heroTitle1"] == "Your Next Adventure"


# ---------- Auth ----------
class TestAuth:
    def test_login_success(self):
        r = requests.post(f"{API}/auth/login", json={"username": "admin", "password": "admin123"})
        assert r.status_code == 200
        data = r.json()
        assert "token" in data
        assert data["user"]["username"] == "admin"
        assert data["user"]["role"] == "admin"

    def test_login_wrong_password(self):
        # Use non-existent username to avoid lockout on admin
        r = requests.post(f"{API}/auth/login", json={"username": "nonexistentuser999", "password": "wrong"})
        assert r.status_code == 401

    def test_me_with_token(self, auth_headers):
        r = requests.get(f"{API}/auth/me", headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["username"] == "admin"

    def test_me_without_token(self):
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401


# ---------- Admin CRUD ----------
class TestCRUD:
    created_ids = []

    def test_create_requires_auth(self):
        r = requests.post(f"{API}/courses", json={"name": "X", "city": "Y", "state": "fl"})
        assert r.status_code == 401

    def test_create_course(self, auth_headers):
        payload = {"name": "TEST_Course_Alpha", "city": "Test City", "state": "fl",
                   "rating": 4.5, "reviewCount": 10, "featured": False}
        r = requests.post(f"{API}/courses", json=payload, headers=auth_headers)
        assert r.status_code == 201, r.text
        data = r.json()
        assert data["name"] == "TEST_Course_Alpha"
        assert data["citySlug"] == "test-city"
        assert data["state"] == "fl"
        assert data["id"]
        assert data["image"]
        TestCRUD.created_ids.append(data["id"])

        # verify persistence
        g = requests.get(f"{API}/courses/{data['id']}")
        assert g.status_code == 200
        assert g.json()["name"] == "TEST_Course_Alpha"

    def test_create_invalid_state(self, auth_headers):
        r = requests.post(f"{API}/courses",
                          json={"name": "TEST_Bad", "city": "X", "state": "zz"},
                          headers=auth_headers)
        assert r.status_code == 400

    def test_update_course(self, auth_headers):
        assert TestCRUD.created_ids, "prior create test must run first"
        cid = TestCRUD.created_ids[0]
        r = requests.put(f"{API}/courses/{cid}",
                         json={"name": "TEST_Course_Updated", "city": "New City", "state": "ca"},
                         headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        assert data["name"] == "TEST_Course_Updated"
        assert data["state"] == "ca"
        assert data["citySlug"] == "new-city"

        g = requests.get(f"{API}/courses/{cid}").json()
        assert g["name"] == "TEST_Course_Updated"

    def test_update_requires_auth(self):
        r = requests.put(f"{API}/courses/whatever",
                         json={"name": "x", "city": "x", "state": "fl"})
        assert r.status_code == 401

    def test_delete_requires_auth(self):
        r = requests.delete(f"{API}/courses/whatever")
        assert r.status_code == 401

    def test_delete_course(self, auth_headers):
        assert TestCRUD.created_ids
        cid = TestCRUD.created_ids[0]
        r = requests.delete(f"{API}/courses/{cid}", headers=auth_headers)
        assert r.status_code == 200
        assert r.json() == {"ok": True}
        g = requests.get(f"{API}/courses/{cid}")
        assert g.status_code == 404
        TestCRUD.created_ids.clear()


class TestContentUpdate:
    def test_update_content(self, auth_headers):
        orig = requests.get(f"{API}/content").json()
        modified = dict(orig)
        modified["heroTitle1"] = "TEST_Hero_Title"
        r = requests.put(f"{API}/content", json=modified, headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["heroTitle1"] == "TEST_Hero_Title"
        # verify persistence
        g = requests.get(f"{API}/content").json()
        assert g["heroTitle1"] == "TEST_Hero_Title"
        # restore
        r2 = requests.put(f"{API}/content", json=orig, headers=auth_headers)
        assert r2.status_code == 200
        assert requests.get(f"{API}/content").json()["heroTitle1"] == orig["heroTitle1"]
