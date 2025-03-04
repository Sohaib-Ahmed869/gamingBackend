// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "https://gaming-frontend-gilt.vercel.app",
    credentials: true,
  })
);

// Routes
app.use("/api/payments", require("./routes/paymentRoutes"));

app.post("/convert-link", (req, res) => {
  try {
    const { roomString } = req.body;

    // Validate input
    if (!roomString || typeof roomString !== "string") {
      return res.status(400).json({
        success: false,
        error: "Invalid room string provided",
      });
    }

    // Parse the room string
    const parts = roomString.split("//");
    if (parts.length !== 2) {
      return res.status(400).json({
        success: false,
        error: "Invalid room string format",
      });
    }

    const [gameName, roomPart] = parts;

    // Extract room ID
    const roomIDMatch = roomPart.match(/roomID=(\d+)/);
    if (!roomIDMatch) {
      return res.status(400).json({
        success: false,
        error: "Could not find valid room ID",
      });
    }

    const roomID = roomIDMatch[1];

    // Construct the clickable link
    // You can modify this URL structure based on your actual game URL format
    const clickableLink = `https://${gameName}.example.com/join/roomID=${roomID}`;

    return res.status(200).json({
      success: true,
      originalString: roomString,
      clickableLink,
      roomID,
    });
  } catch (error) {
    console.error("Error converting room link:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




// post url

// body {
//   sessionTicket: ________,
//   playFabID: _________,
//   username: __________,
//   email: ___________,




//  type: __________,
//  time: ___________,
//  price: ___________
// }


// response: {
//   success: true,
//   
//   message: "User data updated successfully",
//   data: {
//     username: "newUsername",
//   }