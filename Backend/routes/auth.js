const express = require("express");
const { Login, Signup, Logout } = require("../controller/auth/auth");
const router = express.Router();

router.post("/login", Login);
router.post("/signup", Signup);
router.post("/logout", Logout);

module.exports = router;
