CREATE DATABASE mydatabase;

CREATE EXTERNAL TABLE IF NOT EXISTS users (
    first_name string,
    last_name string,
    gender string
)
PARTITIONED BY (id string)
STORED AS parquet
LOCATION 's3://<your_bucket_name>/data/'