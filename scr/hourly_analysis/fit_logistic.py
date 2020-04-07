import numpy as np
import matplotlib.pyplot as plt
import scipy.optimize
import csv
import os
from datetime import date, timedelta
from pymongo import MongoClient, ASCENDING
from scipy.optimize import leastsq
client = MongoClient('mongodb://localhost:27017/')

db_corona = client.corona
col_system = db_corona.system_info
col_case = db_corona.corona_cases_usafacts
col_ridership = db_corona.ridership_hourly

rl_system = col_system.find({})

start_date = date(2020, 3 ,16)
end_date = date(2020, 4, 2)

def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days)):
        yield start_date + timedelta(n)

for each_date in (list(daterange(start_date, end_date))):
    system_count = 0
    for each_system in rl_system:
        _id = each_system["_id"]
        system_name = each_system["name"]
        metro_area = each_system["metro_area"]
        rl_ridership = list(col_ridership.find(
            {"name": system_name, "day": each_date.strftime("%Y-%m-%d")}).sort("time", ASCENDING))

        y = []
        z = []
        x = []

        if len(rl_ridership) == 0:
            continue
            
        print(system_name, metro_area)
        for each_record in rl_ridership:
            if each_record["actual"] != 0:
                y.append( each_record["normal"] / each_record["actual"])
            else:
                y.append(1)
            z.append(each_record["actual"])
        x = list(range(len(y)))

        # Plot separately
        the_plot = plt.plot(x, y, '-', x, z, '-')
        plt.xlabel('x')
        plt.ylabel('y', rotation='horizontal')
        plt.grid(True)
        plt.title(system_name, fontsize=16)
        plt.savefig("C:\\Users\\liu.6544\\Desktop\\coronapics\\demand_hourly\\" + metro_area + "_" +
                    system_name + ".jpg")
        plt.clf()
    
    break


    #     # Plot together
    #     the_plot = plt.plot(x, y, '.')
        
    #     plt.xlabel('x')
    #     plt.ylabel('y', rotation='horizontal')
    #     plt.grid(True)
    #     plt.title(system_name, fontsize=16)
    # plt.savefig("C:\\Users\\liu.6544\\Desktop\\coronapics\\demand\\all.jpg")



