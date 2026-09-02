import random

COURSE_IMAGES = [
    "https://images.unsplash.com/photo-1657085716783-c0afbdabf96e?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1655567548560-79a23a2bd7e0?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1628766424655-f6cc8990fd1b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1665791567320-8cee5dc908d2?auto=format&fit=crop&q=80&w=800",
    "https://images.pexels.com/photos/6370072/pexels-photo-6370072.jpeg?auto=compress&w=800",
    "https://images.pexels.com/photos/6370119/pexels-photo-6370119.jpeg?auto=compress&w=800",
    "https://images.pexels.com/photos/11373658/pexels-photo-11373658.jpeg?auto=compress&w=800",
    "https://images.pexels.com/photos/5792836/pexels-photo-5792836.jpeg?auto=compress&w=800",
    "https://images.pexels.com/photos/6370070/pexels-photo-6370070.jpeg?auto=compress&w=800",
    "https://images.pexels.com/photos/6370107/pexels-photo-6370107.jpeg?auto=compress&w=800",
    "https://images.pexels.com/photos/32793874/pexels-photo-32793874.jpeg?auto=compress&w=800",
    "https://images.pexels.com/photos/6370064/pexels-photo-6370064.jpeg?auto=compress&w=800",
]

STATES = [
    ("al", "Alabama"), ("ak", "Alaska"), ("az", "Arizona"), ("ar", "Arkansas"), ("ca", "California"),
    ("co", "Colorado"), ("ct", "Connecticut"), ("de", "Delaware"), ("fl", "Florida"), ("ga", "Georgia"),
    ("hi", "Hawaii"), ("id", "Idaho"), ("il", "Illinois"), ("in", "Indiana"), ("ia", "Iowa"),
    ("ks", "Kansas"), ("ky", "Kentucky"), ("la", "Louisiana"), ("me", "Maine"), ("md", "Maryland"),
    ("ma", "Massachusetts"), ("mi", "Michigan"), ("mn", "Minnesota"), ("ms", "Mississippi"), ("mo", "Missouri"),
    ("mt", "Montana"), ("ne", "Nebraska"), ("nv", "Nevada"), ("nh", "New Hampshire"), ("nj", "New Jersey"),
    ("nm", "New Mexico"), ("ny", "New York"), ("nc", "North Carolina"), ("nd", "North Dakota"), ("oh", "Ohio"),
    ("ok", "Oklahoma"), ("or", "Oregon"), ("pa", "Pennsylvania"), ("ri", "Rhode Island"), ("sc", "South Carolina"),
    ("sd", "South Dakota"), ("tn", "Tennessee"), ("tx", "Texas"), ("ut", "Utah"), ("vt", "Vermont"),
    ("va", "Virginia"), ("wa", "Washington"), ("wv", "West Virginia"), ("wi", "Wisconsin"), ("wy", "Wyoming"),
]
STATE_NAMES = dict(STATES)

