const router = require('express').Router();
const { register, login, viewAllActive, userDetails} = require('./../controllers/userControllers');
const { verifyToken, verifyAdmin } = require('./../utils/auth');



router.post('/register', register);

router.post('/login', login);

router.get('/allActive', verifyToken, verifyAdmin, viewAllActive)

router.get('/details', verifyToken, userDetails);

module.exports = router;