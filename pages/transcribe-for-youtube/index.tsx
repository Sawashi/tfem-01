import React, { useState } from "react";
import { Input, Button, Card, Spin, message, QRCode } from "antd";
import saveAs from "file-saver";

const { TextArea } = Input;

const YouTubeTranscriber: React.FC = () => {
	const [youtubeUrl, setYoutubeUrl] = useState("");
	const [transcript, setTranscript] = useState("");
	const [summary, setSummary] = useState("");
	const [loading, setLoading] = useState(false);
	const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

	const handleTranscribe = async () => {
		setLoading(true);
		try {
			// Extract video ID from YouTube URL
			const videoId = youtubeUrl.split("v=")[1].split("&")[0];

			// Fetch the transcript from your serverless API
			const transcriptResponse = await fetch(
				`/api/youtube-transcript?videoId=${videoId}`
			);
			const transcriptData = await transcriptResponse.json();

			if (transcriptResponse.ok) {
				const transcriptText = transcriptData.transcript;
				setTranscript(transcriptText);

				// Use the summarize API route to get the summary
				const summaryResponse = await fetch("/api/summarize", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ transcript: transcriptText }),
				});

				const summaryData = await summaryResponse.json();
				if (summaryResponse.ok) {
					setSummary(summaryData.summary);
				} else {
					message.error("Failed to generate summary.");
					setSummary("");
				}
			} else {
				message.error("Failed to fetch transcript.");
				setTranscript("Could not fetch the transcript.");
			}
		} catch (error) {
			message.error(
				"Failed to fetch transcript or generate summary. Please try again."
			);
			setTranscript("Could not fetch the transcript.");
			setSummary("");
		}
		setLoading(false);
	};
	const handleGenerateQRCode = () => {
		if (youtubeUrl) {
			setQrCodeUrl(youtubeUrl);
		}
	};

	const handleDownloadQRCode = async () => {
		if (qrCodeUrl) {
			const canvas = document.getElementById("qr-code") as HTMLCanvasElement;
			if (canvas) {
				const blob = await new Promise<Blob>((resolve) =>
					canvas.toBlob((blob) => resolve(blob!), "image/png")
				);
				saveAs(blob, "qrcode.png");
			}
		}
	};

	return (
		<div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
			<Card title="YouTube Video Transcriber" bordered={false}>
				<h5>URL example: https://www.youtube.com/watch?v=abcd</h5>
				<Input
					placeholder="Enter YouTube URL"
					value={youtubeUrl}
					onChange={(e) => setYoutubeUrl(e.target.value)}
					style={{ marginBottom: "20px" }}
				/>

				<Button
					type="primary"
					onClick={handleTranscribe}
					disabled={!youtubeUrl}
				>
					Transcribe & Summarize
				</Button>
				<Button
					type="default"
					onClick={handleGenerateQRCode}
					disabled={!youtubeUrl}
					style={{ marginLeft: "10px" }}
				>
					Generate QR Code
				</Button>
				{loading && <Spin style={{ marginLeft: "20px" }} />}
			</Card>
			{qrCodeUrl && (
				<Card title="QR Code" bordered={false} style={{ marginTop: "20px" }}>
					<QRCode
						value={qrCodeUrl}
						size={256}
						style={{ marginBottom: "10px" }}
					/>
					<Button type="primary" onClick={handleDownloadQRCode}>
						Download QR Code
					</Button>
				</Card>
			)}
			<Card title="Transcribe" bordered={false} style={{ marginTop: "20px" }}>
				<TextArea value={transcript} rows={10} readOnly />
			</Card>

			<Card title="Summary" bordered={false} style={{ marginTop: "20px" }}>
				<TextArea value={summary} rows={5} readOnly />
			</Card>
		</div>
	);
};

export default YouTubeTranscriber;
