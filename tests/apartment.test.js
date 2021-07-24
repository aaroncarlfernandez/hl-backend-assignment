const createServer = require("../helpers/server")
const mongoose = require("mongoose")
const app = createServer();
const expect = require("chai").expect;
const supertest = require("supertest");
const User = require("../models/User");
const Apartment = require("../models/Apartment");

const testData = require('./data.js')
const invalidToken = testData.invalidToken
const testUser1 = testData.testUser1
const apartment1 = testData.apartment1
const apartment2 = testData.apartment2
const apartment3 = testData.apartment3
const apartmentSeeds = testData.apartmentSeeds

let accessToken = "";
let userId = "";

beforeAll(async() => {
	await mongoose.connect(process.env.MONGO_TEST_DB2,
		{   useNewUrlParser: true, 
            useFindAndModify: false,
            useCreateIndex: true,
            useUnifiedTopology: true 
        }
	)
    await supertest(app)
    .post("/api/users/register")
    .send(testUser1)
    .then(async (response) => userId = response.body.result._id )
    await supertest(app)
    .post("/api/users/login")
    .send(testUser1)
    .then(async (response) => accessToken = response.body.accessToken )
    await loadSeeds()
})

const loadSeeds = async () => {
    for (let seed of apartmentSeeds) {
        seed.owner = userId
        await supertest(app)
        .post("/api/apartments/create")
        .set('Authorization', 'Bearer ' + accessToken)
        .send(seed)
    }
}

afterAll((done) => {
	mongoose.connection.db.dropDatabase(() => {
		mongoose.connection.close(() => done())
	})
})

describe("POST /api/users/create - Create a new apartment with a valid request", () => {
    it("should return 201 and create the apartment", async () => {
        apartment1.owner = userId
        await supertest(app)
            .post("/api/apartments/create")
            .set('Authorization', 'Bearer ' + accessToken)
            .send(apartment1)
            .then(async (response) => {
                expect(response.status).to.equal(201)
                expect(response.body.result.name).to.equal(apartment1.name)
                expect(response.body.result.address.houseNo).to.equal(apartment1.houseNo)
                expect(response.body.result.address.street).to.equal(apartment1.street)
                expect(response.body.result.city).to.equal(apartment1.city)
                expect(response.body.result.address.postalCode).to.equal(apartment1.postalCode)
                expect(response.body.result.address.state).to.equal(apartment1.state)
                expect(response.body.result.country).to.equal(apartment1.country)
                expect(response.body.result.rooms).to.equal(apartment1.rooms)
                expect(response.body.result.price).to.equal(apartment1.price)
                expect(response.body.result.geoLocation.type).to.equal(apartment1.geoLocation.type)
                expect(response.body.result.geoLocation.coordinates).to.eql(apartment1.geoLocation.coordinates)

                const apartment = await Apartment.findOne({ _id: response.body.result._id })
                expect(apartment.name).to.equal(apartment1.name)
                expect(apartment.address.houseNo).to.equal(apartment1.houseNo)
                expect(apartment.address.street).to.equal(apartment1.street)
                expect(apartment.city).to.equal(apartment1.city)
                expect(apartment.address.postalCode).to.equal(apartment1.postalCode)
                expect(apartment.address.state).to.equal(apartment1.state)
                expect(apartment.country).to.equal(apartment1.country)
                expect(apartment.rooms).to.equal(apartment1.rooms)
                expect(apartment.price).to.equal(apartment1.price)
                expect(apartment.geoLocation.type).to.equal(apartment1.geoLocation.type)
                expect(apartment.geoLocation.coordinates).to.eql(apartment1.geoLocation.coordinates)
            })
    });
})

describe("POST /api/users/create - Create a new apartment with a missing city parameter", () => {
    it("should return 400 and not create the apartment", async () => {
        await supertest(app)
            .post("/api/apartments/create")
            .set('Authorization', 'Bearer ' + accessToken)
            .send(apartment2)
            .then(async (response) => {
                expect(response.status).to.equal(400)
                expect(response.body.message).to.equal("Bad request")
                expect(response.body.error.name).to.equal("ValidationError")
            })
    });
})

