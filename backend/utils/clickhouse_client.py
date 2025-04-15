from clickhouse_connect import get_client

def connect_to_clickhouse(host, port, database, user, token):
    return get_client(
        host=host,
        port=int(port),
        username=user,
        password=token,
        database=database
    )
