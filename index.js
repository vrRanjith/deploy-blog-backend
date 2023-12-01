const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/users') 
const postRoute = require('./routes/posts')
const categoryRouter = require('./routes/categories')
const multer = require('multer')
const path = require("path")
const cors = require('cors');

const app = express();

// Allow only specific origins
const allowedOrigins = ['https://ublog-ognr.onrender.com'];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));



dotenv.config();
app.use(express.json())

app.use("/images", express.static(path.join(__dirname, "/images")))

mongoose.connect(process.env.MONG_URL).then(console.log("connected to mongodb")).catch(err => {
    console.log(+err);
});

// app.get('/api', (req, res) => {
//     console.log("REST API")
//     res.send("REST API")
// });

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);
app.use('/api/categories', categoryRouter);


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    }
});

const upload = multer({storage:storage});
app.post("/api/upload", upload.single("file"), (req,res) => {
    res.status(200).json("File has been uploaded");
});

app.get("/api/test", (req, res) => {
    res.status(200).json("it's reaching the endpoint");
})


// app.listen("8000", () => {
//     console.log("app dsssdsdasasds");
// });

const PORT = process.env.PORT || 8000; // Use the provided port or default to 8000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
