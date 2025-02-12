import type { NextApiRequest, NextApiResponse } from "next";
import { YoutubeTranscript } from "youtube-transcript";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { videoId } = req.query;

	// Allow CORS for specific origins
	res.setHeader("Access-Control-Allow-Origin", "*"); // Adjust this to a specific domain if needed
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");

	if (req.method === "OPTIONS") {
		// Pre-flight request handling
		res.status(200).end();
		return;
	}

	if (req.method === "GET" && videoId) {
		try {
			// Fetch the transcript using youtube-transcript package
			const transcriptArray = await YoutubeTranscript.fetchTranscript(
				videoId as string
			);
			const transcriptText = transcriptArray
				.map((item: any) => item.text)
				.join(" ");
			res.status(200).json({ transcript: transcriptText });
		} catch (error) {
			res.status(500).json({ error: "Failed to fetch YouTube transcript" });
		}
	} else {
		res.status(400).json({ error: "Bad Request" });
	}
}
