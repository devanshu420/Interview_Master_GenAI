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

/**
 * Generates a resume PDF
 * @returns {Promise<Buffer>} - The generated PDF as a buffer
 */
async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

  // Final Prompt 
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







    // const prompt = `Generate resume for a candidate with the following details:
    //                     Resume: ${resume}
    //                     Self Description: ${selfDescription}
    //                     Job Description: ${jobDescription}

    //                     the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
    //                     The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
    //                     The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
    //                     you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
    //                     The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
    //                     The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
    //                 `

  
//   const prompt = `Generate a 1-page professional resume for a candidate with the following details:
// Resume Data: ${resume}
// Self Description: ${selfDescription}
// Job Description: ${jobDescription}

// Requirements:
// 1. The resume must be **ATS-friendly** with clear headings, bullet points, and spacing.
// 2. Use proper line breaks for sections: Contact, Summary, Skills, Projects, Education, Certifications, Additional Strengths.
// 3. Highlight technical skills and keywords relevant to backend development: Node.js, Express.js, RESTful APIs, Microservices, JWT, MongoDB, MySQL, RabbitMQ, Socket.IO, DSA, System Design.
// 4. Projects should have **3–5 concise bullet points** highlighting achievements, tech stack, and measurable impact.
// 5. Keep it **one page only**. Use short, crisp sentences and avoid long paragraphs.
// 6. Contact info should be clearly separated: Name, Location, Email, Phone, LinkedIn, GitHub.
// 7. Use simple professional **fonts and colors** (like black/blue headings) but avoid overly fancy formatting.
// 8. All links should be clickable and formatted: LinkedIn: <url> | GitHub: <url>
// 9. HTML should be clean, easy to read, and convertible to PDF using Puppeteer.
// 10. The final output should be JSON with a single field "html" containing the HTML content.

// Focus on quality and relevance to the job description. Ensure it **looks human-written**, concise, and optimized for ATS parsing with **90+ compatibility**.
// `;


























// /* ================= NORMALIZERS ================= */

// function normalizeResumeData(aiData) {
//   console.log("🔄 Normalizing AI Data...");

//   const data = aiData.resume || aiData;

//   return {
//     name: data?.contact_info?.name || "",

//     contact: {
//       location: data?.contact_info?.location || "",
//       phone: data?.contact_info?.phone || "",
//       email: data?.contact_info?.email || "",
//       linkedin: data?.contact_info?.linkedin || "",
//       github: data?.contact_info?.github || "",
//     },

//     summary: data?.summary || "",

//     skills: normalizeSkills(data?.skills),

//     projects: data?.projects || [],
//     education: data?.education || [],
//     certifications: data?.certifications || [],
//   };
// }

// function normalizeSkills(skills) {
//   if (!skills) return {};

//   // Case 1: already object (best case)
//   if (!Array.isArray(skills)) return skills;

//   const result = {};

//   skills.forEach((item) => {
//     if (typeof item === "object") {
//       Object.entries(item).forEach(([key, val]) => {
//         if (!result[key]) result[key] = [];
//         result[key] = result[key].concat(val);
//       });
//     }
//   });

//   return result;
// }

// // ================= HELPERS (YAHAN ADD KARNA HAI) =================

// function safeArray(data) {
//   if (!data) return [];
//   if (Array.isArray(data)) return data;
//   return [data];
// }
// function ensureArray(val) {
//   if (!val) return [];
//   if (Array.isArray(val)) return val;
//   if (typeof val === "string") return val.split(",");
//   return [];
// }

// function renderSection(title, content) {
//   const items = safeArray(content);

//   return `
//     <div class="section">
//       <h2>${title}</h2>
//       <ul>
//         ${items.map(item => `<li>${item}</li>`).join("")}
//       </ul>
//     </div>
//   `;
// }


// // ================= PDF GENERATOR =================
// async function generatePdfFromHtml(htmlContent) {
//   const browser = await puppeteer.launch({
//     headless: "new",
//     args: ["--no-sandbox", "--disable-setuid-sandbox"],
//   });

//   const page = await browser.newPage();
//   await page.setContent(htmlContent, { waitUntil: "networkidle0" });

//   const pdf = await page.pdf({
//     format: "A4",
//     printBackground: true,
//     margin: {
//       top: "10mm",
//       bottom: "10mm",
//       left: "10mm",
//       right: "10mm",
//     },
//   });

//   await browser.close();
//   return pdf;
// }


