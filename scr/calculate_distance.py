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

rl_system = col_system.find({})


for each_system in rl_system:
    _id = each_system["_id"]
    system_name = each_system["Agency Name"]
    metro_area = each_system["Metro Area"]
    print(system_name, metro_area)
    rl_ridership = col_ridership.find(
        {"system_name": system_name}).sort("date", ASCENDING)
    
    L = each_system["L"]
    k = each_system['k']
    x0 = each_system["x0"]
    y0 = each_system["y0"]
    L_case = each_system["L_case"]
    k_case = each_system['k_case']
    x0_case = each_system["x0_case"]
    y0_case = each_system["y0_case"]

    print()

    