STATE_CITIES = {
    "al": ["Birmingham", "Gulf Shores", "Huntsville"], "ak": ["Anchorage", "Fairbanks", "Juneau"],
    "az": ["Tucson", "Mesa", "Flagstaff"], "ar": ["Little Rock", "Hot Springs", "Fayetteville"],
    "ca": ["San Diego", "Anaheim", "Santa Cruz"], "co": ["Colorado Springs", "Denver", "Estes Park"],
    "ct": ["Hartford", "Mystic", "New Haven"], "de": ["Rehoboth Beach", "Wilmington", "Dover"],
    "fl": ["Orlando", "Kissimmee", "Destin"], "ga": ["Savannah", "Atlanta", "Helen"],
    "hi": ["Honolulu", "Lahaina", "Kailua-Kona"], "id": ["Boise", "Coeur d'Alene", "Idaho Falls"],
    "il": ["Chicago", "Naperville", "Springfield"], "in": ["Indianapolis", "Fort Wayne", "Bloomington"],
    "ia": ["Des Moines", "Cedar Rapids", "Okoboji"], "ks": ["Wichita", "Overland Park", "Topeka"],
    "ky": ["Louisville", "Lexington", "Bowling Green"], "la": ["New Orleans", "Baton Rouge", "Lafayette"],
    "me": ["Old Orchard Beach", "Portland", "Bar Harbor"], "md": ["Ocean City", "Baltimore", "Annapolis"],
    "ma": ["Cape Cod", "Boston", "Springfield"], "mi": ["Traverse City", "Grand Rapids", "Mackinaw City"],
    "mn": ["Minneapolis", "Duluth", "Brainerd"], "ms": ["Biloxi", "Jackson", "Gulfport"],
    "mo": ["Branson", "Kansas City", "Lake Ozark"], "mt": ["Billings", "Missoula", "Bozeman"],
    "ne": ["Omaha", "Lincoln", "Kearney"], "nv": ["Las Vegas", "Reno", "Lake Tahoe"],
    "nh": ["North Conway", "Hampton Beach", "Manchester"], "nj": ["Wildwood", "Ocean City", "Point Pleasant"],
    "nm": ["Albuquerque", "Santa Fe", "Las Cruces"], "ny": ["Lake George", "Buffalo", "Long Island"],
    "nc": ["Myrtle Beach", "Outer Banks", "Charlotte"], "nd": ["Fargo", "Bismarck", "Grand Forks"],
    "oh": ["Sandusky", "Columbus", "Cincinnati"], "ok": ["Oklahoma City", "Tulsa", "Norman"],
    "or": ["Portland", "Bend", "Seaside"], "pa": ["Lancaster", "Hershey", "Pittsburgh"],
    "ri": ["Newport", "Misquamicut", "Providence"], "sc": ["Myrtle Beach", "Hilton Head", "Charleston"],
    "sd": ["Rapid City", "Sioux Falls", "Keystone"], "tn": ["Pigeon Forge", "Gatlinburg", "Nashville"],
    "tx": ["Houston", "San Antonio", "Austin"], "ut": ["Salt Lake City", "St. George", "Provo"],
    "vt": ["Burlington", "Stowe", "Killington"], "va": ["Williamsburg", "Richmond", "Norfolk"],
    "wa": ["Seattle", "Spokane", "Ocean Shores"], "wv": ["Charleston", "Morgantown", "Harpers Ferry"],
    "wi": ["Wisconsin Dells", "Milwaukee", "Madison"], "wy": ["Cheyenne", "Jackson", "Casper"],
}

NAME_TEMPLATES = [
    "Pirate's Cove Adventure Golf", "Jungle Falls Mini Golf", "Castle Kingdom Putt-Putt", "Lost Treasure Golf",
    "Dinosaur Adventure Golf", "Glow Galaxy Indoor Golf", "Safari Falls Mini Golf", "Shipwreck Island Golf",
    "Volcano Bay Putt-Putt", "Old Mill Miniature Golf", "Rainforest Adventure Golf", "Goofy Golf",
    "Mountain Mist Mini Golf", "Neon Putt Blacklight Golf", "Harbor Lights Mini Golf", "Wild West Putt-Putt",
    "Tropical Oasis Golf", "Caveman's Cove Mini Golf", "Lighthouse Point Mini Golf", "Fairway Fun Park",
]

DEFAULT_HOURS = {
    "Monday": "10:00 AM - 9:00 PM", "Tuesday": "10:00 AM - 9:00 PM", "Wednesday": "10:00 AM - 9:00 PM",
    "Thursday": "10:00 AM - 9:00 PM", "Friday": "10:00 AM - 11:00 PM", "Saturday": "9:00 AM - 11:00 PM",
    "Sunday": "9:00 AM - 8:00 PM",
}

