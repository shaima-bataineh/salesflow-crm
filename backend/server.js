const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/users"));
app.use("/api/customers", require("./routes/customers"));
app.use("/api/deals", require("./routes/deals"));
app.use("/api/dashboard", require("./routes/dashboard"));
// Error handler (لازم آخر شي)
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

app.listen(process.env.PORT || 5000, () =>
  console.log("Server running on port 5000")
);
