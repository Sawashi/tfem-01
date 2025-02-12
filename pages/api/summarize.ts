import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// Allow CORS for specific origins
	res.setHeader("Access-Control-Allow-Origin", "*"); // Adjust this to a specific domain if needed
	res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");

	if (req.method === "OPTIONS") {
		// Pre-flight request handling
		res.status(200).end();
		return;
	}

	if (req.method === "POST") {
		const { transcript } = req.body;
		if (!transcript) {
			res.status(400).json({ error: "Transcript is required" });
			return;
		}
		const prefix =
			"Read the following text and summarize it with each point separated by a newline '\\n'. Ensure each bullet point is clear and concise:\n";
		const postfix =
			"\nYour answer should have a newline '\\n' after each point.";
		const prompt = prefix + transcript + postfix;
		try {
			// Updated request to use chat completions
			const response = await openai.chat.completions.create({
				model: "gpt-4-turbo", // Use the turbo model for better performance and cost
				messages: [{ role: "user", content: prompt }],
				max_tokens: 150,
				temperature: 0.7,
			});

			const summary = response.choices[0]?.message?.content?.trim() || "";
			res.status(200).json({ summary });
		} catch (error) {
			res.status(500).json({ error: "Failed to generate summary" });
		}
	} else {
		res.setHeader("Allow", ["POST"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
