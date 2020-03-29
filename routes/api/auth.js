const express = require('express');
const router = express.Router();
const User = require('../../models/User');

const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const auth = require('../../middleware/auth');

// @route GET api/users
// @desc Test route
// @access Public
router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');

		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route POST api/auth
// @desc Authenticate User and get token
// @access Public
router.post(
	'/',
	[
		check('email', 'Please include a valid email').isEmail(),
		check('password', 'Password is required').exists()
	],
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password } = req.body;

		try {
			// check if user exists
			let user = await User.findOne({ email });

			if (!user) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Invalid credentials'
						}
					]
				});
			}

			// Compare password

			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Invalid credentials'
						}
					]
				});
			}

			// Return the jsonwebtoken
			const payload = {
				user: {
					id: user.id
				}
			};

			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{ expiresIn: 360000 },
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

module.exports = router;
