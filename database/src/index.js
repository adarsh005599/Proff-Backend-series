import dotenv from "dotenv";
import connectDB from "./db/indexdb.js";
import { app } from "./App.js";

// Load environment variables from '/env'
dotenv.config({
  path: "./.env",
});


// Start the server after successful DB connection
connectDB()
  .then(() => {
    const PORT = parseInt(process.env.PORT, 10) || 5000;

    app.listen(PORT, () => {
      console.log(`Server running at port: ${PORT}`);
    });

    app.on("error", (error) => {
      console.error("Server error:", error);
      throw error;
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed!!", err);
  });
