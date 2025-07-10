import mongoose from "mongoose";
const connectionDB = async () => {
  try {
    // connection_URL = "mongodb://localhost:27017";
    const data = await mongoose.connect(process.env.CONNECTION_URL);
    if (data) {
      console.log("Database connected successfully!");
    }
  } catch (error) {
    console.log("ERROR! to connect with database", error);
  }
};
export default connectionDB;
