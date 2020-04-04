DOMAIN = {
    'ridership': {'datasource': {'source': 'ridership'}},
        'case_count': {'datasource': {'source': 'case_count'}},
        'county_info': {'datasource': {'source': 'county_info'}},
        'occupation_population': {'datasource': {'source': 'occupation_population'}},
        'occupation_industry': {'datasource': {'source': 'occupation_industry'}},
        'system_info': {'datasource': {'source': 'system_info'}},
        'occu_pop': {'datasource': {'source': 'occu_pop'}},
        'corona_cases': {'datasource': {'source': 'corona_cases'}},
        'other_ridership': {'datasource': {'source': 'other_ridership'}},
        }
MONGO_HOST = 'localhost'
MONGO_PORT = 27017

MONGO_DBNAME = "corona"

ALLOW_UNKNOWN=True

X_DOMAINS='*'

PAGINATION_LIMIT = 10000

PAGINATION_DEFAULT = 10000