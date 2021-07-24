const ApartmentController = require('../controllers/apartments');
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

router.post('/create', auth.verify, (req, res) => {
	ApartmentController.create(req, res);
});

router.get('/search', (req, res) => {
	ApartmentController.search(req, res);
});

module.exports = router;