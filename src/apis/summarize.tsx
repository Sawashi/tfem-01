import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const summarizeTranscript = async (transcript: string) => {
	try {
		const response = await openai.completions.create({
			model: "gpt-4",
			prompt: `Summarize the following transcript in a few sentences:\n\n${transcript}`,
			max_tokens: 150,
		});
		return response.choices[0].text.trim();
	} catch (error) {
		throw new Error("Failed to generate summary");
	}
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "POST") {
		try {
			const { transcript } = req.body;
			const summary = await summarizeTranscript(transcript);
			res.status(200).json({ summary });
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	} else {
		res.setHeader("Allow", ["POST"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
