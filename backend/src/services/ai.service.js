
const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/* ================= RETRY HELPER ================= */
async function retryWithDelay(fn, retries = 3, delayMs = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      const isOverloaded =
        err.message?.includes("503") ||
        err.message?.includes("UNAVAILABLE") ||
        err.message?.includes("high demand");

      if (isOverloaded && i < retries - 1) {
        console.log(
          `⚠️ Gemini overloaded. Retry ${i + 1}/${retries} after ${delayMs}ms...`
        );
        await new Promise((res) => setTimeout(res, delayMs));
        delayMs *= 2; // exponential backoff: 2s → 4s → 8s
      } else {
        throw err;
      }
    }
  }
}

/* ================= SCHEMA ================= */
const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job describe"
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe(
            "The intention of interviewer behind asking this question"
          ),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc."
          ),
      })
    )
    .describe(
      "Technical questions that can be asked in the interview along with their intention and how to answer them"
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe(
            "The intention of interviewer behind asking this question"
          ),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc."
          ),
      })
    )
    .describe(
      "Behavioral questions that can be asked in the interview along with their intention and how to answer them"
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances"
          ),
      })
    )
    .describe(
      "List of skill gaps in the candidate's profile along with their severity"
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe(
            "The day number in the preparation plan, starting from 1"
          ),
        focus: z
          .string()
          .describe(
            "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."
          ),
        tasks: z
          .array(z.string())
          .describe(
            "List of tasks to be done on this day to follow the preparation plan"
          ),
      })
    )
    .describe(
      "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"
    ),
  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated"
    ),
});

/* ================= NORMALIZER ================= */
function normalizeArray(arr, type) {
  if (!Array.isArray(arr)) return [];

  return arr
    .map((item) => {
      if (typeof item === "object") return item;

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

/* ================= GENERATE INTERVIEW REPORT ================= */
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
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

  console.log(" Calling Gemini for interview report...");

  // Wrapped with retry
  const response = await retryWithDelay(() =>
    ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    })
  );

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

  console.log(" Parsed JSON");

  /* ================= NORMALIZATION ================= */
  parsed.technicalQuestions = normalizeArray(
    parsed.technicalQuestions,
    "technicalQuestions"
  );
  parsed.behavioralQuestions = normalizeArray(
    parsed.behavioralQuestions,
    "behavioralQuestions"
  );
  parsed.skillGaps = normalizeArray(parsed.skillGaps, "skillGaps");
  parsed.preparationPlan = normalizeArray(
    parsed.preparationPlan,
    "preparationPlan"
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

/* ================= GENERATE PDF FROM HTML ================= */
async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch({
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
  ],
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null,
});
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "10mm",
      bottom: "10mm",
      left: "10mm",
      right: "10mm",
    },
    preferCSSPageSize: true,
  });

  await browser.close();
  return pdfBuffer;
}

/* ================= GENERATE RESUME PDF ================= */
async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const resumePdfSchema = z.object({
    html: z
      .string()
      .describe(
        "The HTML content of the resume which can be converted to PDF using any library like puppeteer"
      ),
  });

  const prompt = `Generate a professional, 1-page resume in HTML format for a candidate with the following details:
Resume Data: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

Requirements:

1. The resume must be **ATS-friendly**, easily parsed by Applicant Tracking Systems.
2. Use clear headings: Contact, Summary, Technical Skills, Projects, Education, Certifications, Additional Strengths.
3. Contact info must be separated and formatted: Name, Location, Email, Phone, LinkedIn, GitHub.
4. Summarize the Summary section in 2-3 concise bullets highlighting backend skills and relevant experience.
5. Technical Skills should be listed in bullets grouped by Languages, Backend, Frontend, Database, and Tools.
6. Projects must be 3-5 bullets per project, showing measurable impact, technologies used, and key achievements.
7. Use **short sentences**; remove redundancy to fit all content in 1 page.
8. HTML should use simple styling: professional fonts, small headings, bullets, and spacing suitable for PDF conversion using Puppeteer.
9. Use clickable links for GitHub and LinkedIn.
10. Highlight key technologies (Node.js, Express.js, MongoDB, REST APIs, Microservices, JWT, RBAC, Socket.IO, RabbitMQ) with <strong> tags.
11. Avoid long paragraphs; use <ul><li> for lists and <p> for text.
12. Focus on quality over quantity; make it **human-written and visually clean**.
13. The output must be a **JSON object** with a single field "html" containing the HTML content.

Goal: Generate a **concise, one-page, ATS-optimized resume** that is professional and visually appealing, ready for PDF generation.`;

  console.log("🚀 Calling Gemini for resume PDF...");

  //  Wrapped with retry
  const response = await retryWithDelay(() =>
    ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: zodToJsonSchema(resumePdfSchema),
      },
    })
  );

  const jsonContent = JSON.parse(response.text);
  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

  return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePdf, generatePdfFromHtml };



