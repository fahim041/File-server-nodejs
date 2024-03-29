const upload = require("../middleware/fileUpload");

const URL = "http://localhost:8888/files/";
const fs = require("fs");
const path = require('path');


const uploadFile = async (req, res) => {
  try {
    await upload(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Choose a file to upload" });
    }

    res.status(200).send({
      message: "File uploaded successfully: " + req.file.originalname,
    });
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size should be less than 5MB",
      });
    }

    res.status(500).send({
      message: `Error occured: ${err}`,
    });
  }
};

const getFilesList = (req, res) => {
  const filePath = path.join(__dirname, '../public/uploads/');
  console.log(filePath);

  fs.readdir(filePath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Files not found.",
      });
    }

    let filesList = [];

    files.forEach((file) => {
      filesList.push({
        name: file,
        url: URL + file,
      });
    });


    res.status(200).send(filesList);
  });
};

const downloadFiles = (req, res) => {
    const fileName = req.params.name;
    const filePath = path.join(__dirname, '../public/uploads/');

    //download the file
    res.download(filePath + fileName, (err) => {
      if (err) {
        res.status(500).send({
          message: "File can not be downloaded: " + err,
        });
      }
    });

    //stream the file
    /*const file = fs.createReadStream(filePath+fileName);
    //console.log(file);
    file.pipe(res); */
};

module.exports = { uploadFile, downloadFiles, getFilesList };