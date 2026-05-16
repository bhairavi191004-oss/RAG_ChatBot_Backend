const fs = require("fs");
const pdfParse = require("pdf-parse");

exports.uploadPDF = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No File Uploaded",
      });
    }
    const dataBuffer = fs.readFileSync(file.path);
    const pdfData = await pdfParse(dataBuffer);
    const extractedText = pdfData.text;
    res.status(200).json({
      success: true,
      text: extractedText,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};