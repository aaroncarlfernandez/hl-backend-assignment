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
const testUser2 = testData.testUser2
const apartmentSeeds = testData.apartmentSeeds

let favoriteApartments = [];
let accessToken = "";
let userId = "";

beforeAll(async() => {
	await mongoose.connect(process.env.MONGO_TEST_DB1,
		{   useNewUrlParser: true, 
            useFindAndModify: false,
            useCreateIndex: true,
            useUnifiedTopology: true 
        }
	)
    await supertest(app)
    .post("/api/users/register")
    .send(testUser2)
    .then(async (response) => userId = response.body.result._id)
    await supertest(app)
    .post("/api/users/login")
    .send(testUser2)
    .then(async (response) => accessToken = response.body.accessToken )
    await loadSeeds()
    await loadFavorites()
})

const loadSeeds = async () => {
    for (let seed of apartmentSeeds) {
        seed.owner = userId
        await supertest(app)
        .post("/api/apartments/create")
        .set('Authorization', 'Bearer ' + accessToken)
        .send(seed)
        .then(async (response) => {
            favoriteApartments.push({
                userId: userId,
                apartmentId: response.body.result._id
            })
        })
    }
}

const loadFavorites = async () => {
    for (let i=0; i<2; i++) {
        await supertest(app)
        .put("/api/users/mark-favorite")
        .set('Authorization', 'Bearer ' + accessToken)
        .send(favoriteApartments[i])
    }
}

afterAll((done) => {
	mongoose.connection.db.dropDatabase(() => {
		mongoose.connection.close(() => done())
	})
})

describe("POST /api/users/register - Register with a new email", () => {
    it("should return 201 and register the user", async () => {
        await supertest(app)
            .post("/api/users/register")
            .send(testUser1)
            .then(async (response) => {
                expect(response.status).to.equal(201)
                expect(response.body.message).to.equal("User created successfully")
                expect(response.body.result.email).to.equal(testUser1.email)
                expect(response.body.result.firstName).to.equal(testUser1.firstName)
                expect(response.body.result.lastName).to.equal(testUser1.lastName)
                expect(response.body.result.password).to.not.equal(testUser1.password)
    
                const user = await User.findOne({ _id: response.body.result._id })
                expect(user.email).to.equal(testUser1.email)
                expect(user.firstName).to.equal(testUser1.firstName)
                expect(user.lastName).to.equal(testUser1.lastName)
                expect(user.password).to.not.equal(testUser1.password)
            })
    });
})

describe("POST /api/users/register - Register with an existing email", () => {
    it("should return 409 and not register the user", async () => {
        await supertest(app)
            .post("/api/users/register")
            .send(testUser1)
            .then(async (response) => {
                expect(response.status).to.equal(409);
                expect(response.body.message).to.equal("Email already exists")
            })
    });  
})

describe("POST /api/users/login - Login with a valid credential", () => {
    it("should return 200 and its accessToken", async () => {
        await supertest(app)
            .post("/api/users/login")
            .send({
                email: testUser1.email,
                password: testUser1.password
            })
            .then(async (response) => {
                expect(response.status).to.equal(200);
                expect(response.body.message).to.equal("Login successfully")
            })
    });
})

describe("POST /api/users/login - Login with an incorrect password", () => {
    it("should return 401 and not return its accessToken", async () => {
        await supertest(app)
            .post("/api/users/login")
            .send({
                email: testUser1.email,
                password: "incorrectpassword"
            })
            .then(async (response) => {
                expect(response.status).to.equal(401);
                expect(response.body.message).to.equal("Email or password is incorrect")
            })
    });
})

describe("POST /api/users/login - Login with a non-existing email", () => {
    it("should return 404 and not return its accessToken", async () => {
        await supertest(app)
            .post("/api/users/login")
            .send({
                email: "notexisting@email.com",
                password: "incorrectpassword"
            })
            .then(async (response) => {
                expect(response.status).to.equal(404);
                expect(response.body.message).to.equal("Email not found")
            })
    });
})

