import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateContractWithAI = async (type, details) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a legal contract expert."
        },
        {
          role: "user",
          content: `Generate a ${type} contract with: ${JSON.stringify(details)}`
        }
      ],
    });
    return completion.choices[0].message.content;
  } catch (error) {
    throw error;
  }
};