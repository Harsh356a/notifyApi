require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const admin = require("firebase-admin");

// Setup Firebase Admin SDK with environment variables
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

const app = express();
app.use(cors());
app.use(bodyparser.json());

app.post("/send-notification", async (req, res) => {
  const { title, body, number } = req.body;

  if (!title || !body || !number) {
    return res.status(400).send("Title, body, and number are required");
  }

  const message = {
    notification: { title, body },
    topic: "all",
    data: { number: number.toString() },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);
    res.status(200).send("Notification sent successfully");
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send("Error sending notification");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