BASE = [
    ("Tiki Adventure Zone", "Port Orange", "fl", 5, 179, True, "Tiki Adventure Zone brings a tropical island theme to Port Orange with waterfalls, tiki huts, and winding lush greens. An unforgettable 18-hole adventure the whole family will love."),
    ("The Xcapery Escape Rooms Inc", "Tulsa", "ok", 5, 181, True, "Part escape room, part glow-in-the-dark mini golf, The Xcapery in Tulsa is an entertainment hub packed with puzzles, blacklight holes, and group-friendly fun."),
    ("The Golf Stop", "Henderson", "nv", 5, 181, True, "The Golf Stop in Henderson combines indoor putting challenges with state-of-the-art simulators. Climate-controlled comfort and expertly designed holes year-round."),
    ("Breakout Games", "Virginia Beach", "va", 5, 21730), ("Axe Throwing/RAGE Room PCB", "Panama City Beach", "fl", 5, 3360),
    ("Underground Mini Golf", "Sacramento", "ca", 5, 1530), ("Sensology", "Reno", "nv", 5, 592),
    ("Bad Caddy Golf", "Salt Lake City", "ut", 5, 412), ("Five Iron Golf", "New York", "ny", 5, 249),
    ("On the Green, Indoor Golf", "Blaine", "mn", 5, 234), ("Cryptid Mountain Miniature Golf", "Morgantown", "wv", 5, 233),
    ("Club Twirl Golf Lounge", "Phoenix", "az", 5, 221), ("The Traveling Bear Indoor Mini Golf LLC", "Bristol", "va", 5, 213),
    ("Swing ATL", "Fairburn", "ga", 5, 206), ("Pagosa Escape Zone", "Pagosa Springs", "co", 5, 197),
    ("Essex Indoor Golf Center", "Essex", "ct", 5, 155), ("iSwing Indoor Golf", "Phoenix", "az", 5, 141),
    ("Flight Factory Discs", "Pensacola", "fl", 5, 133), ("4 Majors Indoor Golf", "Coral Springs", "fl", 5, 127),
    ("Zion Golf Club and Cafe & Bar", "Scottsdale", "az", 5, 116), ("Mr. Putters Miniature Golf", "Tampa", "fl", 5, 109),
    ("The 19th Hole, Inc.", "Watertown", "sd", 5, 91), ("Hive Golf", "Millcreek", "ut", 5, 86),
    ("X-Golf Stratford", "Stratford", "ct", 5, 80), ("Happy's Indoor Golf", "Southington", "ct", 5, 78),
    ("Swing Factory Golf", "Los Angeles", "ca", 5, 76), ("Pure Golf Players Club", "Springville", "ut", 5, 72),
    ("The Golf Pub", "Warner Robins", "ga", 5, 70), ("OnPar Now", "Pittsburgh", "pa", 5, 70),
    ("4 Seasons Golf", "Eden Prairie", "mn", 5, 67), ("Tee Times", "Georgetown", "ky", 5, 64),
    ("PAR365", "Roseville", "mn", 5, 64), ("Sinkers Lounge - Lawrence", "Lawrence", "ks", 5, 62),
    ("X-Golf Cary", "Cary", "nc", 5, 61), ("Golf-In", "Wichita", "ks", 5, 57),
    ("Woody's Top Putt", "Waycross", "ga", 5, 57), ("The Turn Golf Club", "Draper", "ut", 5, 53),
    ("Games To Go Nashville", "Franklin", "tn", 5, 51), ("18 Shots Golf", "Vancouver", "wa", 5, 50),
    ("Pours & Fores", "American Falls", "id", 5, 49), ("The Dugout Mini Golf", "Aberdeen", "md", 5, 46),
    ("The Local Drive", "Longmont", "co", 5, 46), ("The Golf Crypt", "Jupiter", "fl", 5, 46),
    ("FORE-TwenTEE Golf", "Prosper", "tx", 5, 46), ("Monster Mini Golf Katy", "Katy", "tx", 4.5, 111),
    ("Volcano Mountain Golf", "Naples", "fl", 4.5, 128), ("Lakeshore Miniature Golf", "Albany", "or", 4.5, 128),
    ("Magic Mini Golf", "St. Louis", "mo", 4.5, 93), ("Lost Pirates Adventure Golf", "Midland", "mi", 4.5, 44),
    ("Putt-Putt Fun Center Amelia Island", "Fernandina Beach", "fl", 4.5, 95), ("Wee Pines Mini Golf", "Pinehurst", "nc", 4.5, 40),
    ("Pink Flamingo Mini Golf Course", "High Springs", "fl", 4.5, 4), ("Landa Park Mini Golf", "New Braunfels", "tx", 4.5, 2),
    ("Gobbler's Knob Family Fun Park", "Cobleskill", "ny", 4.5, 120), ("Sandy Pond Links", "Riverhead", "ny", 4.5, 111),
    ("Heron's Cove Adventure Golf", "Fernandina Beach", "fl", 4.5, 59), ("Farmers Inn PA 18 Hole Mini Golf", "Sigel", "pa", 4.5, 113),
    ("Pine Creek Putt Putt", "Allison Park", "pa", 4.5, 66), ("Island Golf", "Dauphin Island", "al", 4.5, 65),
    ("Funland Mini Golf", "Decatur", "al", 4.5, 84),
]

