const UserController = require('../controllers/users');
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

router.post('/register', (req, res) => {
	UserController.register(req, res);
});

router.post('/login', (req, res) => {
	UserController.login(req, res);
});

router.get('/details', auth.verify, (req, res) => {
	const user = auth.decode(req.headers.authorization);
	UserController.get({ userId: user.id }, res);
});

router.put('/mark-favorite', auth.verify, (req, res) => {
	UserController.markAsFavorite(req, res); 
});

router.get('/favorites/:userId', auth.verify, (req, res) => {
	UserController.getFavorites(req, res);
});

module.exports = router;