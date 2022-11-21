const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

module.exports.createAccessToken = (user)=>{

    const payload = {
        _id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    };

    return jwt.sign(payload, secret);
    
};

module.exports.verifyToken = (req, res, next)=>{

    let token = req.headers.authorization;

    if (typeof token === 'undefined'){

        res.send({authentication: 'Failed'});

    } else {

        token = token.slice(7);

        jwt.verify(token, secret, (err, decoded)=>{

            if (err){

                res.status(200).send({

                    error: {

                        message: "Authentication Failed"
            
                    }
                })

            } else {

                req.user = decoded
                next();

            };    
        })
    }
};

module.exports.verifyAdmin = (req,res,next) => {

    if (req.user.isAdmin){

        next(); 

    } else {

        res.send("User is not an Admin");

    };
};

module.exports.verifyUser = (req,res,next) => {

    if (!req.user.isAdmin){

        next(); 
        
    } else {

        res.send("User is an Admin");
        
    };
};