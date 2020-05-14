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


def sigmoid(p, x):
    x0, y0, L, k = p
    y = L / (1 + np.exp(-k*(x-x0))) + y0
    return y


def residuals(p, x, y):
    return y - sigmoid(p, x)


def resize(arr, lower=0.0, upper=1.0):
    arr = arr.copy()
    if lower > upper:
        lower, upper = upper, lower
    arr -= arr.min()
    arr *= (upper-lower)/arr.max()
    arr += lower
    return arr


for each_system in rl_system:
    _id = each_system["_id"]
    system_name = each_system["name"]
    if system_name != "COTA":
        continue
    metro_area = each_system["metro_area"]
    print(system_name, metro_area)
    rl_ridership = col_ridership.find(
        {"system_name": system_name}).sort("date", ASCENDING)
    y = []
    for each_record in rl_ridership:
        y.append(each_record["demand_decrease"])
    x = list(range(len(y)))
    start_date = datetime.strptime("20200215", "%Y%m%d")
    xx = [(start_date + timedelta(days=i)).strftime("%Y%m%d") for i in range(len(y))]
    # print((x))

    p_guess = (int(np.median(x)), 0, 1.0, 0.5)
    # if system_name == "CATA":
    #     continue
    p, cov, infodict, mesg, ier = leastsq(
        residuals, p_guess, args=(x, y), full_output=1)

    x0, y0, L, k = p
    results_005 = x0 - np.log(2/(0.05)-1)/k  # 2.5% range
    results_095 = x0 + np.log(2/(0.05)-1)/k  # 97.5% range
    print('''\
    x0 = {x0}
    y0 = {y0}
    L = {L}
    k = {k}
    x005 = {results_005}
    '''.format(x0=x0, y0=y0, L=L, k=k, results_005=results_005))

    xp = np.linspace(0, len(x), len(y))
    pxp = sigmoid(p, xp)

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
plt.savefig("C:\\Users\\liu.6544\\Desktop\\coronapics\\demand\\all.jpg", dpi=500)

