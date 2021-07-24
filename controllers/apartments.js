const User = require('../models/User');
const Apartment = require('../models/Apartment');
const ObjectId = require('mongoose').Types.ObjectId;
const path = require('path');

module.exports.create = (request, response) => {
    let apartment = new Apartment();
    apartment.name = request.body.name;
    apartment.owner = request.body.owner;
    apartment.address.houseNo = request.body.houseNo;
    apartment.address.street = request.body.street;
    apartment.address.postalCode = request.body.postalCode;
    apartment.address.state = request.body.state;
    apartment.city = request.body.city;
    apartment.country = request.body.country;
    apartment.geoLocation = request.body.geoLocation;
    apartment.rooms = request.body.rooms;
    apartment.price = request.body.price;

    apartment
    .save()
    .then( result => response.status(201).send({message: "Apartment created successfully", result: result}))
    .catch(error => { 
        if (error.name==="ValidationError") {
            response.status(400).send({ message: "Bad request", error: error}) 
        } else {
            response.status(500).send({ message: "Internal server error", error: error}) 
        }
    })
}

module.exports.search = (request, response) => {
    let query = { "$and": []};
    let invalidQueryMessage = "";

    if (request.query.maxDistance >= 0) {
        if (request.query.lng >= -180 && request.query.lng <= 180 && request.query.lat >= -90 && request.query.lat <= 90) {
            query["$and"].push({
                geoLocation:
                    {
                        $near:
                        {
                            $geometry: { type: "Point", coordinates: [request.query.lng, request.query.lat] }, 
                            $maxDistance: request.query.maxDistance * 1000
                        }
                    }
            });
            console
        } else {
            invalidQueryMessage = "maxDistance should be supplied with valid longitude and latitude values"
        }
    } 

    if (typeof request.query.city == "string") {
        query["$and"].push({ city: request.query.city });
    }
    if (request.query.country) {
        query["$and"].push({ country: request.query.country });
    }
    if (request.query.rooms) {
        query["$and"].push({ rooms: request.query.rooms });
    }

    if (invalidQueryMessage==="") {
        Apartment
        .find(query)
        .then(apartments => response.status(200).send({message: "Apartment search was successful", result: apartments}))
        .catch(error => response.status(500).send({ message: "Internal server error", error: error}))
    } else {
        response.status(400).send({ message: invalidQueryMessage })
    }
}

