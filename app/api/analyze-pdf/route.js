// import { NextResponse } from "next/server";
// import { OpenAI } from "openai";
// import * as pdfParse from "pdf-parse/lib/pdf-parse.js";

export const runtime = "edge";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const MAX_FILE_SIZE = 20 * 1024 * 1024;

// // Optimized PDF parsing options
// const PDF_PARSE_OPTIONS = {
//   max: 0,
//   pagerender: async function (pageData) {
//     return pageData.getTextContent().then(function (textContent) {
//       return textContent.items.map((item) => item.str).join(" ");
//     });
//   },
// };

// export const config = {
//   api: {
//     bodyParser: false,
//     responseLimit: "50mb",
//   },
// };

// // Handle CORS preflight requests
// export async function OPTIONS(request) {
//   return new NextResponse(null, {
//     status: 204,
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//       "Access-Control-Allow-Headers": "Content-Type, Authorization",
//     },
//   });
// }

// export async function POST(request) {
//   const headers = {
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "POST, OPTIONS",
//     "Access-Control-Allow-Headers": "Content-Type, Authorization",
//   };

//   try {
//     const formData = await request.formData();
//     const file = formData.get("pdf");

//     if (!file) {
//       return NextResponse.json(
//         { error: "No file uploaded" },
//         { status: 400, headers }
//       );
//     }

//     // Basic validations
//     if (!file.type?.includes("pdf") || file.size > MAX_FILE_SIZE) {
//       return NextResponse.json(
//         { error: "Invalid file type or size" },
//         { status: 400, headers }
//       );
//     }

//     // Convert file to buffer
//     const buffer = Buffer.from(await file.arrayBuffer());

//     // Extract text from PDF with optimized options
//     const pdfData = await pdfParse.default(buffer, PDF_PARSE_OPTIONS);
//     const pdfText = pdfData.text;

//     if (!pdfText?.trim()) {
//       return NextResponse.json(
//         { error: "No text could be extracted from the PDF" },
//         { status: 400, headers }
//       );
//     }

//     // Use GPT-3.5-turbo for faster processing
//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "system",
//           content: `You are a contract analysis expert. Analyze the provided contract and return a JSON object with the following structure. Each section should contain an array of findings, where each finding is a clear, concise statement:

// {
//   "keyDates": {
//     "title": "Key Dates and Deadlines",
//     "findings": [
//       "Contract starts on [date]",
//       "Renewal deadline: [date]",
//       "Notice period: [duration]",
//       "Key milestones and delivery dates"
//     ]
//   },
//   "importantClauses": {
//     "title": "Important Clauses",
//     "findings": [
//       "Key contractual obligations",
//       "Non-compete terms",
//       "IP rights",
//       "Confidentiality requirements",
//       "Liability terms"
//     ]
//   },
//   "potentialRisks": {
//     "title": "Potential Risks",
//     "findings": [
//       "Ambiguous terms",
//       "Unfavorable clauses",
//       "Missing protections",
//       "Compliance issues",
//       "Business risks"
//     ]
//   },
//   "paymentTerms": {
//     "title": "Payment Terms",
//     "findings": [
//       "Payment schedule",
//       "Late payment penalties",
//       "Currency and methods",
//       "Price adjustments",
//       "Financial obligations"
//     ]
//   },
//   "terminationConditions": {
//     "title": "Termination Conditions",
//     "findings": [
//       "Termination triggers",
//       "Notice periods",
//       "Early termination penalties",
//       "Post-termination obligations",
//       "Survival clauses"
//     ]
//   },
//   "enforceability": {
//     "title": "Enforceability",
//     "content": "Provide a clear assessment of the contract's enforceability. Consider: 1) The type of contract, 2) The governing body like for employees, labor laws, 3) Any specific conditions that affect enforceability, 4) Potential challenges to enforcement, and 5) Overall enforceability strength. Format this as a concise paragraph."
//   }
// }

// Analyze the contract and fill each section with relevant findings. Keep each finding clear and concise. For the enforceability section, provide a well-structured paragraph that addresses all the points mentioned. Return the response as a valid JSON object.`,
//         },
//         {
//           role: "user",
//           content: pdfText,
//         },
//       ],
//       temperature: 0.3,
//       max_tokens: 1000,
//       presence_penalty: -0.5,
//       frequency_penalty: 0.3,
//       response_format: { type: "json_object" },
//     });

//     // Parse the JSON response
//     const analysis = JSON.parse(completion.choices[0].message.content);

//     // Convert to markdown format for frontend
//     const structuredAnalysis = {
//       keyDates: analysis.keyDates.findings.map((f) => `- ${f}`).join("\n"),
//       importantClauses: analysis.importantClauses.findings
//         .map((f) => `- ${f}`)
//         .join("\n"),
//       potentialRisks: analysis.potentialRisks.findings
//         .map((f) => `- ${f}`)
//         .join("\n"),
//       paymentTerms: analysis.paymentTerms.findings
//         .map((f) => `- ${f}`)
//         .join("\n"),
//       terminationConditions: analysis.terminationConditions.findings
//         .map((f) => `- ${f}`)
//         .join("\n"),
//       enforceability: analysis.enforceability.content,
//     };

//     return NextResponse.json({ analysis: structuredAnalysis }, { headers });
//   } catch (error) {
//     console.error("PDF analysis error:", error);
//     return NextResponse.json(
//       { error: error.message || "Failed to analyze PDF" },
//       { status: 500, headers }
//     );
//   }
// }
