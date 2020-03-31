import numpy as np
import matplotlib.pyplot as plt
import scipy.optimize
import csv
import os
from datetime import date
from pymongo import MongoClient, ASCENDING
from scipy.optimize import leastsq, curve_fit
client = MongoClient('mongodb://localhost:27017/')

db_corona = client.corona
col_system = db_corona.system_info
col_case = db_corona.case_count
col_ridership = db_corona.ridership

rl_system = col_system.find({})

state_abbr = {
    'Alabama': 'AL',
    'Alaska': 'AK',
    'American Samoa': 'AS',
    'Arizona': 'AZ',
    'Arkansas': 'AR',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'Delaware': 'DE',
    'D.C': 'DC',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Guam': 'GU',
    'Hawaii': 'HI',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Northern Mariana Islands':'MP',
    'Ohio': 'OH',
    'Oklahoma': 'OK',
    'Oregon': 'OR',
    'Pennsylvania': 'PA',
    'Puerto Rico': 'PR',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virgin Islands': 'VI',
    'Virginia': 'VA',
    'Washington': 'WA',
    'West Virginia': 'WV',
    'Wisconsin': 'WI',
    'Wyoming': 'WY'
}

for each_system in rl_system:
    _id = each_system["_id"]
    system_name = each_system["Agency Name"]
    metro_area = each_system["Metro Area"]
    county = each_system["County"]
    try:
        state = state_abbr[each_system["State"]]
    except:
        continue
    print(system_name, metro_area)
    rl_ridership = col_case.find(
        {"state": state, "county": county}).sort("date", ASCENDING)
    y = []
    x0_guess = 0
    for each_record in rl_ridership:
        y.append(each_record["case"])
        if each_record["case"] == 0:
            x0_guess +=1

    def exponential(x, L, k, y0):
        y = L* np.exp(k*(x - x0_guess)) + y0
        return y
    x = list(range(len(y)))
    print((y)) 
    
    if y == []:
        continue

    p_guess = (20, 0.2, 0)
    # if system_name == "CATA":
    #     continue
    # p, cov, infodict, mesg, ier = leastsq(
    #     residuals, p_guess, args=(x, y), full_output=1)

    try:
        popt, pcov = curve_fit(exponential, x, y, p0=p_guess)
    except:
        continue
    
    L, k, y0 = popt
    x0 = x0_guess
    print('''\
    x0 = {x0}
    y0 = {y0}
    L = {L}
    k = {k}
    '''.format(x0=x0, y0=y0, L=L, k=k))
    col_system.update_one({"_id": _id}, {"$set": {
                          "L_case": L, "k_case": k, "x0_case": x0, "y0_case": y0, "modified_at_case": date.today().strftime("%Y%m%d")}})

    xp = np.linspace(0, len(x), 1500)
    pxp = exponential(xp, L, k, y0)

    # Plot
    the_plot = plt.plot(x, y, '.', xp, pxp, '-')
    plt.xlabel('x')
    plt.ylabel('y', rotation='horizontal')
    plt.grid(True)
    # plt.show()
    plt.title(system_name, fontsize=16)
    plt.savefig("C:\\Users\\liu.6544\\Desktop\\coronapics\\case\\" + metro_area + "_" +
                system_name + ".jpg")
    plt.clf()
