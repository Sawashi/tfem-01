import {
	InterfaceExam,
	ResponseExam,
	ResponseQuestion,
	StructuredExcel,
	StructuredRow,
} from "src/interfaces";
import { runGemini } from "../utils/common";
import { message } from "antd";

export async function translateToEnglish(text: string): Promise<string> {
	const prefix = "translate to english: ";
	const response = await runGemini(prefix + text);
	return response;
}

export async function generateSingleQuestion(
	typeOfKnowledge: string,
	topic: string,
	hint: string,
	level: string,
	numberOfQuestions: string,
	typeOfQuestion: string
): Promise<string> {
	const prefix =
		"Create for me " +
		numberOfQuestions +
		" " +
		typeOfQuestion +
		" question about ";
	const content =
		`"` +
		typeOfKnowledge +
		`"` +
		" with topic " +
		`"` +
		topic +
		`"` +
		", the question must include " +
		`"` +
		hint +
		`"` +
		" at level " +
		`"` +
		level +
		`"`;
	const suffix = ". The answer must only an array with format: ";
	const formatAnswer = `[{
    "question": string;
    "options": string[];
    "answer": string;
}]`;
	const prompt = prefix + content + suffix + formatAnswer;
	let result = await runGemini(prompt);
	return result;
}
export async function generateParagraph(hints: string[]): Promise<string> {
	const prefix = "Create for me a random paragraph";
	let content = "";
	if (hints.length > 0) {
		content =
			" that can be used to answer those questions: " + hints.join(", ");
	}
	const suffix =
		". The answer length should be 7 sentences or 200 words and contain only the paragraph.";
	const prompt = prefix + content + suffix;
	let result = await runGemini(prompt);
	return result;
}
export async function generateParagraphQuestion(
	paragraph: string,
	typeOfTopic: string,
	topic: string,
	hint: string,
	recognize: string,
	understand: string,
	apply: string,
	highlyApplied: string
): Promise<string> {
	const prefix = "Read the following paragraph and do the requests: ";
	let content =
		"\n Requests: Create for me " +
		`"` +
		typeOfTopic +
		`"` +
		" question about " +
		topic;
	if (hint != "") {
		content += " that " + `"` + hint + `"` + ".";
	}
	content += ". You have to create ";
	if (parseInt(recognize) > 0) {
		content += recognize + " question easy, ";
	}
	if (parseInt(understand) > 0) {
		content += understand + " question medium, ";
	}
	if (parseInt(apply) > 0) {
		content += apply + " question hard, ";
	}
	if (parseInt(highlyApplied) > 0) {
		content += highlyApplied + " question very hard, ";
	}
	const suffix =
		". The answer must include only an array (no need to add indicate part) with format: ";
	const formatAnswer = `[{
			"question": string;
			"options": string[];
			"answer": string;
}]`;
	const prompt =
		prefix + `"` + paragraph + `"` + content + suffix + formatAnswer;
	let result = await runGemini(prompt);
	return result;
}
export async function generateParagraphQuestionSimple(
	paragraph: string,
	typeOfKnowledge: string,
	topic: string,
	hint: string,
	level: string,
	numberOfQuestions: string,
	typeOfQuestion: string
): Promise<string> {
	const prefix =
		"Read the following paragraph and do the requests: \n" +
		paragraph +
		"\nCreate for me " +
		numberOfQuestions +
		" " +
		typeOfQuestion +
		" question about ";
	const content =
		`"` +
		typeOfKnowledge +
		`"` +
		" with topic " +
		`"` +
		topic +
		`"` +
		" that " +
		`"` +
		hint +
		`"` +
		" at level " +
		`"` +
		level +
		`"`;
	const suffix = ". The answer must include only an array with format: ";
	const formatAnswer = `[{
	"question": string;
	"options": string[];
	"answer": string;
}]`;
	const prompt = prefix + content + suffix + formatAnswer;
	let result = await runGemini(prompt);
	return result;
}
function correctJSONString(inputString: string): string {
	// Replace single quotes with double quotes for keys and values
	let correctedString = inputString
		.replace(/([{,]\s*)'([^']+)'(\s*[:])/g, '$1"$2"$3') // Correcting keys
		.replace(/:\s*'([^']*)'/g, ': "$1"'); // Correcting values

	return correctedString;
}