// // ================= SCHEMA =================
// const resumeSchema = z.object({
//   name: z.string(),
//   email: z.string(),
//   phone: z.string(),
//   location: z.string(),

//   summary: z.string(),

//   skills: z.array(z.string()),

//   experience: z.array(
//     z.object({
//       company: z.string(),
//       role: z.string(),
//       duration: z.string(),
//       points: z.array(z.string()),
//     })
//   ),

//   projects: z.array(
//     z.object({
//       name: z.string(),
//       tech: z.string(),
//       points: z.array(z.string()),
//     })
//   ),

//   education: z.array(
//     z.object({
//       degree: z.string(),
//       college: z.string(),
//       duration: z.string(),
//     })
//   ),
// });


// // ================= HTML TEMPLATE =================
// function generateProfessionalHTML(aiData) {
//   const data = normalizeResumeData(aiData);

//   const skillsHTML = Object.entries(data.skills || {})
//   .map(([category, values]) => {
//     if (!values?.length) return "";

//     return `
//       <p>
//         <strong>${category.replaceAll("_", " ")}:</strong>
//         ${values.join(", ")}
//       </p>
//     `;
//   })
//   .join("");

//   const projectsHTML = (data.projects || [])
//     .map(
//       (proj) => `
//       <div class="project">
//         <h4>${proj.title || proj.name || ""}</h4>
//         <p><strong>Tech:</strong> ${proj.tech_stack || proj.tech || ""}</p>
//         <ul>
//           ${(proj.bullet_points || proj.points || [])
//             .map((p) => `<li>${p}</li>`)
//             .join("")}
//         </ul>
//       </div>
//     `
//     )
//     .join("");

//   const educationHTML = (data.education || [])
//     .map(
//       (edu) => `
//       <div class="edu">
//         <strong>${edu.degree || ""}</strong>
//         <p>${edu.institution || edu.college || ""}</p>
//         <span>${edu.dates || edu.duration || ""}</span>
//         <p>${edu.details || ""}</p>
//       </div>
//     `
//     )
//     .join("");

//   const certHTML = (data.certifications || [])
//     .map(
//       (c) => `
//       <li>${c.title || c.name} (${c.issuer || ""})</li>
//     `
//     )
//     .join("");

//   return `
//   <html>
//   <head>
//     <style>
//       body {
//         font-family: Arial, sans-serif;
//         padding: 30px;
//         line-height: 1.5;
//         color: #111;
//       }

//       h1 {
//         text-align: center;
//         margin-bottom: 5px;
//       }

//       .contact {
//         text-align: center;
//         font-size: 12px;
//         margin-bottom: 20px;
//       }

//       h2 {
//         border-bottom: 2px solid #000;
//         font-size: 16px;
//         margin-top: 20px;
//       }

//       ul {
//         padding-left: 18px;
//       }

//       .project, .edu {
//         margin-bottom: 10px;
//       }

//       .skill-group {
//         margin-bottom: 5px;
//       }

//       @page {
//         margin: 15mm;
//       }
//     </style>
//   </head>

//   <body>

//     <h1>${data.name}</h1>

//     <div class="contact">
//       ${data.contact.location} |
//       ${data.contact.phone} |
//       ${data.contact.email} |
//       ${data.contact.linkedin}
//     </div>

//     <h2>Summary</h2>
//     <p>${data.summary}</p>

//     <h2>Technical Skills</h2>
//     ${skillsHTML}

//     <h2>Projects</h2>
//     ${projectsHTML}

//     <h2>Education</h2>
//     ${educationHTML}

//     ${
//       certHTML
//         ? `
//     <h2>Certifications</h2>
//     <ul>${certHTML}</ul>`
//         : ""
//     }

//   </body>
//   </html>
//   `;
// }


// // ================= MAIN FUNCTION =================
// async function generateResumePdf({ resume, selfDescription, jobDescription }) {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: `
//     Create ATS friendly resume in structured JSON.

//     Return JSON ONLY.

//     Structure must adapt to ANY profession (developer, sales, marketing, etc).

//     Include:
//     - contact_info
//     - summary
//     - skills (categorized)
//     - projects / experience
//     - education
//     - certifications

//     Resume: ${resume}
//     Self: ${selfDescription}
//     JD: ${jobDescription}
//     `,
//     config: { responseMimeType: "application/json" },
//   });

//   const aiData = JSON.parse(response.text);

//   console.log("✅ AI DATA:", aiData);

//   const html = generateProfessionalHTML(aiData);

//   return await generatePdfFromHtml(html);
// }