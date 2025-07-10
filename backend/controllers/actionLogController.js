import ActionLog from "../models/actionLogModel.js";

export const getRecentActions = async (req, res) => {
  try {
    const actions = await ActionLog.find()
      .sort({ timestamp: -1 })
      .limit(20)
      .populate("performedBy", "name email") // populate user info
      .populate("taskId", "title status") // populate task info
      .lean(); // return plain JS objects

    return res.status(200).json(actions);
  } catch (err) {
    console.error("Error fetching actions:", err);
    res.status(500).json({ message: "Server error fetching actions." });
  }
};
