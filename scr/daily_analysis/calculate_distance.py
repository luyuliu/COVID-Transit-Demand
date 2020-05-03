import numpy as np
import matplotlib.pyplot as plt
import scipy.optimize
import csv
import os
from datetime import date, datetime, timedelta
from pymongo import MongoClient, ASCENDING
from scipy.optimize import leastsq
from tqdm import tqdm
client = MongoClient('mongodb://localhost:27017/')

db_corona = client.corona
col_system = db_corona.system_info
col_case = db_corona.corona_cases_usafacts
col_ridership = db_corona.ridership

rl_system = list(col_system.find({}))

dic = {}

threshold_list = [1, 2, 3, 4, 5, 6, 7, 10, 20, 30, 40, 50, 100]

for i in tqdm(threshold_list):
    for each_system in rl_system:
        _id = each_system["_id"]
        system_name = each_system["name"]
        metro_area = each_system["metro_area"]

        try:
            county_FIPS = each_system["county_FIPS"]
        except:
            continue
        rl_case = list(col_case.find(
            {"county_FIPS": county_FIPS}).sort("date", 1))

        if rl_case == []:
            # print(each_system)
            continue

        pandemic_date = None
        for each_record in rl_case:
            if each_record["confirmed"] < i:
                continue
            else:
                pandemic_date = datetime.strptime(
                    each_record["date"], "%Y%m%d")
                break
        if pandemic_date != None:
            demand_start_date = datetime.strptime("20200215", "%Y%m%d")
            divergent_point = each_system["divergent_point"]
            try:
                divergent_point = float(divergent_point)
            except:
                continue
            divergent_date = demand_start_date + \
                timedelta(days=int(divergent_point))

            date_delta = pandemic_date - divergent_date
            date_delta_days = date_delta.days
        else:
            date_delta_days = None
        try:
            dic[system_name]
        except:
            dic[system_name] = []
        dic[system_name].append(date_delta_days)

for index, item in dic.items():
    print('"', index, '"', item)
