const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ---- CONNECT TO MONGODB ATLAS ----
mongoose.connect(
  "mongodb+srv://Ananya:Ananya@cluster0.w0l8olq.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// USER SCHEMA
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  courses: [String]
});

const User = mongoose.model("User", UserSchema);

// REGISTER
app.post("/register", async (req, res) => {
  const { name, email, phone, password } = req.body;

  let user = await User.findOne({ email });
  if (user) return res.json({ status:false, message:"User exists" });

  user = new User({ name, email, phone, password, courses:[] });
  await user.save();
  res.json({ status:true, message:"Registered" });
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });
  if (!user) return res.json({ status:false });

  res.json({ status:true, user });
});

// REGISTER COURSE
app.post("/register-course", async (req, res) => {
  const { email, courseCode } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ status:false });

  if (!user.courses.includes(courseCode)) {
    user.courses.push(courseCode);
  }

  await user.save();
  res.json({ status:true, courses:user.courses });
});

// GET USER DATA
app.post("/get-user", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ status:false });

  res.json({ status:true, user });
});

app.listen(5000, () => console.log("Server running on port 5000"));
