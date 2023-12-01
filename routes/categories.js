const router = require("express").Router()
const Category = require("../models/Category")

// create category
router.post("/", async (req, res) => {
    const newCat = new Category(req.body);
    console.log(`is this even coming inside ${newCat}`);
    try {
        const updatedCat = await newCat.save();
        res.status(200).json(updatedCat);
    }
    catch (err) {
        res.status(500).json(err)
    }
})

// get all categories

router.get("/", async (req, res) => {
    try {
        const cats = await Category.find();
        res.status(200).json(cats);
    }
    catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router