DOMAIN = {
    'census_car_renter': {'datasource': {'source': 'census_car_renter'}},
        'census_income': {'datasource': {'source': 'census_income'}},
        'google_trend_20200417': {'datasource': {'source': 'google_trend_20200417'}},
        'census_occupation_industry': {'datasource': {'source': 'census_occupation_industry'}},
        'ridership': {'datasource': {'source': 'ridership'}},
        'population': {'datasource': {'source': 'population'}},
        'ridership_actual': {'datasource': {'source': 'ridership_actual'}},
        'ridership_hourly': {'datasource': {'source': 'ridership_hourly'}},
        'county_info': {'datasource': {'source': 'county_info'}},
        'ALC_LinkMe': {'datasource': {'source': 'ALC_LinkMe'}},
        'social_media': {'datasource': {'source': 'social_media'}},
        'system_info_all': {'datasource': {'source': 'system_info_all'}},
        'census_commute_time': {'datasource': {'source': 'census_commute_time'}},
        'aggregated_ridership_hourly': {'datasource': {'source': 'aggregated_ridership_hourly'}},
        'system_info_backup': {'datasource': {'source': 'system_info_backup'}},
        'census_race': {'datasource': {'source': 'census_race'}},
        'census_occu_pop': {'datasource': {'source': 'census_occu_pop'}},
        'census_car_ownership': {'datasource': {'source': 'census_car_ownership'}},
        'census_age': {'datasource': {'source': 'census_age'}},
        'corona_cases_state_level': {'datasource': {'source': 'corona_cases_state_level'}},
        'google_trend_backup': {'datasource': {'source': 'google_trend_backup'}},
        'corona_cases_usafacts': {'datasource': {'source': 'corona_cases_usafacts'}},
        'census_transit_pop': {'datasource': {'source': 'census_transit_pop'}},
        'census_sex': {'datasource': {'source': 'census_sex'}},
        'census_occupation_population': {'datasource': {'source': 'census_occupation_population'}},
        'system_info': {'datasource': {'source': 'system_info'}},
        'corona_cases_github': {'datasource': {'source': 'corona_cases_github'}},
        'other_ridership_hourly': {'datasource': {'source': 'other_ridership_hourly'}},
        'other_ridership': {'datasource': {'source': 'other_ridership'}},
        }
MONGO_HOST = 'localhost'
MONGO_PORT = 27017

MONGO_DBNAME = "corona"

ALLOW_UNKNOWN=True

X_DOMAINS='*'

PAGINATION_LIMIT = 10000

PAGINATION_DEFAULT = 10000