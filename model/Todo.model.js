import mongoose, { Schema } from "mongoose";

const TodoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Todo = mongoose.models.Todo || mongoose.model("Todo", TodoSchema);

export default Todo;
