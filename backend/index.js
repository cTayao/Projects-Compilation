require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const multer = require('multer');
const cloudinary = require('./cloudinary');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const app = express();
const PORT = 3000;

const path = require('path');

// Serve frontend files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));


app.use(cors({
  origin: "http://localhost:3001"
})); 

app.use(express.json());


const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_HASHED_PASSWORD = process.env.ADMIN_HASHED_PASSWORD;


// 🔐 Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN_USERNAME) {
    return res.status(401).json({ error: "Invalid username" });
  }

  const validPassword = await bcrypt.compare(password, ADMIN_HASHED_PASSWORD);
  if (!validPassword) {
    return res.status(401).json({ error: "Invalid password" });
  }

  // Create JWT (valid for 1 hour)
  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json({ token });
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // example: 5MB limit
  fileFilter: (req, file, cb) => {
    // accept only common image types
    if (!file.mimetype.match(/^image\/(jpeg|png|gif)$/)) {
      return cb(new Error('Only jpg/png/gif allowed'), false);
    }
    cb(null, true);
  }
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date_created: { type: String, required: true },    
  date_completed: { type: String, required: true },    
  image: { type: String, required: true },   
  public_id: { type: String},    
  link: { type: String, required: true }        
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}



const Project = mongoose.model("projects", projectSchema);

app.get("/projects", async (request, response) => {
    try{
    const projects = await Project.find();
    response.json(projects);
    }
    catch(err){
        response.status(500).json({eror: err.message});

    }
});

// Upload image to Cloudinary (multipart/form-data: field "image")
app.post('/upload-image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(dataUri, { folder: 'projects' });
    return res.json({ url: result.secure_url, public_id: result.public_id });

  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.post("/projects", authenticateToken, async (req, res) => {
    try {
        const newProject = await Project.create(req.body);
        res.status(201).json(newProject);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// test route
// app.get("/", (req, res) => {
//   res.send("Hello, backend is working + MongoDB ready!");
// });

// start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
