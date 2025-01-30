import sqlite3
from sqlite3 import Error

def get_db(db_path):
    """Open connection to sqlite database."""

    conn = None
    try:
        conn = sqlite3.connect(db_path)
        return conn
    except Error as e:
        print(e)
    return conn

def initialize_db(db_path):
    """Initialize 'data' table."""

    ## Define command to initialize data table.
    cmd_create_data_table = """CREATE TABLE IF NOT EXISTS data (
        workerId TEXT NOT NULL,
        subId TEXT NOT NULL,
        task TEXT NOT NULL,
        json TEXT NOT NULL
    );
    """

    ## Define command to create index.
    cmd_create_index = """CREATE INDEX data_workerId
                          ON data (workerId);"""

    ## Get connection to database.
    conn = get_db(db_path)

    ## Initialize table.
    if conn is not None:

        try:
            c = conn.cursor()
            c.execute(cmd_create_data_table)
            c.execute(cmd_create_index)
        except Error as e:
            print(e)

    ## Close connection.
    conn.close()

def add_data(db_path, values):
    """Add row to 'data' table (workerId, subId, task, json)."""

    ## Define command.
    cmd = '''INSERT INTO data(workerId,subId,task,json)
             VALUES(?,?,?,?)'''

    ## Get connection to database.
    conn = get_db(db_path)

    ## Add worker.
    c = conn.cursor()
    c.execute(cmd, values)
    conn.commit()

    ## Close connection.
    conn.close()

def get_worker(db_path, workerId):
    """Return number of rows in 'data' table matching workerId."""

    ## Define command.
    cmd = "SELECT COUNT(*) FROM data WHERE workerId=?"

    ## Get connection to database.
    conn = get_db(db_path)

    ## Query database.
    c = conn.cursor()
    c.execute(cmd, (workerId,))
    k, = c.fetchone()

    return k
