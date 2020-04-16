import numpy as np
import matplotlib.pyplot as plt
import scipy.optimize
from scipy.signal import find_peaks
import csv, similaritymeasures
import os
from datetime import date, timedelta
from pymongo import MongoClient, ASCENDING
from scipy.optimize import leastsq
from tqdm import tqdm
client = MongoClient('mongodb://localhost:27017/')

db_corona = client.corona
col_system = db_corona.system_info
col_case = db_corona.corona_cases_usafacts
col_ridership = db_corona.aggregated_ridership_hourly


start_date = date(2020, 3 ,16)
end_date = date(2020, 4, 13)

def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days)):
        yield start_date + timedelta(n)



for each_date in tqdm(list(daterange(start_date, end_date))):
    dic = {}
    rl_ridership = col_ridership.find({"day": each_date.strftime("%Y-%m-%d")})

    for each_record in rl_ridership:
        name = each_record["name"]
        try:
            dic[name]
        except:
            dic[name] = {}
            dic[name]["actual"] = []
            dic[name]["normal"] = []
            
        dic[name]["actual"].append(each_record["actual"])
        dic[name]["normal"].append(each_record["normal"])

    for name, item in dic.items():
        y = item["actual"]
        z = item["normal"]
        x = list(range(len(y)))
        # Plot separately
        the_plot = plt.plot(x, y, '-', x, z, '-')
        plt.xlabel('x: hour')
        plt.ylabel('y: transit demand (%)')
        plt.grid(True)
        plt.title(name, fontsize=16)
        plt.savefig("C:\\Users\\liu.6544\\Desktop\\coronapics\\demand_hourly_aggregated\\" + name + "_" + each_date.strftime("%Y-%m-%d")
                    + ".jpg")
        plt.clf()

