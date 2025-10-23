import os
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy import create_engine
from dotenv import load_dotenv


# ---- Step 1: Connect to DB ----
# conn = psycopg2.connect(
#     host="db.yhoocfyhzwwluoivsqbc.supabase.co",
#     dbname="postgres",
#     user="postgres",
#     password="@ticketBooking123",
#     port=5432,
#     sslmode="require" 
# )

load_dotenv()

engine = create_engine(os.getenv("DATABASE_URL"))

# ---- Step 2: Fetch user bookings ----
def get_user_booked_events(user_id):
    query = """
    SELECT e.event_id, e.name, e.category, e.tags
    FROM bookings b
    JOIN events e ON e.event_id = b.event_id
    WHERE b.user_id = %s;
    """
    return pd.read_sql(query, engine, params=(user_id,))

# ---- Step 3: Fetch all events ----
def get_all_events():
    query = """
    SELECT event_id, name, category, tags
    FROM events
    WHERE status = 'active' OR event_date >= CURRENT_DATE;
    """
    return pd.read_sql(query, engine)

# ---- Step 4: Recommend events ----
def recommend_events(user_id, top_n=5):
    user_events = get_user_booked_events(user_id)
    all_events = get_all_events()

    if user_events.empty:
        return "No bookings found for this user."

    # Combine features
    all_events['features'] = all_events['category'].fillna('') + " " + all_events['tags'].fillna('')

    # Vectorize
    vectorizer = TfidfVectorizer(stop_words='english')
    vectors = vectorizer.fit_transform(all_events['features'])

    # Get indices of booked events
    booked_indices = all_events[all_events['event_id'].isin(user_events['event_id'])].index

    # Compute similarity
    sim_scores = cosine_similarity(vectors[booked_indices], vectors).mean(axis=0)

    # Zero out already booked
    sim_scores[booked_indices] = 0

    # Sort top-N
    top_indices = sim_scores.argsort()[::-1][:top_n]
    recommendations = all_events.iloc[top_indices]

    return recommendations[['event_id', 'name', 'category', 'tags']]
