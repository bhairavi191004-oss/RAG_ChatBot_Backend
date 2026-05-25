const File = require("../models/FileModel");

const {
  createEmbedding,
} = require("../services/embeddingService");

const {
  generateAnswer,
} = require("../services/llmService");

const askQuestion = async (req, res) => {

  try {

    const { question } = req.body;

    // Create question embedding
    const questionEmbedding =
      await createEmbedding(question);

    // Search similar chunks
    const results = await File.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: questionEmbedding,
          numCandidates: 20,
          limit: 3,
        },
      },

      {
        $project: {
          fileName: 1,
          text: 1,
          chunkIndex: 1,
          score: {
            $meta: "vectorSearchScore",
          },
        },
      },
    ]);

    // Generate answer
    const answer =
      await generateAnswer(
        question,
        results
      );

    // Remove duplicate file names
    const uniqueSources = [];

    const addedFiles = new Set();

    results.forEach((item) => {

      if (!addedFiles.has(item.fileName)) {

        addedFiles.add(item.fileName);

        uniqueSources.push({
          fileName: item.fileName,
        });

      }

    });

    res.status(200).json({
      success: true,
      answer,
      sources: uniqueSources,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error searching documents",
    });

  }

};

module.exports = {
  askQuestion,
};