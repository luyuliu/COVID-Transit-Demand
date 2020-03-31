import csv, os
from datetime import date
from pymongo import MongoClient, ASCENDING

client = MongoClient('mongodb://localhost:27017/')

db_corona = client.corona
col_occupation = db_corona.occupation_population
col_occupation_short = db_corona.occu_pop

rl_occupation = col_occupation.find({})

name_dic = {
    "Geographic Identifier": "geo_indentifier",
    "Name of Area": "area",
    "Qualifying Name": "full_name",
    "State": "state",
    "Logical Record Number": "logical_record_number",
    "State (FIPS)": "state_number",
    "County": "county_number",
    "Employed Civilian Population 16 Years and Over:": "all_pop",
    "Employed Civilian Population 16 Years and Over: Management, Business, and Financial Operations  Occupations": "manage_pop",
    "Employed Civilian Population 16 Years and Over: Professional and Related Occupations": "prof_pop",
    "Employed Civilian Population 16 Years and Over: Healthcare Support Occupations": "health_pop",
    "Employed Civilian Population 16 Years and Over: Protective Service Occupations": "protect_pop",
    "Employed Civilian Population 16 Years and Over: Food Preparation and Serving Related Occupations": "food_pop",
    "Employed Civilian Population 16 Years and Over: Building and Grounds Cleaning and Maintenance  Occupations": "building_pop",
    "Employed Civilian Population 16 Years and Over: Personal Care and Service Occupations": "care_pop",
    "Employed Civilian Population 16 Years and Over: Sales and Related Occupations": "sale_pop",
    "Employed Civilian Population 16 Years and Over: Office and Administrative Support Occupations": "office_pop",
    "Employed Civilian Population 16 Years and Over: Farming, Fishing, and Forestry Occupations": "farm_pop",
    "Employed Civilian Population 16 Years and Over: Construction, Extraction, and Maintenance  Occupations": "construction_pop",
    "Employed Civilian Population 16 Years and Over: Production Occupations": "production_pop",
    "Employed Civilian Population 16 Years and Over: Transportation and Material Moving Occupations": "transportation_pop"
}

for each_record in rl_occupation:
    a_record = {}
    for index, each_field in each_record.items():
        try:
            a_record[name_dic[index]] = each_field
        except:
            a_record[index] = each_field

    col_occupation_short.insert_one(a_record)
