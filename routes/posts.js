const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require('bcrypt');


// Create post
router.post("/", async(req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }
    catch (err) {
        res.status(500).json(err)
    }
});






// Update post
router.put("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.username === req.body.username) {
            try {const updatePost = await Post.findByIdAndUpdate(req.params.id, {
                $set:req.body
            }, {new:true});
        res.status(200).json(updatePost);
            } 
            catch (err) {
                res.status(500).json(err);
            }
            
        }
        else {
            res.status(401).json("you can update only your post")
        }
    }
    catch (err) {
        res.status(500).json(err)
    }
});


// Delete post
router.delete("/:id", async(req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.username === req.body.username) {
            try {
                await post.deleteOne();
                res.status(200).json("post deleted successfully...");
            } 
            catch (err) {
                res.status(500).json(err);
            }
            
        }
        else {
            res.status(401).json("you can delete only your post")
        }
    }
    catch (err) {
        res.status(500).json(err)
    }
});

// Get post

router.get("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }
    catch (err) {
        res.status(500).json(err);
    }
})


// get all posts 
router.get('/', async(req, res) => {
    const username = req.query.user;
    const postCat = req.query.cat;
    try {
        let posts;
        if (username) {
            posts = await Post.find({username:username});
        } else if (postCat) {
            posts = await Post.find({categories: {
                $in: [postCat]
            }});
        } else {
            posts = await Post.find();
        }

        if (!posts) {
            posts = []; 
            res.status(200).json(`the post is empty meaning db issue ${posts}`);
        }

        res.status(200).json(posts);
    }
    catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;