describe("POST /api/users/create - Create a new apartment with a missing token", () => {
    it("should return 401 and not create the apartment", async () => {
        await supertest(app)
            .post("/api/apartments/create")
            .send(apartment3)
            .then(async (response) => {
                expect(response.status).to.equal(401)
                expect(response.body.message).to.equal("Missing token")
            })
    });
})

describe("POST /api/users/create - Create a new apartment with an invalid token", () => {
    it("should return 401 and not create the apartment", async () => {
        await supertest(app)
            .post("/api/apartments/create")
            .set('Authorization', 'Bearer ' + invalidToken)
            .send(apartment3)
            .then(async (response) => {
                expect(response.status).to.equal(401)
                expect(response.body.message).to.equal("Authentication failed")
            })
    });
})

describe("GET /api/users/search - Search by city", () => {
    it("should return 200 and return 3 documents", async () => {
        await supertest(app)
            .get("/api/apartments/search?city=Taguig")
            .then(async (response) => {
                expect(response.status).to.equal(200)
                expect(response.body.result.length).to.equal(3)
            })
    });
})

describe("GET /api/users/search - Search by city, country, rooms", () => {
    it("should return 200 and return 2 documents", async () => {
        await supertest(app)
            .get("/api/apartments/search?city=Taguig&rooms=1&country=Philippines")
            .then(async (response) => {
                expect(response.status).to.equal(200)
                expect(response.body.result.length).to.equal(2)
            })
    });
})

describe("GET /api/users/search - Search by city (mixed case), country (mixed case), rooms", () => {
    it("should still return 200 and the 2 matching documents", async () => {
        await supertest(app)
            .get("/api/apartments/search?city=TaGuIg&rooms=1&country=PhiliPPiNes")
            .then(async (response) => {
                expect(response.status).to.equal(200)
                expect(response.body.result.length).to.equal(2)
            })
    });
})

describe("GET /api/users/search - Search by city and maxDistance of 200kms", () => {
    it("should return 200 and return 2 documents", async () => {
        await supertest(app)
            .get("/api/apartments/search?city=Taguig&rooms=1&country=Philippines&lng=40.23284629237154&lat=73.89111120713999&maxDistance=200")
            .then(async (response) => {
                expect(response.status).to.equal(200)
                expect(response.body.result.length).to.equal(2)
            })
    });
})

describe("GET /api/users/search - Search by city and tight maxDistance of only 1 km", () => {
    it("should return 200 and return 0 document", async () => {
        await supertest(app)
            .get("/api/apartments/search?city=Taguig&rooms=1&country=Philippines&lng=40.23284629237154&lat=73.89111120713999&maxDistance=1")
            .then(async (response) => {
                expect(response.status).to.equal(200)
                expect(response.body.result.length).to.equal(0)
            })
    });
})

describe("GET /api/users/search - Search by maxDistance (200kms) only", () => {
    it("should return 200 and return 3 documents", async () => {
        await supertest(app)
            .get("/api/apartments/search?lng=40.23284629237154&lat=73.89111120713999&maxDistance=200")
            .then(async (response) => {
                expect(response.status).to.equal(200)
                expect(response.body.result.length).to.equal(3)
            })
    });
})

describe("GET /api/users/search - Search with invalid longitude and latitude values", () => {
    it("should return 400 and notify the user that the longitude and latitude values are incorrect", async () => {
        await supertest(app)
            .get("/api/apartments/search?lng=190.23284629237154&lat=73.89111120713999&maxDistance=200")
            .then(async (response) => {
                expect(response.status).to.equal(400)
                expect(response.body.message).to.equal("maxDistance should be supplied with valid longitude and latitude values")
            })
    });
})

describe("GET /api/users/search - Search with maxDistance but missing longitude and latitude values", () => {
    it("should return 400 and notify the user that the longitude and latitude values are incorrect", async () => {
        await supertest(app)
            .get("/api/apartments/search?maxDistance=200")
            .then(async (response) => {
                expect(response.status).to.equal(400)
                expect(response.body.message).to.equal("maxDistance should be supplied with valid longitude and latitude values")
            })
    });
})