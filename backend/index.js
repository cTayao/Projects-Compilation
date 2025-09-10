const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors({
  origin: "http://localhost:3001"
})); 

app.use(express.json());


mongoose.connect("mongodb://localhost:27017/myprojectsdb", {
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
  link: { type: String, required: true }        
});

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

app.post("/projects", async (req, res) => {
    try {
        const newProject = await Project.create(req.body);
        res.status(201).json(newProject);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// test route
app.get("/", (req, res) => {
  res.send("Hello, backend is working + MongoDB ready!");
});

// start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
