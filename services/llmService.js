const { Ollama } = require("ollama");

const ollama = new Ollama({
  host: "http://127.0.0.1:11434",
});

const generateAnswer = async (
  question,
  chunks
) => {

  const context = chunks
    .map((item) => item.text)
    .join("\n\n");

  const response =
    await ollama.chat({
      model: "llama3.2",

      messages: [
        {
          role: "system",

          content: `
You are a RAG assistant.

STRICT RULES:
1. Answer ONLY from context.
2. Give SHORT direct answers.
3. Never say:
   - Sure
   - Here's
   - Based on context
   - Sources
   - Document says
4. Never explain the rules.
5. If answer not present, say exactly:
Answer not found in document.
`,
        },

        {
          role: "user",

          content: `
Context:
${context}

Question:
${question}
`,
        },
      ],

      options: {
        temperature: 0,
      },
    });

  return response.message.content.trim();
};

module.exports = {
  generateAnswer,
};