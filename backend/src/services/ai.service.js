const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job describe",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Technical questions that can be asked in the interview along with their intention and how to answer them",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances",
          ),
      }),
    )
    .describe(
      "List of skill gaps in the candidate's profile along with their severity",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number in the preparation plan, starting from 1"),
        focus: z
          .string()
          .describe(
            "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc.",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.",
          ),
      }),
    )
    .describe(
      "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
    ),
  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated",
    ),
});
/* ================= NORMALIZER (VERY IMPORTANT) ================= */
function normalizeArray(arr, type) {
  if (!Array.isArray(arr)) return [];

  return arr
    .map((item) => {
      // ✅ already object
      if (typeof item === "object") return item;

      // ❌ string → convert to object
      if (typeof item === "string") {
        try {
          const fixed = item.replace(/(\w+):/g, '"$1":').replace(/'/g, '"');

          return JSON.parse(`{${fixed}}`);
        } catch (e) {
          console.log(`❌ Failed parsing ${type}:`, item);
          return null;
        }
      }

      return null;
    })
    .filter(Boolean);
}

/* ================= MAIN FUNCTION ================= */
async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `Generate a COMPLETE interview report in STRICT JSON format.

            IMPORTANT RULES:
            - Return ONLY JSON
            - DO NOT leave arrays empty
            - Follow structure EXACTLY

            VERY IMPORTANT (ANSWER FORMAT):
            - Answers must be SHORT and STRUCTURED
            - Use arrow format: "→"
            - No long paragraphs
            - Max 2-3 lines per answer
            - Focus on "what to say in interview"
            - NOT full theoretical explanation

            ANSWER STYLE EXAMPLE:

            GOOD:
            "Define JWT → stateless auth → header.payload.signature → used for authentication"

            BAD:
            "JWT stands for JSON Web Token and is used for..."

            FORMAT:

            {
            "matchScore": number,
            "technicalQuestions": [
                {
                "question": string,
                "intention": string,
                "answer": string
                }
            ],
            "behavioralQuestions": [
                {
                "question": string,
                "intention": string,
                "answer": string
                }
            ],
            "skillGaps": [
                {
                "skill": string,
                "severity": "low" | "medium" | "high"
                }
            ],
            "preparationPlan": [
                {
                "day": number,
                "focus": string,
                "tasks": [string]
                }
            ],
            "title": string
            }

            STRICT REQUIREMENTS:
            - At least 5 technical questions
            - At least 3 behavioral questions
            - Keep answers concise (VERY IMPORTANT)

            Resume: ${resume}
            Self Description: ${selfDescription}
            Job Description: ${jobDescription}
`;

  console.log("🚀 Calling Gemini...");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.7,
    },
  });

  console.log("RAW RESPONSE:", response.text);

  let parsed;

  /* ================= SAFE JSON PARSE ================= */
  try {
    parsed = JSON.parse(response.text);
  } catch (err) {
    const match = response.text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("❌ Invalid JSON from AI");
    parsed = JSON.parse(match[0]);
  }

  console.log("✅ Parsed JSON");

  /* ================= NORMALIZATION ================= */
  parsed.technicalQuestions = normalizeArray(
    parsed.technicalQuestions,
    "technicalQuestions",
  );

  parsed.behavioralQuestions = normalizeArray(
    parsed.behavioralQuestions,
    "behavioralQuestions",
  );

  parsed.skillGaps = normalizeArray(parsed.skillGaps, "skillGaps");

  parsed.preparationPlan = normalizeArray(
    parsed.preparationPlan,
    "preparationPlan",
  );

  /* ================= TITLE FIX ================= */
  parsed.title =
    parsed.title || jobDescription?.split("\n")[0] || "Interview Report";

  /* ================= HARD VALIDATION ================= */
  if (
    !parsed.technicalQuestions.length ||
    !parsed.behavioralQuestions.length ||
    !parsed.skillGaps.length ||
    !parsed.preparationPlan.length
  ) {
    console.log("❌ BAD AI OUTPUT:", parsed);
    throw new Error("AI returned invalid structured data");
  }

  console.log("🔥 FINAL CLEAN DATA READY");

  return parsed;
}

/**
 * Generates a PDF from HTML content using Puppeteer
 * @param {string} htmlContent - The HTML content to convert to PDF
 * @returns {Promise<Buffer>} - The generated PDF as a buffer
 */
async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "10mm",
      right: "10mm",
    },
  });

  await browser.close();
  return pdfBuffer;
}

/**
 * Generates a resume PDF
 * @returns {Promise<Buffer>} - The generated PDF as a buffer
 */
async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf, generatePdfFromHtml };
