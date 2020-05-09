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
col_case = db_corona.corona_cases_usafacts
col_ridership = db_corona.ridership

rl_system = col_system.find({}).sort("divergent_point", 1)


def sigmoid(p, x):
    a, b, c, d = p
    return a*x**3 + b*x**2 + c*x + d
    # return a*np.exp(x-b) + c
    # print(x)
    # y = []
    # for xi in x:
    #     yi = a*xi*xi + b*xi + c
    #     y.append(yi)
    # return y


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


rl_ridership = col_system.find({})
y = []
x = []
for each_record in rl_ridership:
    y.append(each_record["k"])
    x.append(each_record["divergent_point"])

y = np.array(y)
x = np.array(x)
# print((x), y)

p_guess = (1, 1,  1, 1)
p, cov, infodict, mesg, ier = leastsq(
    residuals, p_guess, args=(x, y), full_output=1)

# p = np.polyfit(x, y, deg = 2)

print(p)

a0, b0, c0, d0 = p
print('''\
a = {a0}
b = {b0}
c = {c0}
'''.format(a0=a0, b0=b0, c0=c0))

xp = np.array(list(range(0, 30)))
pxp = sigmoid(p, xp)

# Plot separately
the_plot = plt.plot(x, y, '.', xp, pxp, '-')
plt.xlabel('divergent point')
plt.ylabel('Decay rate', rotation='vertical')
plt.grid(True)
plt.title("Decay rate - divergent point", fontsize=16)
plt.savefig(
    "C:\\Users\\liu.6544\\Desktop\\coronapics\\k_and_divergent_scatter.jpg")
plt.clf()


#     # Plot together
#     the_plot = plt.plot(x, y, '.')

#     plt.xlabel('x')
#     plt.ylabel('y', rotation='horizontal')
#     plt.grid(True)
#     plt.title(system_name, fontsize=16)
# plt.savefig("C:\\Users\\liu.6544\\Desktop\\coronapics\\demand\\all.jpg")

