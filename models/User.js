const mongoose = require('mongoose')

const userSchema = new mongoose.Schema ({
    email: {
		type: String,
		required: [true, 'Email is required']
	},
	firstName: {
		type: String,
		required: [true, 'First name is required']
	},
	lastName: {
		type: String,
		required: [true, 'Last name is required']
	},
	password: {
		type: String,
		required: [true, 'Password is required']
	},
	favorites: [{
		apartmentId: {
			type: String
		},
		timestamp: {
			type: Date, 
			default: Date.now
		}
	}]	
},{
	collation: { locale: 'en', strength: 2 }
});

module.exports = mongoose.model('User', userSchema);