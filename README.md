# send-it

[![Build Status](https://travis-ci.com/toritsejuFO/send-it.svg?token=w84myhM3Tt1dXmVd3fd1&branch=dev)](https://travis-ci.com/toritsejuFO/send-it)
[![codecov](https://codecov.io/gh/toritsejuFO/send-it/branch/dev/graph/badge.svg?token=RMF2g3ltZS)](https://codecov.io/gh/toritsejuFO/send-it)
[![npm version](https://badge.fury.io/js/npm.svg)](https://badge.fury.io/js/npm)

SendIT is a courier service that helps users deliver parcels to different destinations.

The project is implemented according to the specifications which can be found in the SendIT-Javascript.pdf file. For example, you could ask why I'm not using sequelize rather than going direct with node-postgres for database interactions, that's beacuse the project specification said so.

The project is based on specifications received from Andela at a time, during applications to be a volunteer mentor at one of their programs.

## Development Setup (Linux)

### Requirements
- Nodejs (>=12)
- npm | yarn
- PostgresSQL

### Getting Started
1. Clone repo
3. Copy `.env.sample` to `.env` and edit appropriately
2. Run `./utils/create_db.sh sendit`. A helper script to create DB (and tables) locally or you can create maually. The argument passed to the script indicates the database name, and must match the value in env file.
2. Run `npm i` to install dependencies
3. Run `npm run watch` to get started

### Running Test
To run tests, you have to create a test DB and also create all needed tables.
I've created a bash script to automate this process. It uses `localhost` for connection, and
assumes `postgres` as the default database user.

```bash
  npm run create-test-db
  npm test
```

## Meta
You can find the link to the pivotal [here](https://www.pivotaltracker.com/n/projects/2321232#)