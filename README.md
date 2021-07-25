# HL Backend Assignment
Simple REST APIs for user registration and authentication, apartment creation and search.

## Tech Stack
- Node.js
- Express.js
- MongoDB

## Installation
```
git clone https://github.com/aaroncarlfernandez/hl-backend-assignment.git
npm i
```

## Before you start
```
create config/config.env file with the following parameters:
  MONGO_URI=<mongodb URI for production>
  MONGO_TEST_DB1=<mongodb URI for testing user routes>
  MONGO_TEST_DB2=<mongodb URI for testing apartment routes (should be different from MONGO_TEST_DB1)>
  APP_SECRET=<random string>
  PORT=<local port number>
```
## Start the server
```
node index.js
```
## Run tests
```
npm run test
```
