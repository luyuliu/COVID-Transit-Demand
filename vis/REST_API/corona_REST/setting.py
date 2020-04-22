DOMAIN = {
    'census_occupation_industry': {'datasource': {'source': 'census_occupation_industry'}},
        'ridership': {'datasource': {'source': 'ridership'}},
        'ridership_actual': {'datasource': {'source': 'ridership_actual'}},
        'ridership_hourly': {'datasource': {'source': 'ridership_hourly'}},
        'county_info': {'datasource': {'source': 'county_info'}},
        'ALC_LinkMe': {'datasource': {'source': 'ALC_LinkMe'}},
        'system_info_all': {'datasource': {'source': 'system_info_all'}},
        'aggregated_ridership_hourly': {'datasource': {'source': 'aggregated_ridership_hourly'}},
        'system_info_backup': {'datasource': {'source': 'system_info_backup'}},
        'census_occu_pop': {'datasource': {'source': 'census_occu_pop'}},
        'corona_cases_state_level': {'datasource': {'source': 'corona_cases_state_level'}},
        'google_trend': {'datasource': {'source': 'google_trend'}},
        'corona_cases_usafacts': {'datasource': {'source': 'corona_cases_usafacts'}},
        'census_transit_pop': {'datasource': {'source': 'census_transit_pop'}},
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