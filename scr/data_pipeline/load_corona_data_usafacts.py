import csv, os, json
from datetime import date, timedelta
from pymongo import MongoClient, ASCENDING
from copy import deepcopy

client = MongoClient('mongodb://localhost:27017/')

db_case = client.corona
col_case = db_case.corona_cases

data_location = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))) + "\\data\\COVID19_case_count\\allData.json"
print(data_location)
col_case.drop()
first_date = date(2020, 1, 22)

with open(data_location) as the_file:
    data = json.load(the_file)
    for each_county in data:        
        today_record = {}
        today_record['county_FIPS'] = each_county["countyFIPS"]
        today_record['county'] = each_county["county"]
        today_record['state'] = each_county["stateAbbr"]
        today_record['state_FIPS'] = each_county["stateFIPS"]
        death_time_series = each_county["deaths"]
        confirmed_time_series = each_county["confirmed"]

        for date_delta in range(len(death_time_series)):
            real_today_record = deepcopy(today_record)
            today_date = first_date + timedelta(days = date_delta)
            real_today_record["date"] = today_date.strftime("%Y%m%d")
            real_today_record["confirmed"] = confirmed_time_series[date_delta]
            real_today_record["death"] = death_time_series[date_delta]
            col_case.insert_one(real_today_record)