function convertStringToResponseExamArray(
	jsonString: string
): ResponseExam[] | null {
	console.log("String to convert:");
	console.log(jsonString);
	try {
		// Correct the JSON string before parsing
		const correctedJSONString = correctJSONString(jsonString);
		// console.log("Corrected string:");
		// console.log(correctedJSONString);

		// Parse the corrected JSON string to an array
		const parsedArray: ResponseExam[] = JSON.parse(correctedJSONString);

		// Check if parsedArray is an array and validate each item
		if (
			Array.isArray(parsedArray) &&
			parsedArray.every(
				(item: any) =>
					typeof item.question === "string" &&
					Array.isArray(item.options) &&
					item.options.every((option: any) => typeof option === "string") &&
					typeof item.answer === "string"
			)
		) {
			return parsedArray;
		} else {
			return null;
		}
	} catch (error) {
		console.error("Failed to parse JSON string:", error);
		return null;
	}
}
function extractDataBetweenBrackets(aiResponse: string) {
	console.log("String to extract:");
	console.log(aiResponse);
	// Regular expression to match content between [{ and }]
	const regex = /\[\{([\s\S]*?)\}\]/;
	const match = aiResponse.match(regex);

	if (match) {
		// Remove newlines and unnecessary spaces
		const cleanedData = match[0].replace(/\s+/g, " ").trim();
		return cleanedData;
	} else {
		return "No matching data found.";
	}
}
export function convertResponseExamToResponseQuestion(
	responseExams: ResponseExam[],
	typeOfQuestion: string
): ResponseQuestion[] {
	const responseQuestions: ResponseQuestion[] = responseExams.map(
		(responseExam) => {
			const responseQuestion: ResponseQuestion = {
				typeOfQuestion: typeOfQuestion,
				question: responseExam.question,
				options: responseExam.options,
				answer: responseExam.answer,
			};
			return responseQuestion;
		}
	);
	return responseQuestions;
}
export async function generateExam(
	dataSource: StructuredExcel[]
): Promise<InterfaceExam[]> {
	const generateAndConvertQuestion = async (
		typeOfKnowledge: string,
		topic: string,
		hint: string,
		level: string,
		numberOfQuestions: string,
		typeOfQuestion: string
	): Promise<ResponseExam[] | null> => {
		let result: string;
		let convertedResult: ResponseExam[] | null = null;

		do {
			result = await generateSingleQuestion(
				typeOfKnowledge,
				topic,
				hint,
				level,
				numberOfQuestions,
				typeOfQuestion
			);
			const extractResult = extractDataBetweenBrackets(result);
			convertedResult = convertStringToResponseExamArray(extractResult);

			if (!convertedResult) {
				console.warn(
					`Conversion failed for question (${level}), regenerating...`
				);
			}
		} while (!convertedResult);

		return convertedResult;
	};
	const generateAndConvertQuestionForParagraph = async (
		paragraph: string,
		typeOfKnowledge: string,
		topic: string,
		hint: string,
		level: string,
		numberOfQuestions: string,
		typeOfQuestion: string
	): Promise<ResponseExam[] | null> => {
		let result: string;
		let convertedResult: ResponseExam[] | null = null;
		do {
			result = await generateParagraphQuestionSimple(
				paragraph,
				typeOfKnowledge,
				topic,
				hint,
				level,
				numberOfQuestions,
				typeOfQuestion
			);
			const extractResult = extractDataBetweenBrackets(result);
			convertedResult = convertStringToResponseExamArray(extractResult);

			if (!convertedResult) {
				console.warn(
					"Conversion failed for paragraph question, regenerating..."
				);
			}
		} while (!convertedResult);

		return convertedResult;
	};
	const result: InterfaceExam[] = [];
	for (const item of dataSource) {
		message.info("Generating exam for " + item.typeOfKnowledge);
		if (item.typeOfSection == "Single question combination") {
			const questions: ResponseQuestion[] = [];
			// Generate single questions
			for (const topic of item.topicList) {
				const recognize = parseInt(topic.recognize);
				const understand = parseInt(topic.understand);
				const apply = parseInt(topic.apply);
				const highlyApplied = parseInt(topic.highlyApplied);
				const hintEnglish = await translateToEnglish(topic.hint);
				// Generate question for recognize
				if (recognize > 0) {
					let recognizeResult = await generateAndConvertQuestion(
						item.typeOfKnowledge,
						topic.topic,
						hintEnglish,
						"easy",
						recognize.toString(),
						topic.typeOfTopic
					);
					if (recognizeResult === null) {
						recognizeResult = [];
					}
					questions.push(
						...convertResponseExamToResponseQuestion(
							recognizeResult,
							topic.typeOfTopic
						)
					);
				}

				// Generate question for understand
				if (understand > 0) {
					let understandResult = await generateAndConvertQuestion(
						item.typeOfKnowledge,
						topic.topic,
						hintEnglish,
						"medium",
						understand.toString(),
						topic.typeOfTopic
					);
					if (understandResult === null) {
						understandResult = [];
					}

					questions.push(
						...convertResponseExamToResponseQuestion(
							understandResult,
							topic.typeOfTopic
						)
					);
				}

				// Generate question for apply
				if (apply > 0) {
					let applyResult = await generateAndConvertQuestion(
						item.typeOfKnowledge,
						topic.topic,
						hintEnglish,
						"hard",
						apply.toString(),
						topic.typeOfTopic
					);
					if (applyResult === null) {
						applyResult = [];
					}
					questions.push(
						...convertResponseExamToResponseQuestion(
							applyResult,
							topic.typeOfTopic
						)
					);
				}

				// Generate question for highly applied
				if (highlyApplied > 0) {
					let highlyAppliedResult = await generateAndConvertQuestion(
						item.typeOfKnowledge,
						topic.topic,
						hintEnglish,
						"very hard",
						highlyApplied.toString(),
						topic.typeOfTopic
					);
					if (highlyAppliedResult === null) {
						highlyAppliedResult = [];
					}
					questions.push(
						...convertResponseExamToResponseQuestion(
							highlyAppliedResult,
							topic.typeOfTopic
						)
					);
				}
			}
			result.push({
				typeOfKnowledge: item.typeOfKnowledge,
				questions: questions,
			});
			message.success("Generated exam for " + item.typeOfKnowledge);
			// console.log("Final result:");
			// console.log(result);
		} else {
			// Generate paragraph questions
			let hints: string[] = [];
			hints = item.topicList
				.map((topic) => {
					if (topic.hint != "") {
						return topic.hint;
					}
				})
				.filter((hint) => hint !== undefined) as string[];

			// Generate paragraph
			const paragraphResult = await generateParagraph(hints);
			// Generate questions for paragraph
			const questions: ResponseQuestion[] = [];
			for (const topic of item.topicList) {
				const recognize = parseInt(topic.recognize);
				const understand = parseInt(topic.understand);
				const apply = parseInt(topic.apply);
				const highlyApplied = parseInt(topic.highlyApplied);
				const hintEnglish = await translateToEnglish(topic.hint);
				// Generate question for recognize
				if (recognize > 0) {
					let recognizeResult = await generateAndConvertQuestionForParagraph(
						paragraphResult,
						item.typeOfKnowledge,
						topic.topic,
						hintEnglish,
						"easy",
						recognize.toString(),
						topic.typeOfTopic
					);
					if (recognizeResult === null) {
						recognizeResult = [];
					}
					questions.push(
						...convertResponseExamToResponseQuestion(
							recognizeResult,
							topic.typeOfTopic
						)
					);
				}

				// Generate question for understand
				if (understand > 0) {
					let understandResult = await generateAndConvertQuestionForParagraph(
						paragraphResult,
						item.typeOfKnowledge,
						topic.topic,
						hintEnglish,
						"medium",
						understand.toString(),
						topic.typeOfTopic
					);
					if (understandResult === null) {
						understandResult = [];
					}

					questions.push(
						...convertResponseExamToResponseQuestion(
							understandResult,
							topic.typeOfTopic
						)
					);
				}

				// Generate question for apply
				if (apply > 0) {
					let applyResult = await generateAndConvertQuestionForParagraph(
						paragraphResult,
						item.typeOfKnowledge,
						topic.topic,
						hintEnglish,
						"hard",
						apply.toString(),
						topic.typeOfTopic
					);
					if (applyResult === null) {
						applyResult = [];
					}
					questions.push(
						...convertResponseExamToResponseQuestion(
							applyResult,
							topic.typeOfTopic
						)
					);
				}

				// Generate question for highly applied
				if (highlyApplied > 0) {
					let highlyAppliedResult =
						await generateAndConvertQuestionForParagraph(
							paragraphResult,
							item.typeOfKnowledge,
							topic.topic,
							hintEnglish,
							"very hard",
							highlyApplied.toString(),
							topic.typeOfTopic
						);
					if (highlyAppliedResult === null) {
						highlyAppliedResult = [];
					}
					questions.push(
						...convertResponseExamToResponseQuestion(
							highlyAppliedResult,
							topic.typeOfTopic
						)
					);
				}
			}
			result.push({
				typeOfKnowledge: item.typeOfKnowledge,
				paragraph: paragraphResult,
				questions: questions,
			});
			message.success("Generated exam for " + item.typeOfKnowledge);
			// console.log("Final result:");
			// console.log(result);
		}
	}
	if (result.length > 0) {
		return result;
	}
	return [];
}
