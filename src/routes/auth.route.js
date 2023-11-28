const express = require("express");
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
} = require("../controllers/auth.controller");
const { CheckRegister } = require("../middleware/middleware");

router.post("/register", CheckRegister, register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);

module.exports = router;
