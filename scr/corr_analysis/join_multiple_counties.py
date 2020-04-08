import numpy as np
import matplotlib.pyplot as plt
import scipy.optimize
import csv
import os
from datetime import date
from pymongo import MongoClient, ASCENDING
from scipy.optimize import leastsq
client = MongoClient('mongodb://localhost:27017/')

db_corona = client.corona
col_system = db_corona.system_info
col_case = db_corona.case_count
col_ridership = db_corona.ridership

col_occu = db_corona.census_transit_pop

rl_system = col_system.find({})
for each_system in rl_system:
    system_name =  each_system["name"]
    try:
        county_FIPS = each_system["county_FIPS"]
    except:
        continue

    rl_occu = col_occu.find_one({"county_FIPS": int(county_FIPS)})
    try:
        wfh_pop = rl_occu["transit_pop"]
    except:
        print(county_FIPS)
    all_pop = rl_occu["all_pop"]
    print('"', system_name ,'"', wfh_pop, all_pop)