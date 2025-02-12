export interface ExcelDataItem {
	typeOfKnowledge: string;
	topic: string;
	recognize: string | null;
	understand: string | null;
	apply: string | null;
	highlyApplied: string | null;
}
export interface StructuredRow {
	hint: string;
	typeOfTopic: string;
	topic: string;
	recognize: string;
	understand: string;
	apply: string;
	highlyApplied: string;
}
export interface StructuredExcel {
	typeOfKnowledge: string;
	typeOfSection: string;
	topicList: StructuredRow[];
}
//Type of question: mulpiple choice, fill in the blank
export interface ResponseQuestion {
	typeOfQuestion: string;
	question: string;
	options: string[];
	answer: string;
}
export interface InterfaceExam {
	typeOfKnowledge: string;
	paragraph?: string;
	questions: ResponseQuestion[];
}
//Response from Gemini
export interface ResponseExam {
	question: string;
	options: string[];
	answer: string;
}
