const User = require('./../models/User');
const bcrypt = require('bcrypt');
const {createAccessToken} = require('./../utils/auth');
const { findById } = require('./../models/User');


// @path        api/users/register
// @method      POST
// @desc        Create a User
// @privacy     public
// @body
    // firstName        lastName
    // email            password
    // confirmPassword  mobileNo
// @return boolean
module.exports.register = async (req, res, next) =>{

    try {
        
        const hash = bcrypt.hashSync(req.body.password, 10);

        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash,
            mobileNo: req.body.mobileNo
        });

        if (req.body.password.length < 8) throw new Error ("Password is too short")
        if (req.body.password !== req.body.confirmPassword) throw new Error("Confirm your password")

        await newUser.save();
        res.status(201).send("Welcome to KMY BUDGETS");
        
    } catch (err) {
        
        next(err)

    };
};

// @path        api/users/login
// @method      POST
// @desc        login a User
// @privacy     Normal/Admin users
// @body
    // email            password
// @return token
module.exports.login = async (req, res, next) =>{

    try {
        
        const user = await User.findOne({email: req.body.email});
        if (!user) throw new Error(`No user found with email: ${req.body.email}`);

        const matchedPW = bcrypt.compareSync(req.body.password, user.password);
        if (!matchedPW) throw new Error("Incorrect password. Try again.");

        res.status(200).send({access: createAccessToken(user)});

    } catch (err) {
        
        next(err)

    };
};

// @path        api/users/allActive
// @method      GET
// @desc        Get all active users
// @privacy     Admin Users
// @return      user details
module.exports.viewAllActive = async (req, res, next) => {

    try {
        
        const searchActiveUsers = await User.find(
            {isActive: true}, {__v: 0, isAdmin: 0, password: 0}
        );

        res.send(searchActiveUsers)

    } catch (err) {
        
        next(err);

    };
} ;

// @path        api/users/details
// @method      GET
// @desc        Get Authenticated User's details
// @privacy     Normal/Admin Users
// @return      user details 
module.exports.userDetails = async (req, res, next) =>{

    const myDetails = await User.findById(req.user._id)
    res.send(myDetails)
};