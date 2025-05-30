import { Task, User } from "./schema.js";
import express from "express";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import auth from "./auth.js";


const route = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";
const TOKEN_EXPIRES = "24h";
const createToken = (userId) =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });

route.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "all fields are required" });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ success: false, message: "invalid email" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({
        success: false,
        message: "password must be atleast 8 charectors",
      });
  }
  try {
    if (await User.findOne({ email })) {
      return res
        .status(400)
        .json({ success: false, message: "user already exist" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user =await User.create({ name, email, password: hashed });
    const token = createToken(user._id);
    res
      .status(201)
      .json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email },
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "server error" });
  }
});
// login
route.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = createToken(user._id);
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "server error" });
  }
});
// get current user
route.get("/me", auth,async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "server error" });
  }
});
// update profile
route.put("/profile", auth,async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email || !validator.isEmail(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Valid name and email required" });
  }
  try {
    const exists = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (exists) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Email already in use by in another account",
        });
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true, select: "name email" }
    );
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "server error" });
  }
});

// change password
route.put("/password", auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return res
      .status(400)
      .json({ success: false, message: "Password invalid or too short" });
  }

  try {
    const user = await User.findById(req.user.id).select("password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res
        .status(400)
        .json({ success: false, message: "Current password incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ success: true, message: "Password changed" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
});


// create task
route.post('/gp',auth,async(req,res)=>{
  try {
    const {title,description,priority,dueDate,completed} = req.body;
    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      completed:completed === 'Yes' || completed === true,
      owner:req.user.id
    })
    const saved = await task.save()
    res.status(201).json({success:true,task:saved})
  } catch (error) {
    res.status(400).json({success:false,message:error.message})
  }
})
// get all data for logged user
route.get('/gp',auth,async(req,res)=>{
  try {
    const tasks = await Task.find({owner:req.user.id}).sort({createdAt: -1})
    res.json({success:true,tasks})
  } catch (error) {
    res.status(500).json({success:false,message:error.message})
  }
})
// get single task by id
route.get('/:id/gp',auth,async(req,res)=>{
  try {
    const task = await Task.findOne({_id:req.params.id,owner:req.user.id})
    if(!task) return res.status(401).json({
      success:false,
      message:"Task not found"
    })
    res.json({success:true,task})
  } catch (error) {
    res.status(500).json({success:false,message:error.message})
  }
})
// update task
route.put('/:id/gp',auth,async(req,res)=>{
  try {
    const data = {...req.body} ;
    if(data.completed !== undefined){
      data.completed = data.completed === 'Yes' || data.completed === true;
    }
    const updated = await Task.findOneAndUpdate(
      {_id:req.params.id,owner:req.user.id},
      data,
      {new:true,runValidators:true}
    )
    if(!updated)return res.status(404).json({
      success:false,message:"Task not found or not yours"
    })
    res.json({success:true,task:updated})
  } catch (error) {
    res.status(400).json({success:false,message:error.message})
  }
})

// delete task
route.delete('/:id/gp',auth,async(req,res)=>{
  try {
    const deleted = await Task.findOneAndDelete({_id:req.params.id,owner:req.user.id})
    if(!deleted) return res.status(404).json({success:false,message:"Task not found or not yours"})
      res.json({success:true,message:"Task deleted"})
  } catch (error) {
    res.status(500).json({message:error.message})
  }
})
export default route;