describe("PUT /api/users/mark-favorite/ - mark a valid apartment as favorite with a valid user", () => {
    it("should return 200 and include the apartment in the user's favorites", async () => {
        await supertest(app)
            .put("/api/users/mark-favorite")
            .set('Authorization', 'Bearer ' + accessToken)
            .send(favoriteApartments[2])
            .then(async (response) => {
                expect(response.status).to.equal(200);
                expect(response.body.message).to.equal("Apartment marked favorite successfully")

                const userFavorite = await User.findOne(
                    { _id: favoriteApartments[2].userId }, 
                    { favorites: 
                        { $elemMatch: 
                            { apartmentId : favoriteApartments[2].apartmentId 
                            } 
                        }
                    })
                expect(favoriteApartments[2].apartmentId).to.equal(userFavorite.favorites[0].apartmentId)
            })
    });
})

describe("PUT /api/users/mark-favorite/ - mark favorite an already favorite apartment", () => {
    it("should return 200 and notify the user it is already marked as a favorite", async () => {
        await supertest(app)
            .put("/api/users/mark-favorite")
            .set('Authorization', 'Bearer ' + accessToken)
            .send(favoriteApartments[2])
            .then(async (response) => {
                expect(response.status).to.equal(200);
                expect(response.body.message).to.equal("Apartment already marked as a favorite")
            })
    });
})

describe("PUT /api/users/mark-favorite/ - mark a valid apartment as favorite with a missing token", () => {
    it("should return 401 and notify the user that the accessToken is missing", async () => {
        await supertest(app)
            .put("/api/users/mark-favorite")
            .send(favoriteApartments[3])
            .then(async (response) => {
                expect(response.status).to.equal(401)
                expect(response.body.message).to.equal("Missing token")
            })
    });
})

describe("PUT /api/users/mark-favorite/ - mark a valid apartment as favorite with an invalid token", () => {
    it("should return 401 and notify the user that the authentication failed", async () => {
        await supertest(app)
            .put("/api/users/mark-favorite")
            .set('Authorization', 'Bearer ' + invalidToken)
            .send(favoriteApartments[3])
            .then(async (response) => {
                expect(response.status).to.equal(401)
                expect(response.body.message).to.equal("Authentication failed")
            })
    });
})

describe("PUT /api/users/mark-favorite/ - mark a non existing apartment as favorite with a valid user", () => {
    it("should return 404 and notify the user that the apartment does not exists", async () => {
        await supertest(app)
            .put("/api/users/mark-favorite")
            .set('Authorization', 'Bearer ' + accessToken)
            .send({
                userId: userId,
                apartmentId: "60fb96a7fef5f76431f53bc2"
            })
            .then(async (response) => {
                expect(response.status).to.equal(404);
                expect(response.body.message).to.equal("Apartment does not exist")
            })
    });
})

describe("GET /api/users/favorites/:userId - get user favorite apartments", () => {
    it("should return 200 and return the all user's favorite apartments", async () => {
        await supertest(app)
            .get(`/api/users/favorites/${userId}`)
            .set('Authorization', 'Bearer ' + accessToken)
            .then(async (response) => {
                expect(response.status).to.equal(200);
                expect(response.body.message).to.equal("User favorites fetched successfully")
                expect(response.body.result.length).to.equal(3)
            })
    });
})

describe("GET /api/users/favorites/:userId - get user favorite apartments with a missing token", () => {
    it("should return 401 and notify the user that the accessToken is missing", async () => {
        await supertest(app)
            .get(`/api/users/favorites/${userId}`)
            .then(async (response) => {
                expect(response.status).to.equal(401)
                expect(response.body.message).to.equal("Missing token")
            })
    });
})

describe("GET /api/users/favorites/:userId - get user favorite apartments with an invalid token", () => {
    it("should return 401 and notify the user that the authentication failed", async () => {
        await supertest(app)
            .get(`/api/users/favorites/${userId}`)
            .set('Authorization', 'Bearer ' + invalidToken)
            .then(async (response) => {
                expect(response.status).to.equal(401)
                expect(response.body.message).to.equal("Authentication failed")
            })
    });
})

