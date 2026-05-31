from pymongo import MongoClient # Provided by: PyMongo (Official MongoDB Driver)
import os                       # Provided by: Python Standard Library
import psycopg
from dotenv import load_dotenv

load_dotenv()

def video_exists(title):
    # Method: .getenv() | Provider: os module
    # Why: Retrieves config from OS memory to keep credentials out of source.
    uri = os.getenv("MONGO_URI")
        
    # Attribute: self.client | Object Provider: PyMongo (MongoClient)
    # Why: 'self' attaches the connection to the instance so other methods can see it.
    # TS Equivalent: this.client = new MongoClient(uri);
    client = MongoClient(uri)
        
    # Attribute: self.db | Object Provider: PyMongo (Database instance)
    # Why: Captures the specific database target for all subsequent queries.
    db = client["test"] 
    # Syntax: def method_name(self, param):
    # Why: Methods must explicitly receive 'self' to access 'self.db'.
        
    # Method: __getitem__ ([]) | Provider: PyMongo (Database instance)
    # Why: Accesses a specific collection (table) within the database.
    collection = db["videos"]
        
    # Method: .find_one() | Provider: PyMongo (Collection instance)
    # Why: Executes a query. It returns a Dictionary if found, or 'None' if not.
    result = collection.find_one({"title": title})

    # Logic: Identity check.
    # Why: 'is not None' is the Pythonic way to perform a null check.
    # TS Equivalent: return result !== null;
    return result is not None

def legacy_video_exists(title):

    # Function: connect() | Provider: psycopg
    # Why: Establishes a connection to the PostgreSQL database using environment-based configuration.
    conn = psycopg.connect(
        user=os.getenv("PGUSER"),
        password=os.getenv("PGPASSWORD"),
        host=os.getenv("PGHOST"),
        port=os.getenv("PGPORT"),
        dbname=os.getenv("PGDATABASE")
    )

    # Method: .cursor() | Provider: psycopg Connection
    # Why: Creates a cursor object used to execute SQL statements.
    cursor = conn.cursor()

    # Method: .execute() | Provider: psycopg Cursor
    # Why: Executes a parameterized SQL query against the database.
    cursor.execute(
        "SELECT title FROM videos WHERE title = %s",
        (title,)
    )

    # Method: .fetchone() | Provider: psycopg Cursor
    # Why: Returns the first matching row as a tuple, or None if no row exists.
    result = cursor.fetchone()

    # Method: .close() | Provider: psycopg Connection
    # Why: Releases the database connection and associated resources.
    conn.close()

    # Logic: Identity check.
    # Why: 'is not None' is the Pythonic way to perform a null check.
    # TS Equivalent: return result !== null;
    return result is not None