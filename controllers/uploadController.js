const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const XLSX = require("xlsx");

exports.uploadFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No File Uploaded",
      });
    }
    const dataBuffer = fs.readFileSync(file.path);
    let extractedText = "";
    //pdf
    if (file.mimetype === "application/pdf") {
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
    }
    //docx
    else if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const result = await mammoth.extractRawText({buffer: dataBuffer,});
      extractedText = result.value;
    }
    //excel
    else if (file.mimetype === "application/vnd.ms-excel" || file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      const workbook = XLSX.readFile(file.path);
      workbook.SheetNames.forEach(
        (sheet) => {
          const sheetData =
            XLSX.utils.sheet_to_json(
              workbook.Sheets[sheet],
              { header: 1 }
            );
          extractedText +=
            JSON.stringify(sheetData);
        }
      );
    }
    console.log(extractedText);
    
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