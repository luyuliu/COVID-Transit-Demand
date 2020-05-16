import numpy as np
import matplotlib.pyplot as plt
import matplotlib.ticker as plticker
import scipy.optimize
import csv
import os
from datetime import date, timedelta, datetime
from pymongo import MongoClient, ASCENDING
from scipy.optimize import leastsq
client = MongoClient('mongodb://localhost:27017/')

db_corona = client.corona
col_system = db_corona.system_info
col_case = db_corona.corona_cases_usafacts
col_ridership = db_corona.ridership

rl_system = col_system.find({})

for each_system in rl_system:
    _id = each_system["_id"]
    system_name = each_system["name"]
    # if system_name != "COTA":
    #     continue
    metro_area = each_system["metro_area"]
    print(system_name, metro_area)
    rl_ridership = col_ridership.find(
        {"system_name": system_name}).sort("date", ASCENDING)
    y = []
    for each_record in rl_ridership:
        y.append(each_record["demand_decrease"] * 100)
    x = list(range(len(y)))
    start_date = datetime.strptime("20200215", "%Y%m%d")
    xx = [(start_date + timedelta(days=i)).strftime("%Y%m%d") for i in range(len(y))]
    # print((x))

    xp = np.linspace(0, len(x), len(y))

    # Plot together
    plt.plot(xx, y, '-')

    # this locator puts ticks at regular intervals
    xl = []
    a = 0
    for each_day in xx:
        if a % 14 == 0:
            xl.append(each_day)
        a += 1
    plt.xticks(xl, xl,
        rotation=0)

    plt.xlabel('x: days')
    plt.ylabel('y: transit demand decline (%)')
    plt.grid(True)
    plt.title("Transit demand decline trend for each day", fontsize=16)
    plt.savefig("C:\\Users\\liu.6544\\Desktop\\coronapics\\demand_line\\" + metro_area + "_" + system_name +".jpg", dpi=500)
    plt.clf()
