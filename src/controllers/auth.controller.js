const { PrismaClient } = require("@prisma/client");
const { templateResponse } = require("../helpers/template-response");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sentry = require("../lib/sentry");
const prisma = new PrismaClient();

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await prisma.users.findUnique({ where: { email } });

  if (existingUser) {
    let resp = templateResponse("error", "User already exists", null);
    return res.status(400).json(resp);
  }

  try {
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    let resp = templateResponse("success", "User created successfully", user);
    return res.status(201).json(resp);
  } catch (error) {
    sentry.captureException(error);
    let resp = templateResponse("error", "User creation failed", error);
    return res.status(400).json(resp);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      let resp = templateResponse(
        "Bad Request",
        "Invalid email or password",
        null
      );
      return res.status(400).json(resp);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      let resp = templateResponse(
        "Bad Request",
        "Invalid email or password",
        null
      );
      return res.status(400).json(resp);
    }

    const token = jwt.sign(user, process.env.JWT_SECRET);

    let resp = templateResponse("success", "Login successful", {
      user: { name: user.name, email: user.email },
      token,
    });
    return res.status(200).json(resp);
  } catch (error) {
    sentry.captureException(error);
    let resp = templateResponse(
      "Bad Request",
      "Invalid email or password",
      error
    );
    return res.status(400).json(resp);
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      let resp = templateResponse(
        "Bad Request",
        "Invalid email or password",
        null
      );
      return res.status(400).json(resp);
    } else {
      let resp = templateResponse(
        "success",
        "Password reset link sent to your email",
        null
      );
      return res.status(200).json(resp);
    }
  } catch (error) {
    sentry.captureException(error);
    let resp = templateResponse(
      "Bad Request",
      "Invalid email or password",
      error
    );
    return res.status(400).json(resp);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
};
