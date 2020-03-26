import csv, os
from datetime import date
from pymongo import MongoClient, ASCENDING

client = MongoClient('mongodb://localhost:27017/')

db_case = client.corona
col_case = db_case.system_info

data_location = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + "\data\\system_info.csv"
print(data_location)
col_case.drop()

with open(data_location) as the_file:
    the_reader = csv.reader(the_file, delimiter=',')
    line_count = 0
    field_names = []
    records = []

    for row in the_reader:
        if line_count == 0:
            field_names = row
        else:
            numbers = row
            insertion = {}
            for index in range(len(numbers)):
                item = numbers[index]
                insertion[field_names[index]] = item.strip()
            records.append(insertion)
        line_count += 1
    
    col_case.insert_many(records)