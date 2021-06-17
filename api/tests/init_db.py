import json


def init_db(database):
    database_path = 'database.json'
    with open(database_path, 'r') as database_file:
        for collection, values in json.load(database_file).items():
            database[collection].insert_many(values)
