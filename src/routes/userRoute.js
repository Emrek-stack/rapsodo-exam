var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');

/* Register routines */
router.get('/register', userController.registerView);
router.post('/register', userController.register);

/* Login routines */
router.get('/login', userController.loginView);
router.post('/login', userController.login);

/* Profile Routines */
router.get('/profile/:id', userController.profile);


/* Follow Routines */
router.get('/follow/:id', userController.followUser);

module.exports = router;
