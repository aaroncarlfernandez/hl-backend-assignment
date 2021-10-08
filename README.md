# Homelike Backend Assignment
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




## POST /api/users/register

_Creates an account which can be used to log in._

Example: POST  http://localhost:4000/api/users/register

Request body:
    
      {
          "email": "johndoe@email.com",
          "firstName": "John",
          "lastName": "Doe",
          "password": "johndoe"  
      }
    
    
## POST /api/users/login

_Logs in an account and returns the bearer token which can be used to access secured services such as apartment creation, marking an apartment as a favorite, etc.._

Example: POST  http://localhost:4000/api/users/login

Request body:

      {
          "email": "johndoe@email.com",
          "password": "johndoe"  
      }
    
        
## PUT /api/users/mark-favorite

_Marks an existing apartment as a favorite._

Example: PUT  http://localhost:4000/api/users/mark-favorite/

_Requires a bearer token returned from POST /api/users/login_

Request body:

      {
          "userId": "60fb9a2f19f0ce65a2f5d15c",
          "apartmentId": "60fb96a7fef5f76431f53bc2"
      }
      
      
        
## GET /api/users/favorites/:userId

_Returns all the aparments marked as a favorite by the user._

Example: GET  http://localhost:4000/api/users/favorites/60fb9a2f19f0ce65a2f5d15c

_Requires a bearer token returned from POST /api/users/login_


## POST /api/apartments/create

_Creates an apartment._

Example: POST  http://localhost:4000/api/apartments/create

_Requires a bearer token returned from POST /api/users/login_

Request body:

      {
              "name": "Beautiful Apartment - Manila",
              "owner": "60fb9a2f19f0ce65a2f5d15c"",
              "houseNo": 20,
              "street": "Orchid Street",
              "city": "Manila",
              "postalCode": 74047,
              "state": "NCR",
              "country": "Philippines",
              "rooms": 5,
              "price": 500,
              "geoLocation": { 
                  "type": "Point",
                  "coordinates": [16.23284629237154, 65.89111120713999]
              }
      }


## GET /api/apartments/search?rooms=<room count>&city=&country=&lng=lat=&maxDistance=

_Returns the list of created apartment per room count, city, country and max distance filter. Max distance always requires a valid longitude value (from -180 to 180) and a valid latitude value (-90 to 90)_

Example: Return only apartments with 5 rooms in Manila City, Philippines, 20 kms relative to the geolocation of the user (longitude and latitude values given).
  
  GET  http://localhost:4000/api/apartments/search?rooms=5&city=manila&country=Philippines&lng=13.23284629237154&lat=58.89111120713999&maxDistance=20
  
Example: Return all apartments with 2 rooms.
  
  GET  http://localhost:4000/api/apartments/search?rooms=2
  
Example: Return all apartments in Manila City, Philippines
  
  GET  http://localhost:4000/api/apartments/search?city=manila&country=Philippines
 
Example: Return only apartments 10 kms relative to the geolocation of the user (longitude and latitude values given).
  
  GET  http://localhost:4000/api/apartments/search?lng=13.23284629237154&lat=58.89111120713999&maxDistance=10
  

    

    
