#!/bin/sh

DB_NAME="$2";

# Use default database name if none is passed
DB_NAME=${DB_NAME:-'sendit_test'}

# Create database
psql \
  -c "CREATE DATABASE $DB_NAME;" \
  -c "\c $DB_NAME;" \
  -c "CREATE TABLE users (id SERIAL UNIQUE NOT NULL, firstname VARCHAR(50) NOT NULL, lastname VARCHAR(50) NOT NULL, othernames VARCHAR(50), email VARCHAR(128) UNIQUE NOT NULL, username VARCHAR(50) UNIQUE NOT NULL, password VARCHAR(60) NOT NULL, registered DATE DEFAULT NOW(), isAdmin BOOL, phone VARCHAR(15) NOT NULL, PRIMARY KEY(id));" \
  -c "CREATE TYPE sendit_status_enum AS ENUM ('placed', 'transiting', 'delivered');" \
  -c "CREATE TABLE parcels (id serial UNIQUE NOT NULL, placedBy INTEGER NOT NULL REFERENCES users(id), weight FLOAT, weightmetrics VARCHAR(10), deliveredOn DATE NOT NULL, status sendit_status_enum NOT NULL, fromAddress VARCHAR(100), toAddress VARCHAR(100), currentLocation VARCHAR(100), PRIMARY KEY(id));" \
  -U postgres \
  -h localhost