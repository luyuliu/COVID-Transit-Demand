import numpy as np
import matplotlib.pyplot as plt
import scipy.optimize
from scipy.signal import find_peaks
import csv, similaritymeasures
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
        w = []
        x = []

        if len(rl_ridership) == 0:
            continue
            
        for each_record in rl_ridership:
            if each_record["actual"] != 0:
                y.append( each_record["normal"] / each_record["actual"])
            else:
                y.append(1)
            z.append(each_record["actual"])
            w.append(each_record["normal"])
        x = list(range(len(y)))
        n = len(z)

        normal_curve = np.array([x, w])
        actual_curve = np.array([x, z])

        # Calculate Similarity: p
        # print(normal_curve)
        sum_wz = 0
        sum_z2 = 0
        for i in range(n):
            sum_wz += w[i] * z[i]
            sum_z2 += z[i] * z[i]
        p = sum_wz / sum_z2

        S = 0
        for i in range(n):
            S += (p*z[i] - w[i]) ** 2


        # Calculate similarity: a
        sum_w = 0
        sum_z = 0
        for i in range(n):
            sum_w += w[i]
            sum_z += z[i]
        a = (sum_z - sum_w)/n
        
        s_a =0
        for i in range(n):
            s_a += (z[i] - w[i] - a) ** 2


        df = similaritymeasures.frechet_dist(normal_curve, actual_curve)
        
        print(system_name, ',', round(S, 8), ',', round(p, 8))

        # Find peaks
        max_decrease_times = max(y)
        normal_peaks, _ = find_peaks(w, prominence=0.1)
        actual_peaks, _2 = find_peaks(z, prominence=0.1/max_decrease_times)
        
        # print(system_name, ',', len(normal_peaks), ",",len(actual_peaks))
        # print(normal_peaks)
        # print(actual_peaks)

        # Plot separately
        the_plot = plt.plot(x, w, '-', x, z, '-')
        plt.xlabel('x: days')
        plt.ylabel('y: transit demand (%)')
        plt.grid(True)
        plt.title(system_name, fontsize=16)
        plt.savefig("C:\\Users\\liu.6544\\Desktop\\coronapics\\demand_hourly\\" + system_name + "_" + metro_area + "_" + str(int(df * 100))
                     + ".jpg")
        plt.clf()

        # Update
        col_system.update_one({"_id": _id}, {"$set": {"distance": S, "stretch_factor": p}})
    
    break


    #     # Plot together
    #     the_plot = plt.plot(x, y, '.')
        
    #     plt.xlabel('x')
    #     plt.ylabel('y', rotation='horizontal')
    #     plt.grid(True)
    #     plt.title(system_name, fontsize=16)
    # plt.savefig("C:\\Users\\liu.6544\\Desktop\\coronapics\\demand\\all.jpg")



