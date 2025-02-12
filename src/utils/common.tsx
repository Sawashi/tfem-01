/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const apikey = process.env.NEXT_PUBLIC_API_KEY ?? "";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import { StructuredRow } from "src/interfaces";
// Get your API key from https://makersuite.google.com/app/apikey
// Access your API key as an environment variable
export const genAI = new GoogleGenerativeAI(apikey);
export async function runGemini(msg: string) {
	//delay 1s for not spamming the api
	await new Promise((resolve) => setTimeout(resolve, 3000));
	// For dialog language tasks (like chat), use the gemini-pro model
	const model = genAI.getGenerativeModel({ model: "gemini-pro" });

	const chat = model.startChat();

	const result = await chat.sendMessage(msg);
	const response = result.response;
	const text = response.text();
	console.log("Gemini: ", text);
	return text;
}
// Converts local file information to a GoogleGenerativeAI.Part object
export function fileToGenerativePart(path: string, mimeType: string) {
	return {
		inlineData: {
			data: Buffer.from(fs.readFileSync(path)).toString("base64"),
			mimeType,
		},
	};
}

// Prints chunks of generated text to the console as they become available
export async function streamToStdout(stream: any) {
	for await (const chunk of stream) {
		const chunkText = chunk.text();
		process.stdout.write(chunkText);
	}
}

export async function displayTokenCount(model: any, request: any) {
	const { totalTokens } = await model.countTokens(request);
	console.log("Token count: ", totalTokens);
}

export async function displayChatTokenCount(model: any, chat: any, msg: any) {
	const history = await chat.getHistory();
	const msgContent = { role: "user", parts: [{ text: msg }] };
	await displayTokenCount(model, { contents: [...history, msgContent] });
}
export async function generateSingleQuestion(
	typeOfKnowledge: string,
	topicList: StructuredRow[]
) {}
