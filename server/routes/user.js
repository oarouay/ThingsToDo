import express from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    return res.status(201).json({message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: false, message: "User doesn't exist" });
    }

    // Compare the password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ status: false, message: "Password is incorrect" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.KEY, { expiresIn: '1h' });
    // Set the token as a cookie
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

    // Send success response
    return res.status(201).json({ status: true, message: "Login successful" });

  } catch (error) {
    return res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
});
router.post('/forgot-password', async (req, res) => {
  const {email}=req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: false, message: "User doesn't exist" });
    }
    const token = jwt.sign({id: user ._id}, process.env.KEY, {expiresIn: '5m'})
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'oussamadarouay@gmail.com',
        pass: 'evie syyr afpa ytnu'
      }
    });
    
    var mailOptions = {
      from: 'oussamadarouay@gmail.com',
      to: email,
      subject: 'Reset Password',
      text: `http://localhost:5173/resetPassword/${token}`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        return res.json({message:'error sending'});
      } else {
        return res.json({status:true,message:'email sent !'});
      }
    });
  } catch (error) {
    console.log(err)
  }
});

router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.KEY);
    const id = decoded.id;
    const hashPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(id, { password: hashPassword });

    return res.status(200).json({ status: true, message: "Password updated successfully" });
  } catch (error) {
    return res.status(400).json({ status: false, message: "Invalid or expired token" });
  }
});

const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ status: false, message: "No token provided" });
    }
    
    const decoded = jwt.verify(token, process.env.KEY);
    req.user = decoded; // Attach the decoded token to the request object
    next();
  } catch (err) {
    return res.json({ status: false, message: "Invalid token", error: err.message });
  }
};


// Route that requires user verification
router.get('/verify', verifyUser, (req, res) => {
  return res.json({ status: true, message: "Authorized",user: req.user });
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({status: true});
});

router.post('/todolists', verifyUser, async (req, res) => {
  const { name, description } = req.body;
  try {

    const user = await User.findOne({ username: req.user.username });

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const newList = {
      name,
      description,
      list: []
    };

    user.todoLists.push(newList);

    await user.save();

    return res.status(201).json({ status: true, message: "To-do list added successfully", todoList: newList });
  } catch (error) {
    console.error("Error adding to-do list:", error);
    return res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
});

router.get('/todos', verifyUser, async (req, res) => {
  try {
    // Find the user using req.user from the verifyUser middleware
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Send the user's to-do lists as the response
    return res.status(200).json({ status: true, todoLists: user.todoLists });
  } catch (error) {
    console.error("Error fetching to-do lists:", error);
    return res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
});


router.post('/todo/:listId/task', async (req, res) => {
  const { listId } = req.params;
  const { title } = req.body;
  const token = req.cookies.token;

  try {
    const decoded = jwt.verify(token, process.env.KEY);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const todoList = user.todoLists.id(listId);

    if (!todoList) {
      return res.status(404).json({ status: false, message: "To-do list not found" });
    }

    const newTask = { title, completed: false };
    todoList.list.push(newTask);

    await user.save();

    return res.status(201).json({ status: true, message: "Task added successfully", task: newTask });
  } catch (error) {
    console.error("Error adding task:", error);
    return res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
});

router.put('/todo/:listId/task/:taskId', verifyUser, async (req, res) => {
  const { listId, taskId } = req.params;
  const { completed } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const todoList = user.todoLists.id(listId);
    if (!todoList) {
      return res.status(404).json({ status: false, message: "To-do list not found" });
    }

    const task = todoList.list.id(taskId);
    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found" });
    }

    task.completed = completed;
    await user.save();

    return res.status(200).json({ status: true, message: "Task updated successfully", task });
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
});

router.post('/generate-todo', verifyUser, async (req, res) => {
  const { topic, numberOfTasks } = req.body;
  
  // Input validation
  if (!topic || typeof numberOfTasks !== 'number' || numberOfTasks < 1 || numberOfTasks > 10) {
    return res.status(400).json({ status: false, message: "Invalid input" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Generate a todo list with ${numberOfTasks} tasks about ${topic}. Format the response as a JSON array of objects, each with 'title' and 'description' fields.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;

    let generatedTasks;
    try {
      const jsonResponse = response.text().match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonResponse) {
        generatedTasks = JSON.parse(jsonResponse[1]);
      } else {
        generatedTasks = JSON.parse(response.text());
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      return res.status(500).json({ status: false, message: "Error processing AI response" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const newList = {
      name: `${topic}`,
      description: `todo list about ${topic}`,
      list: generatedTasks.map(task => ({
        title: task.title,
        completed: false
      }))
    };

    user.todoLists.push(newList);
    await user.save();

    return res.status(201).json({ status: true, message: "AI-generated to-do list added successfully", todoList: newList });
  } catch (error) {
    console.error("Error generating AI todo list:", error);
    if (error.response) {
      return res.status(error.response.status).json({ status: false, message: "AI service error", error: error.response.data });
    } else if (error.request) {
      return res.status(503).json({ status: false, message: "No response from AI service" });
    } else {
      return res.status(500).json({ status: false, message: "Error setting up AI request" });
    }
  }
});


export { router as UserRouter };
