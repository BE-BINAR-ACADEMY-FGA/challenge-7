const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const app = express();
const router = require("./routes/route");

dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan("combined"));

app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Challenge 7");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
