import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["Todo", "In Progress", "Done"],
    default: "Todo",
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lastModified: { type: Date },
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const taskModel = mongoose.model.task || mongoose.model("Task", taskSchema);
export default taskModel;
