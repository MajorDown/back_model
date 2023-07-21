const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = path.extname(file.originalname);
    const filename = name + Date.now() + extension;

    console.log("imageUploader ~> Nouveau fichier uploadé :", filename);
    callback(null, filename);
  },
});

const fileFilter = (req, file, callback) => {
  const allowedExtensions = [".jpg", ".jpeg", ".png"];
  const extname = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(extname)) {
    callback(null, true);
  } else {
    callback(new Error("Extension de fichier invalide."));
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).any();

const imageUploader = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log("imageUploader ~> Erreur lors de l'upload du fichier :", err);
      return res.status(400).json({
        message: "Une erreur est survenue lors de l'upload du fichier.",
      });
    } else if (err) {
      console.log("imageUploader ~> Erreur lors de l'upload du fichier :", err);
      return res.status(400).json({
        message: "Une erreur est survenue lors de l'upload du fichier.",
      });
    }
    console.log("imageUploader ~> upload terminé");
    next();
  });
};

module.exports = imageUploader;
