const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');


// register point
router.post("/register", async(req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        hashedPW = await bcrypt.hash(req.body.password ,salt);
        const newUser = new User({
            username:req.body.username,
            password:hashedPW,
            email:req.body.email
        });
        const user = await newUser.save();
        return res.status(200).json(user);
    }
    catch (err) {
        return res.status(500).json(err);
    }
});

// login point
router.post('/login', async(req, res) => {

    try {
        
        const user = await User.findOne({username: req.body.username});
        if (!user) {
            return res.status(400).json("Wrong Credentials");
        }
        
        const validated = await bcrypt.compare(req.body.password, user.password);
        
        if (!validated) {
            return res.status(400).json("Wrong Credentials");
        }
        
        
        const {password, ...others} = user._doc;
        return res.status(200).json(others);

    }
    catch(err) {
        return res.status(500).json("something wrong " + err)
    }
})


module.exports = router;