import csv, os
from datetime import date
from pymongo import MongoClient, ASCENDING

client = MongoClient('mongodb://localhost:27017/')

db_case = client.corona
col_case = db_case.system_info
col_corona = db_case.google_trend

data_location = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))) + "\\data\\google_trend\\DMA_join.csv"
print(data_location)

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
                if field_names[index] == "name":
                    system_name = item
                if field_names[index] == "DMA":
                    rl_google = col_corona.find_one({"DMA": item})
                    if rl_google != None:
                        trend = rl_google['COVID19']
                        trend_coronavirus = rl_google["Coronavirus"]
                        rl_case = col_case.find_one({"name": system_name})
                        col_case.update_one({"_id": rl_case["_id"]}, {"$set": {"google_trend_COVID19": trend, "google_trend_Coronavirus": trend_coronavirus}})
                    else:
                        print(item)
                    


            records.append(insertion)


        line_count += 1
    
    # col_case.insert_many(records)