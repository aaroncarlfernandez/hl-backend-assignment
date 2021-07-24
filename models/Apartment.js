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
            required: true
        },
        street: {
            type: String,
            required: true,
        },

        postalCode: {
            type: Number,
            required: true
        },
        state: {
            type: String,
            required: true
        }
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    geoLocation: {
        type: {
            type: String,
            default: "Point"
            // enum: ["Point"]
        },
        coordinates: {
            type: [Number]
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