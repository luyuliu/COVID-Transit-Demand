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
col_ridership = db_corona.other_ridership_hourly


start_date = date(2020, 3 ,16)
end_date = date(2020, 4, 13)

def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days)):
        yield start_date + timedelta(n)



for each_date in (list(daterange(start_date, end_date))):
    dic = {}
    system_count = 0
    first_count = 0
    second_count = 0
    first_sum = 0
    second_sum = 0
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
        system_name = name
        z = item["actual"]
        y = item["normal"]
        x = list(range(len(y)))

        normal_peaks, _ = find_peaks(y, prominence=0.05)
        actual_peaks, _2 = find_peaks(z)

        first_peak_height = 0
        second_peak_height = 0
        first_peak = -1
        second_peak = -1

        first_peak_normal = -1
        second_peak_normal = -1
        first_peak_height_normal = -1
        second_peak_height_normal = -1

        for each_peak in actual_peaks:
            actual_peak_height = z[each_peak]
            if each_peak < 12:
                if actual_peak_height > first_peak_height:
                    first_peak_height = actual_peak_height
                    first_peak = each_peak
            else:
                if actual_peak_height > second_peak_height:
                    second_peak_height = actual_peak_height
                    second_peak = each_peak

        for each_peak in normal_peaks:
            normal_peak_height = y[each_peak]
            if each_peak < 12:
                if normal_peak_height > first_peak_height_normal:
                    first_peak_height_normal = normal_peak_height
                    first_peak_normal = each_peak
            else:
                if normal_peak_height > second_peak_height_normal:
                    second_peak_height_normal = normal_peak_height
                    second_peak_normal = each_peak

        # for each_peak_index in range(len(normal_peaks)):
        #     if each_peak_index == 0:
        #         first_peak_normal = normal_peaks[each_peak_index]
        #     if each_peak_index == 1:
        #         second_peak_normal = normal_peaks[each_peak_index]
                
        print('"' + system_name + '"',  ',', first_peak_normal, ',', first_peak, ';', second_peak_normal, ",", second_peak)


        if first_peak == -1:
            diff_first_peak = 999
        else:
            diff_first_peak = first_peak - first_peak_normal
            first_count += 1 
            first_sum += diff_first_peak

        if second_peak == -1:
            diff_second_peak = 999
        else:
            diff_second_peak = second_peak - second_peak_normal
            second_count += 1
            second_sum += diff_second_peak

        # print(each_date, '"' + system_name + '"', first_sum/first_count, second_sum/second_count)
    break

        # # Plot separately
        # the_plot = plt.plot(x, y, '-', x, z, '-')
        # plt.xlabel('x: hour')
        # plt.ylabel('y: transit demand (%)')
        # plt.grid(True)
        # plt.title(name, fontsize=16)
        # plt.savefig("C:\\Users\\liu.6544\\Desktop\\coronapics\\demand_hourly_aggregated\\" + name + "_" + each_date.strftime("%Y-%m-%d")
        #             + ".jpg")
        # plt.clf()

