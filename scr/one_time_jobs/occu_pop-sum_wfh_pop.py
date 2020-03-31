import csv, os
from datetime import date
from pymongo import MongoClient, ASCENDING
from tqdm import tqdm

client = MongoClient('mongodb://localhost:27017/')

db_corona = client.corona
col_occu = db_corona.occu_pop

rl_occu = list(col_occu.find({}))

all_fields = ["all_pop","manage_pop","prof_pop","health_pop","protect_pop","food_pop","building_pop","care_pop","sale_pop","office_pop","farm_pop","construction_pop","production_pop","transportation_pop"]

wfh_fields = ["manage_pop", "prof_pop", "office_pop"]

for each_record in tqdm(rl_occu):
    wfh_pop = 0
    _id = each_record["_id"]
    for each_field in wfh_fields:
        a_field = each_record[each_field]
        if a_field == None:
            wfh_pop = None
        else:
            wfh_pop += a_field
    
    col_occu.update_one({"_id": _id}, {"$set":{"wfh_pop": wfh_pop}})
