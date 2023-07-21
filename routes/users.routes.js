const express = require("express");
const {
  createUser,
  connectUser,
  editUserPassword,
} = require("../controllers/user.controller");
const { emailChecker } = require("../middlewares/emailChecker");
const {
  passwordCrypter,
  newPasswordCrypter,
} = require("../middlewares/passwordCrypter");
const router = express.Router();

router.post("/signup", emailChecker, passwordCrypter, createUser);
router.post("/login", connectUser);
router.post("/editUserPassword", newPasswordCrypter, editUserPassword);

module.exports = router;
