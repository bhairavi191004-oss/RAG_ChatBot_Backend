const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const XLSX = require("xlsx");
const File = require("../models/FileModel");
const { createChunks } = require("../services/chunkServices");
const { createEmbedding } = require("../services/embeddingService");

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
    // PDF
    if (file.mimetype === "application/pdf") {
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
    }
    // DOCX
    else if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const result = await mammoth.extractRawText({
        buffer: dataBuffer,
      });
      extractedText = result.value;
    }
    // XLS / XLSX
    else if (file.mimetype === "application/vnd.ms-excel" || file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      const workbook = XLSX.readFile(file.path);
      workbook.SheetNames.forEach(
        (sheet) => {
          const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { header: 1 });
          extractedText += JSON.stringify(sheetData);
        }
      );
    }
    // Create Chunks
    const chunks = await createChunks(extractedText);
    const embeddedChunks = [];
    for (const chunk of chunks) {
      const embedding = await createEmbedding(chunk.text);
      embeddedChunks.push({
        text: chunk.text,
        chunkIndex: chunk.chunkIndex,
        embedding,
      });
    }
    console.log(embeddedChunks, "embeddedChunks");

    const documents = embeddedChunks.map((chunk) => ({
      fileName: file.originalname,
      text: chunk.text,
      chunkIndex: chunk.chunkIndex,
      embedding: chunk.embedding,
    }));

    console.log("About to insert:", documents.length);
    await File.insertMany(documents);
    console.log("Inserted successfully");

    res.status(200).json({
      success: true,
      message: "File uploaded and embeddings created",
      totalChunks: embeddedChunks.length,
    });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};