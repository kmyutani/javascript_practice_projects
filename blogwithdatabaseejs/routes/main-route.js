

/* IMPORTS */

const express = require('express');
const _ = require("lodash");
const Post = require('../models/Blog');

/* CONSTANTS */

const router = express.Router();

const homeStartingContent = "To create a new post access the /compose route where you can add your title, and composition for your new post to be posted, another feature of this, you can directly access your posted post that is save in your database via accessing its /post/<postID> route.";

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";

const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";



/* VARIABLES */


/* MAIN */

router.get('/', (req,res)=>{
    // Direct to the HOME PAGE 
    Post.find({}, (e,posts)=>{
        res.render('home', {
        
            homeStartingContent: homeStartingContent,
            posts: posts 
    
        });
    });
    
});

router.get('/about', (req,res)=>{
    // Direct to the ABOUT PAGE
    res.render('about', {

        aboutContent: aboutContent

    });
});

router.get('/contact', (req,res)=>{
    // Direct to the CONTACT PAGE
    res.render('contact', {

        contactContent: contactContent

    });
});

router.get('/compose', (req,res)=>{
    // Direct to the COMPOSE PAGE
    res.render('compose');
});

router.post('/compose', (req,res)=>{
    // Post from the COMPOSE PAGE
    const post = new Post ({
        title: req.body.postTitle,
        content: req.body.postBody
    });

    post.save((e)=>{
        if (!e){
            res.redirect("/");
        } else {
            console.error(e.message);
        };
    });

});

router.get("/posts/:postId", (req,res)=>{
    
    const requestedPostId = req.params.postId;

    Post.findOne({_id: requestedPostId}, (e, post)=>{
        res.render('post', {
            title: post.title,
            content: post.content
        });
    });
    
});

module.exports = router;