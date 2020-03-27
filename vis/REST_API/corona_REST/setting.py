DOMAIN = {
    'ridership': {'datasource': {'source': 'ridership'}},
        'case_count': {'datasource': {'source': 'case_count'}},
        'system_info': {'datasource': {'source': 'system_info'}},
        'other_ridership': {'datasource': {'source': 'other_ridership'}},
        }
MONGO_HOST = 'localhost'
MONGO_PORT = 27017

MONGO_DBNAME = "corona"

ALLOW_UNKNOWN=True

X_DOMAINS='*'

PAGINATION_LIMIT = 10000

PAGINATION_DEFAULT = 10000