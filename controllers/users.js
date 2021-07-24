const User = require("../models/User")
const Apartment = require("../models/Apartment")
const bcrypt = require("bcrypt")
const ObjectId = require('mongoose').Types.ObjectId
const auth = require('../middlewares/auth')

module.exports.register = (request, response) => {

	User.findOne({ email: request.body.email })
	.then(result => {
		if (result) {
			response.status(409).send({ message: "Email already exists" })
		} else {
			let newUser = new User({
				email: request.body.email,
				firstName: request.body.firstName,
				lastName: request.body.lastName,
				password: bcrypt.hashSync(request.body.password, 10)
			})
		
			newUser.save()
			.then(user => response.status(201).send({ message: "User created successfully", result: user}))
			.catch(error => response.status(500).send({ message: "Internal server error", error: error}))
		}
	})
	.catch(error => response.status(500).send({ message: "Internal server error", error: error}))
}

module.exports.login = (request, response) => {
	User.findOne({ email: request.body.email })
	.then((user) => {

		if (user === null) { 
			response.status(404).send({ message: "Email not found" })
		} else {
			const isPasswordMatched = bcrypt.compareSync(request.body.password, user.password);

			if (isPasswordMatched) {
				response.status(200).send({ message: "Login successfully", accessToken: auth.createAccessToken(user.toObject())})
			} else {
				response.status(401).send({ message: "Email or password is incorrect" })
			}
		} 
	})
	.catch(error => response.status(500).send({ message: "Internal server error", error: error}))
}

module.exports.get = (request) => {
	User.findById(request.userId)
	.then(user => {
		user.password = null
		response.status(200).send({ message: "User detail fetched successfully", user:user})
	})
	.catch(error => response.status(500).send({ message: "Internal server error", error: error}))
}

module.exports.markAsFavorite = (request, response) => {
	Apartment.find({_id: request.body.apartmentId})
	.then(result => {
		if (result.length===0) {
			response.status(404).send({message: "Apartment does not exist"})
		} else {
			User.find({_id: request.body.userId, "favorites.apartmentId": request.body.apartmentId})
			.then(result => {
				if (result.length>0) {
					response.status(200).send({message: "Apartment already marked as a favorite"})
				} else {
					User.findByIdAndUpdate({ _id: request.body.userId },
						{  $push: { favorites: { apartmentId: request.body.apartmentId}}}, {new : true})
						.then(result => {
							response.status(200).send({ 
								message: "Apartment marked favorite successfully",
								result: result })})
						.catch(error => response.status(500).send({ message: "Internal server error", error: error}))
				}
			})
			.catch(error => response.status(500).send({ message: "Internal server error", error: error}))
		}
	})
	.catch(error => response.status(500).send({ message: "Internal server error", error: error}))
}

module.exports.getFavorites = (request, response) => {
	User.findOne({_id: request.params.userId })
    .then(result => {
		response.status(200).send({message: "User favorites fetched successfully", result: result.favorites })
	})
	.catch(error => response.status(500).send({ message: "Internal server error", error: error}))
}