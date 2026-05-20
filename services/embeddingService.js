const { HfInference } = require("@huggingface/inference");

const hf = new HfInference(
  process.env.HUGGINGFACE_API_KEY
);

const createEmbedding = async (text) => {
  const embedding =
    await hf.featureExtraction({
      model:
        "sentence-transformers/all-MiniLM-L6-v2",
      inputs: text,
    });
  return Array.from(embedding);
};

module.exports = {createEmbedding,};