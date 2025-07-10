import mongoose from "mongoose";

const actionLogSchema = new mongoose.Schema({
  actionType: { type: String },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  details: mongoose.Schema.Types.Mixed, // allow any object
  timestamp: { type: Date, default: Date.now },
});

const actionLogModel =
  mongoose.model.actionlog || mongoose.model("Actionlog", actionLogSchema);
export default actionLogModel;
