const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

// GENERER LE TOKEN JWT
module.exports.tokenMaker = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

// VERIFIER LE TOKEN JWT
module.exports.tokenChecker = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("tokenChecker ~> Vous n'êtes pas authentifié !");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("tokenChecker ~> Utilisateur introuvable");
    }
    req.user = user;
    console.log("tokenChecker ~> requète autorisé");
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({
      message: "Veuillez vous connecter",
    });
  }
};
