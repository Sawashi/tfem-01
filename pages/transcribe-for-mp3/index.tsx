import React, { useEffect, useState } from "react";
import { Button, Spin, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { runGemini } from "src/utils/common";
// import Paragraph from "antd/es/skeleton/Paragraph";

const AudioTranscribePage: React.FC = () => {
	const [transcript, setTranscript] = useState<string | null>(null);
	const [summary, setSummary] = useState<string | null>(null);
	const [loadingTranscribe, setLoadingTranscribe] = useState<boolean>(false);
	const [loadingSummary, setLoadingSummary] = useState<boolean>(false);

	const handleSummary = async (text: string) => {
		// Display a loading message
		message.loading("Generating summary, please wait...");
		setLoadingSummary(true);

		try {
			const prefix =
				"Read the following text and summarize it with each point separated by a newline '\\n'. Ensure each bullet point is clear and concise:\n";
			const postfix =
				"\nYour answer should have a newline '\\n' after each point.";
			const prompt = prefix + text + postfix;

			// OpenAI API request parameters
			const response = await fetch(
				"https://api.openai.com/v1/chat/completions",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`, // Replace with your actual API key
					},
					body: JSON.stringify({
						model: "gpt-4-turbo", // This is the model you want to use
						messages: [{ role: "user", content: prompt }],
						max_tokens: 150, // Adjust based on your needs
						temperature: 0.7, // Adjust temperature for randomness in responses
					}),
				}
			);

			const data = await response.json();

			if (response.ok) {
				// Assuming the response has the summary in the 'content' field of the first choice
				const summary = data.choices[0].message.content.trim();
				message.success("Summary generated successfully!");
				const formattedText = summary.replace(/\\n/g, "<br />");
				setSummary(formattedText);
			} else {
				throw new Error(data.error.message || "Failed to generate summary!");
			}
		} catch (error) {
			message.error("Failed to generate summary!");
			console.error(error);
		} finally {
			setLoadingSummary(false);
		}
	};
	const handleUpload = async (file: File) => {
		if (file.size > 25 * 1024 * 1024) {
			message.error("File must be less than 25MB!");
			return false;
		}
		message.loading("Generating transcript, please wait...");
		setLoadingTranscribe(true);
		try {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("model", "whisper-1"); // Example model name
			// Replace 'YOUR_API_KEY' with your actual API key
			const response = await axios.post(
				"https://api.openai.com/v1/audio/transcriptions",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
					},
				}
			);
			message.success("Transcribe generated!");
			setLoadingTranscribe(false);
			setTranscript(response.data.text);
			await handleSummary(response.data.text);
		} catch (error) {
			message.error("Failed to transcribe audio file!");
			console.error(error);
		}
		return false; // Prevent default upload behavior
	};
	const testSummary = async () => {
		await handleSummary(
			"Conversation between a passenger and an official at the Land Transport Information Service at Toronto Airport. First, you have some time to look at questions 1 to 5. You will see that there is an example that has been done for you. On this occasion only, the conversation relating to this will be played first. Hello, this is Land Transport Information at Toronto Airport. How may I help you? Oh, good morning. I'm flying to Toronto Airport next week and I need to get to a town called Milton. Could you tell me how I can get there? Milton, did you say? Let me see. I think that's about 150 miles southwest of here. In fact, it's 147 miles to be exact. So it'll take you at least, say, 3 to 4 hours by road. The distance from the airport to Milton is 147 miles, so 147 has been written in the space. Now we shall begin. You should answer the questions as you listen because you will not hear the recording a second time. Listen carefully and answer questions 1 to 5. Hello, this is Land Transport Information at Toronto Airport. How may I help you? Oh, good morning. I'm flying to Toronto Airport next week and I need to get to a town called Milton. Could you tell me how I can get there? Milton, did you say? Let me see. I think that's about 150 miles southwest of here. In fact, it's 147 miles to be exact. So it'll take you at least, say, 3 to 4 hours by road. Wow! Is it as far as that? Yes, I'm afraid so. But you have a number of options to get you there and you can always rent a car right here at the airport, of course. Right. Well, I don't really want to drive myself, so I'd like more information about public transport. OK. In that case, the quickest and most comfortable is a cab and, of course, there are always plenty available, but it'll cost you. You can also take a Greyhound bus or there's an airport shuttle service to Milton. I think for that kind of distance, a cab would be way beyond my budget. But the bus sounds OK. Can you tell me how much that would cost? Sure. Let's see. That would be $15 one way or $27.50 return. That's on the Greyhound. Ah, that's quite cheap. Great. But whereabouts does it stop in Milton? It goes directly from the airport here to the city centre and it's pretty fast. But you have to bear in mind that there is only one departure a day, so it depends what time your flight gets in. Ah, of course. Hang on. Are we due to get there at 11.30am? Too bad. The bus leaves at 3.45, so you would have quite a wait, more than four hours. Oh, I see. Well, what about the shuttle you mentioned? OK. That's the airport shuttle that will take you from the airport right to your hotel or private address. It's a door-to-door service and it would suit you much better because there's one every two hours. So how much does that cost? Let's see. Yeah, that's $35 one way, $65 return. So I guess it's a bit more expensive than the Greyhound. Oh, that doesn't sound too bad, especially if it'll take me straight to the hotel. But you do need to reserve a seat. OK. Is it possible to make a booking right now, through you? Sure. OK. I just have to fill this form out for you. So what date do you want to book this for? The 16th of October. Oh, no, sorry, that's my departure date. I arrive on the 17th, so book it for them, please. So that's the Toronto Airport shuttle to Milton. And this is for just one person, or...? Yeah, yeah, just me, please. Right. And you said your expected time of arrival was 11.30? So if I book your shuttle for after 12, let's say 12.30, that should give you plenty of time to, you know, collect your baggage, maybe grab a coffee. Yeah, that sounds fine, as long as we land on time. Well, we'll take your flight details, so you don't need to worry too much about that. Now, what about the fare? What sort of ticket do you want, one way or...? Yeah, that'll be fine, provided I can book the return trip once I'm there. No problem. Just allow a couple of days in advance to make sure you get a seat. And what is your name, please? Janet. Janet Thompson. Is that Thompson spelled with a P? No, it's T-H-O-M-S-O-N. OK. And you'll be coming from the UK? What flight will you be travelling on? Oh, it's Air Canada flight number AC936 from London Heathrow. Right. Now, do you know where you'll be staying? We need to give the driver an address. Yes, it's called the Vacation Motel, and I think it's near the town centre. Anyway, the address is 24 Kitchener Street. That's K-I-T-C-H-E-N-E-R Street. That's fine. Right, so that's $35 to pay, please. Have you got your credit card number there? Yes, it's a Visa card, and the number is 3303 8450 2045 6837. OK. Well, that seems to be everything. Have a good trip, and we'll see you in Toronto next week. Yes, bye. Oh, thanks for your help. Just give yourself a minute to check your answers. Now turn to section 2. You will hear a representative from a holiday company called PS Camping giving a talk about the holidays the company organises. First, you have some time to look at questions 11 to 16."
		);
	};

	return (
		<div style={{ padding: "20px" }}>
			<h1>Audio to Text Transcription</h1>
			<Upload.Dragger
				name="file"
				accept=".mp3"
				customRequest={({ file }) => handleUpload(file as File)}
				showUploadList={false}
			>
				<p className="ant-upload-drag-icon">
					<UploadOutlined />
				</p>
				<p className="ant-upload-text">
					Click or drag MP3 file to this area to upload
				</p>
				<p className="ant-upload-hint">File must be less than 25MB.</p>
			</Upload.Dragger>
			{/* <Button onClick={testSummary}>Test Summary</Button> */}
			{loadingTranscribe && (
				<div style={{ marginTop: "20px" }}>
					<h2>Transcription:</h2>
					<Spin />
				</div>
			)}
			{transcript && (
				<div style={{ marginTop: "20px" }}>
					<h2>Transcription:</h2>
					<p>{transcript}</p>
				</div>
			)}
			{loadingSummary && (
				<div style={{ marginTop: "20px" }}>
					<h2>Summary:</h2>
					<Spin />
				</div>
			)}
			{summary && (
				<div style={{ marginTop: "20px" }}>
					<h2>Summary:</h2>
					<p>
						<span dangerouslySetInnerHTML={{ __html: summary }} />
					</p>
				</div>
			)}
		</div>
	);
};

export default AudioTranscribePage;
