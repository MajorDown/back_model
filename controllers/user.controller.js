const bcrypt = require("bcrypt");
const UserModel = require("../models/user.model");
const { tokenMaker } = require("../middlewares/tokenManager");

// CREER UN UTILISATEUR
module.exports.createUser = async (req, res) => {
  try {
    const { email, userId, password } = req.body;
    // VERIFIER SI L'UTILISATEUR EXISTE DEJA DANS LA DB
    const checkedUserMail = await UserModel.findOne({ email });
    if (checkedUserMail) {
      return res
        .status(400)
        .json({ message: "Cette adresse mail est déjà utilisée !" });
    }
    const checkedUserId = await UserModel.findOne({ userId });
    if (checkedUserId) {
      return res
        .status(400)
        .json({ message: "Cet identifiant est déjà utilisée !" });
    }
    // CREER UN UTILISATEUR
    const newUser = new UserModel({ email, userId, password });
    await newUser.save();
    console.log("createUser ~>", newUser.userId, "viens de créer son compte");
    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (err) {
    // GESTION DES ERREURS
    console.log(
      "createUser ~> un problême est survenue lors de la création du compte :",
      err
    );
    res.status(500).json({
      message: "Une erreur s'est produite lors de la création de votre compte",
      err: err,
    });
  }
};

// CONNECTER UN UTILISATEUR
module.exports.connectUser = async (req, res) => {
  try {
    const { userId, password } = req.body;
    // VERIFIER L'EXISTENCE DE L'UTILISATEUR DANS LA DB
    const user = await UserModel.findOne({ userId: userId });
    if (!user) {
      return res.status(401).json({ message: "identifiant / mdp incorrects" });
    }
    // VERIFIER SI LE MOT DE PASSE EST CORRECT
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "email / mdp incorrects" });
    }
    // GENERER LE TOKEN
    const token = tokenMaker(user._id);
    res.status(200).json({
      userId: user.userId,
      token: token,
    });
    console.log("connectUser ~>", user.userId, "viens de se connecter");
  } catch (err) {
    // GESTION DES ERREURS
    console.error(
      "connectUser ~> une erreur est survenue lors de la tentative de connection : ",
      err
    );
    res.status(500).json({
      message: "Une erreur s'est produite lors de votre tentative de connexion",
      err: err,
    });
  }
};

// MODIFIER UN PASSWORD
module.exports.editUserPassword = async (req, res) => {
  try {
    const { userId, password, newPassword } = req.body;
    const user = await UserModel.findOne({ userId: userId });
    // VERIFIER SI LE MOT DE PASSE EST CORRECT
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const updatedUser = await UserModel.updateOne(
        { _id: user._id },
        { password: newPassword }
      );
      console.log(
        "editUserPassword ~>",
        user.userId,
        "viens de modifier son password"
      );
      res.status(200).json({ message: "Mot de passe modifié avec succès" });
    } else {
      res.status(401).json({ message: "Mot de passe actuel incorrect" });
    }
    // GESTION DES ERREURS
  } catch (err) {
    console.error(
      "connectUser ~> une erreur est survenue lors de la tentative de modification du password : ",
      err
    );
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de votre tentative de modification du mot de passe",
      err: err,
    });
  }
};
