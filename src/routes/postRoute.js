var express = require('express');
var router = express.Router();
var postController = require('../controllers/postController');

/* Register routines */
router.get('/', postController.list);
router.get('/detail/:id', postController.detail);

router.get('/create', postController.createView);
router.post('/create', postController.create);

module.exports = router;