POPULAR_EXTRA = {
    ("nv", "Las Vegas"): 4, ("mo", "Branson"): 4, ("sc", "Myrtle Beach"): 3, ("ks", "Wichita"): 3,
    ("fl", "Panama City Beach"): 3, ("va", "Virginia Beach"): 3, ("co", "Colorado Springs"): 3, ("mo", "St. Louis"): 2,
    ("nd", "Fargo"): 3, ("az", "Tucson"): 2, ("in", "Indianapolis"): 2, ("id", "Boise"): 2,
}


def slugify_city(c: str) -> str:
    return c.lower().replace(".", "").replace("'", "").replace(" ", "-")


def _course(i, name, city, state, rating, reviews, featured=False, desc=None):
    return {
        "name": name, "city": city, "citySlug": slugify_city(city), "state": state,
        "rating": rating, "reviewCount": reviews, "featured": featured,
        "image": COURSE_IMAGES[i % len(COURSE_IMAGES)],
        "address": f"{100 + i * 7} Fairway Drive, {city}, {state.upper()}",
        "phone": f"({300 + i % 600}) 555-0{str(100 + i)[-3:]}",
        "website": "https://example.com",
        "priceRange": random.choice(["$8 - $14 per round", "$10 - $16 per round", "$7 - $12 per round", "$12 - $18 per round"]),
        "description": desc or (
            f"{name} is a favorite mini golf destination in {city}, {STATE_NAMES[state]}. The course features creative "
            "obstacles, well-kept greens, and a fun layout that works for players of every age and skill level. Friendly "
            "staff, affordable pricing, and plenty of memorable holes make it a great pick for family outings, birthday "
            "parties, and date nights."
        ),
        "hours": DEFAULT_HOURS,
    }


def build_courses():
    random.seed(42)
    out = []
    i = 1
    for row in BASE:
        out.append(_course(i, *row))
        i += 1
    counts = {}
    for c in out:
        counts[c["state"]] = counts.get(c["state"], 0) + 1
    templates = list(NAME_TEMPLATES)
    random.shuffle(templates)
    t = 0

    def gen(city, state):
        nonlocal i, t
        base_name = templates[t % len(templates)]
        t += 1
        name = f"{base_name}" if t % 3 else f"{base_name} - {city}"
        rating = random.choice([4.0, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9])
        reviews = random.randint(12, 900)
        out.append(_course(i, name, city, state, rating, reviews))
        i += 1

    for code, _ in STATES:
        cities = STATE_CITIES[code]
        need = max(0, 2 - counts.get(code, 0))
        for k in range(need):
            gen(cities[k % len(cities)], code)
    for (code, city), n in POPULAR_EXTRA.items():
        for _ in range(n):
            gen(city, code)
    return out


