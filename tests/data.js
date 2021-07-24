module.exports = {
    invalidToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZ",
    testUser1: {
        email: "testuser@email.com",
        firstName: "Test",
        lastName: "User",
        password: "testuser"
    },
    testUser2: {
        email: "testuser2@email.com",
        firstName: "Test 2",
        lastName: "User 2",
        password: "testuser2"
    },
    apartment1: {
        name: "Beautiful Apartment - Makati",
        houseNo: 20,
        street: "Test Street",
        city: "Makati",
        postalCode: 74047,
        state: "NCR",
        country: "Philippines",
        rooms: 5,
        price: 500,
        geoLocation: { 
            type: "Point",
            coordinates: [16.23284629237154, 65.89111120713999]
        }
    },
    apartment2: {
        name: "An Apartment - Paranaque",
        houseNo: 40,
        street: "Sample Street",
        postalCode: 1705,
        state: "NCR",
        country: "Philippines",
        rooms: 2,
        price: 200,
        geoLocation: { 
            type: "Point",
            coordinates: [40.23284629237154, 87.89111120713999]
        }
    },
    apartment3: {
        name: "2 bedroom studio in Makati",
        houseNo: 3,
        street: "Bangkal Street",
        city: "Makati",
        postalCode: 74050,
        state: "NCR",
        country: "Philippines",
        rooms: 2,
        price: 450,
        geoLocation: { 
            type: "Point",
            coordinates: [18.23284629237154, 69.89111120713999]
        }
    },
    apartment4: {
        name: "Loft type apartment in Makati",
        houseNo: 3,
        street: "Legazpi Street",
        city: "Makati",
        postalCode: 74051,
        state: "NCR",
        country: "Philippines",
        rooms: 1,
        price: 350,
        geoLocation: { 
            type: "Point",
            coordinates: [20.23284629237154, 73.89111120713999]
        }
    },
    apartmentSeeds: [
        {
            name: "Studio unit - BGC",
            houseNo: 1,
            street: "Fairway Street",
            city: "Taguig",
            postalCode: 21342,
            state: "NCR",
            country: "Philippines",
            rooms: 1,
            price: 700,
            geoLocation: { 
                type: "Point",
                coordinates: [41.23284629237154, 74.89111120713999]
            }
        },
        {
            name: "2 bedroom premium condominium - BGC",
            houseNo: 89,
            street: "Knapsal Street",
            city: "Taguig",
            postalCode: 21350,
            state: "NCR",
            country: "Philippines",
            rooms: 2,
            price: 1200,
            geoLocation: { 
                type: "Point",
                coordinates: [40.23284629237154, 73.89111120713999]
            }
        },
        {
            name: "Loft type unit - BGC",
            houseNo: 103,
            street: "Knapsal Street",
            city: "Taguig",
            postalCode: 21350,
            state: "NCR",
            country: "Philippines",
            rooms: 1,
            price: 900,
            geoLocation: { 
                type: "Point",
                coordinates: [42.23284629237154, 74.89111120713999]
            }
        },
        {
            name: "Bungalow house - Pasig",
            houseNo: 45,
            street: "Knickknack Street",
            city: "Pasig",
            postalCode: 78940,
            state: "NCR",
            country: "Philippines",
            rooms: 5,
            price: 1500,
            geoLocation: { 
                type: "Point",
                coordinates: [87.23284629237154, 24.89111120713999]
            }
        }
    ]
}