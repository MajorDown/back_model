const bcrypt = require("bcrypt");

module.exports.passwordCrypter = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    console.log("passwordCrypter ~> le password viens d'être crypté");
    next();
  } catch (error) {
    console.error("passwordCrypter ~> une erreur est survenue : ", err);
    res.status(500).json({
      message: "Une erreur s'est produite lors du hachage du mot de passe",
      error: error,
    });
  }
};

module.exports.newPasswordCrypter = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(req.body.newPassword, salt);
    req.body.newPassword = hashedNewPassword;
    console.log("passwordCrypter ~> le nouveau password viens d'être crypté");
    next();
  } catch (error) {
    console.error("newPasswordCrypter ~> une erreur est survenue : ", err);
    res.status(500).json({
      message:
        "Une erreur s'est produite lors du hachage du nouveau mot de passe",
      error: error,
    });
  }
};
