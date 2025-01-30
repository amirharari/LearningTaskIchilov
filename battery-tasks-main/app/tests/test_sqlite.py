import os, sys, sqlite3
from tqdm import tqdm
ROOT_DIR = os.path.dirname(os.path.realpath(__file__))

## Define parameters.
n_subj = 3000            # Number of participants.
n_task = 7               # Number of total tasks per participant.
n_char = 200000          # Number of total characters per JSON file.

## Import NivTurk functions.
sys.path.append('..')
from db import initialize_db, add_data, get_worker
from utils import gen_code

## Initialize example database.
db_path = os.path.join(ROOT_DIR, 'app.db')
if os.path.isfile(db_path): os.remove(db_path)
initialize_db(db_path)

## Iteratively populate example database.
print('Populating data table.')
json = gen_code(n_char)
workerIds = []

for i in tqdm(range(n_subj)):

    ## Simulate workerId.
    workerIds.append(gen_code(24))

    for j in range(n_task):

        ## Populate values.
        values = (
            workerIds[-1],    # workerId
            '%0.6d' %i,       # subId
            '%0.2d' %i,       # task
            json              # json
        )

        ## Add row to 'data' table.
        add_data(db_path, values)

## Querying table.
print('Querying data table.')

for workerId in tqdm(workerIds[:1000]):
    get_worker(db_path, workerId)

## Remove example data.
os.remove(db_path)
