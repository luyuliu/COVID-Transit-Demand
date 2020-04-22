import numpy as np
import matplotlib.pyplot as plt
import scipy.optimize
from scipy.signal import find_peaks
import csv
import similaritymeasures
import os
import math
from datetime import date, timedelta, datetime
from pymongo import MongoClient, ASCENDING
from scipy.optimize import leastsq
client = MongoClient('mongodb://localhost:27017/')

db_corona = client.corona
col_system = db_corona.system_info_all
col_case = db_corona.corona_cases_usafacts
col_ridership = db_corona.aggregated_ridership_hourly

rl_system = ["All cities", "United Kingdom", "United States", "France", "Canada"]

start_date = date(2020, 3, 16)
end_date = date(2020, 4, 19)


def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days)):
        yield start_date + timedelta(n)


dic = {}

for each_system in rl_system:
    system_count = 0
    first_count = 0
    second_count = 0
    first_sum = 0
    second_sum = 0

    first_error_normal = 0
    first_error_actual = 0

    for each_date in (list(daterange(start_date, end_date))):
        each_weekday = each_date.weekday()
        today_date = each_date.strftime("%Y%m%d")
        try:
            dic[today_date]
        except:
            dic[today_date] = {}

        system_name = each_system
        rl_ridership = list(col_ridership.find(
            {"name": system_name, "day": each_date.strftime("%Y%m%d")}).sort("time", ASCENDING))
        y = []
        z = []
        w = []
        x = []

        try:
            dic[today_date][system_name]
        except:
            dic[today_date][system_name] = {}
            dic[today_date][system_name]["normal"] = []
            dic[today_date][system_name]["actual"] = []

        if len(rl_ridership) == 0:
            continue

        for each_record in rl_ridership:
            if each_record["actual"] != 0:
                y.append(each_record["normal"] / each_record["actual"])
            else:
                y.append(1)
            z.append(each_record["actual"])
            w.append(each_record["normal"])

        dic[today_date][system_name]['actual'] = z
        dic[today_date][system_name]['normal'] = w

        normal_peaks, _ = find_peaks(w, prominence=0.05)
        actual_peaks, _2 = find_peaks(z)

        first_peak = -1
        second_peak = -1
        first_peak_height = 0
        second_peak_height = 0

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
            normal_peak_height = w[each_peak]
            if each_peak < 12:
                if normal_peak_height > first_peak_height_normal:
                    first_peak_height_normal = normal_peak_height
                    first_peak_normal = each_peak
            else:
                if normal_peak_height > second_peak_height_normal:
                    second_peak_height_normal = normal_peak_height
                    second_peak_normal = each_peak

        if first_peak != -1 and first_peak_normal != -1:
            first_peak_diff = first_peak - first_peak_normal
            first_count += 1
            first_sum += first_peak_diff
        else:
            if first_peak == -1:
                first_error_actual += 1
            if first_peak_normal == -1:
                first_error_normal += 1


        if second_peak != -1 and second_peak_normal != -1:
            second_peak_diff = second_peak - second_peak_normal
            second_count += 1
            second_sum += second_peak_diff

        print(today_date, system_name, first_peak_diff, second_peak_diff)

    # first_average_shift = first_sum/first_count
    # second_average_shift = second_sum/second_count

    # print(today_date, each_weekday, len(rl_system), first_error_actual, first_error_normal,  first_count,
    #       first_average_shift, second_count, second_average_shift)