SITE_CONTENT = {
    "heroTitle1": "Your Next Adventure",
    "heroTitle2": "Starts Here",
    "heroSubtitle": "Discover over 4,000 mini golf courses across the United States. Your perfect putt-putt paradise awaits!",
    "introTitle": "The Ultimate Mini Golf Experience Across America",
    "introParagraphs": [
        "Welcome to Mini Golf USA Directory, the most comprehensive resource for discovering mini golf courses throughout all 50 states. Whether you are planning a family outing, organizing a birthday party, looking for a memorable date night, or simply searching for outdoor fun everyone can enjoy, our directory features over 4,000 mini golf locations with detailed information including ratings, photos, hours, and reviews to help you find the perfect course near you.",
        "The variety of mini golf experiences available across America is remarkable and grows every year. Classic putt-putt layouts with windmills and ramps share the map with elaborate themed adventures, glow-in-the-dark blacklight rooms, indoor climate-controlled venues, and scenic outdoor courses built into natural landscapes from ocean bluffs to mountain valleys.",
        "Miniature golf has a special place in American culture going back more than a century. The game emerged in the early 1900s as an approachable, scaled-down take on traditional golf, boomed during the 1930s when thousands of affordable courses opened nationwide, and has evolved ever since into the creative themed attractions we know today.",
        "One of mini golf's greatest strengths is universal accessibility. No experience, athletic ability, or expensive gear is required. A three-year-old can play alongside a grandparent, and anyone can sink a hole-in-one on any given hole - which makes it perfect for mixed-age birthday parties, casual date nights, corporate team events, and multi-generation family reunions.",
        "The geography of mini golf in America is just as diverse. Florida leads the nation in courses per capita, with Orlando and Myrtle Beach serving as putt-putt meccas. California's beachside courses offer ocean views year-round, while northern states like Minnesota and Michigan have built thriving indoor scenes to beat the winter.",
        "Every listing in our directory includes the essentials you need to plan a visit with confidence: hours, pricing, course themes and features, accessibility details, and authentic ratings from real visitors. Photos let you preview the experience, and our search tools filter by location, rating, and proximity.",
        "Our directory stays current through an automated data pipeline that discovers new courses weekly and refreshes ratings quarterly. When courses close, change ownership, or update their offerings, our system catches those changes - and community feedback helps us keep everything accurate.",
        "Whether you are a seasoned enthusiast who tracks scores and plays tournaments, or a casual player after a relaxing afternoon with friends and family, Mini Golf USA Directory is here to help you find your next great course. Start exploring by state, by city, or by searching near your location - your next mini golf adventure is just a few clicks away.",
    ],
    "stats": [
        {"title": "4,000+ Locations", "text": "Find mini golf courses anywhere in the United States"},
        {"title": "Verified Reviews", "text": "Real ratings and reviews from mini golf enthusiasts"},
        {"title": "Up-to-date Info", "text": "Current hours, prices, and course details"},
    ],
    "whyTitle": "Why Choose Mini Golf for Your Next Outing?",
    "whyParagraphs": [
        "Mini golf stands out as one of the most affordable entertainment options for groups of any size. A typical round costs between five and fifteen dollars per person - significantly cheaper than bowling, movie theaters, escape rooms, or amusement parks - and many courses offer family packages and group discounts that bring the cost down even further.",
        "Unlike sports that demand training or natural talent, mini golf welcomes everyone from day one. There is no skill prerequisite and no steep learning curve, yet the game still offers enough nuance to keep competitive players engaged. The mix of luck, skill, and creative problem-solving means an underdog can beat a veteran on any given day.",
        "Weather rarely has to end your plans thanks to the growing number of indoor courses across the country. Air-conditioned venues offer a cool retreat from summer heat, covered courses keep the game going through rain, and indoor mini golf gives cold-weather states an active winter option.",
        "Perhaps the most underrated quality of mini golf is its social nature. The relaxed pace creates natural pauses for conversation between holes - ideal for catching up with friends or unhurried family time. Laughing at a bad shot or celebrating a lucky bounce creates memories that outlast the scorecard.",
    ],
    "shareTitle": "Share Mini Golf USA Directory",
    "shareText": "Know someone who loves mini golf? Share this directory with friends and family to help them discover great courses across the USA.",
}
