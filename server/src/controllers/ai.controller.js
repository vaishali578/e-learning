import ai from "../config/gemini.js";

export const testAI = async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: "Explain Node.js in one simple sentence.",
    });

    res.status(200).json({
      success: true,
      message: response.text,
    });
  } catch (error) {
    console.error("Gemini API Error:", error);

    res.status(500).json({
      success: false,
      message: "AI request failed",
      error: error.message,
    });
  }
};