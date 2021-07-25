const mongoose = require('mongoose')

const apartmentSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Apartment name is required']
	},
    owner: {
		type: String,
		required: [true, 'Owner is required']
	},
    address: {
        houseNo: {
            type: Number,
            required: [true, 'House number is required']
        },
        street: {
            type: String,
            required: [true, 'Street is required']
        },

        postalCode: {
            type: Number,
            required: [true, 'Postal code is required']
        },
        state: {
            type: String,
            required: [true, 'State is required']
        }
    },
    city: {
        type: String,
        required: [true, 'City is required']
    },
    country: {
        type: String,
        required: [true, 'Country is required']
    },
    geoLocation: {
        type: {
            type: String,
            default: "Point"
        },
        coordinates: {
            type: [Number],
            required: [true, 'Coordinates are required']
        }
    },
    rooms: {
		type: Number,
		required: [true, 'Room count is required']
	},
	price: {
		type: Number,
		required: [true, 'Price is required']
	}
}, {
    collation: { locale: 'en', strength: 2 }
});

apartmentSchema.index({ geoLocation: '2dsphere' });

module.exports = mongoose.model('Apartment', apartmentSchema);