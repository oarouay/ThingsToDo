import mongoose from "mongoose";
const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
  });
  
  // Define the schema for the to-do list
  const TodoListSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    list: [TaskSchema]  // An array of tasks
  });

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    todoLists: [TodoListSchema]
})

const UserModel = mongoose.model("User", UserSchema)

export {UserModel as User}