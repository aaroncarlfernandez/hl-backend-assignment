const jwt = require('jsonwebtoken');

module.exports.createAccessToken = (user) => {
	const data = {
		id: user._id,
		email: user.email
	}
	return jwt.sign(data, process.env.APP_SECRET, {});
}

module.exports.verify = (req, res, next) => {
	let token = req.headers.authorization;
	if (typeof token !== 'undefined') {
		token = token.slice(7, token.length);
		return jwt.verify(token, process.env.APP_SECRET, (err, data) => {
			return err ? res.status(401).send({ message: "Authentication failed" }) : next();
		});
	} else {
		return res.status(401).send({ message: "Missing token" })
	}
}

module.exports.decode = (token) => {
	if (typeof token!= 'undefined') {
		token = token.slice(7, token.length)
		return jwt.verify(token, process.env.APP_SECRET, (err, data) => {
			return err ? null : jwt.decode(token, { complete: true}).payload
		})
	} else {
		return null
	}
}