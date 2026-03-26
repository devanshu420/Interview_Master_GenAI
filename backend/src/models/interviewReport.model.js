
/**
 * ================= INPUT =================
 * - Job Description (String)
 * - Resume Text Format (String)
 * - Self Description (String)
 *
 * - matchScore (Number)
 *
 * ================= OUTPUT =================
 *
 * 1. Technical Questions:
 * [
 *   {
 *     question: String,
 *     intention: String,
 *     answer: String
 *   }
 * ]
 *
 * 2. Behavioral Questions:
 * [
 *   {
 *     question: String,
 *     intention: String,
 *     answer: String
 *   }
 * ]
 *
 * 3. Skill Gap:
 * [
 *   {
 *     skill: String,
 *     severity: {
 *       type: String,
 *       enum: ["low", "medium", "high"]
 *     }
 *   }
 * ]
 *
 * 4. Preparation Plan:
 * [
 *   {
 *     day: Number,
 *     focus: String,
 *     tasks: [String]
 *   }
 * ]
 */

const mongoose = require('mongoose');

// Technical Question Sub Schema *******************
const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [ true, "Technical question is required" ]
    },
    intention: {
        type: String,
        required: [ true, "Intention is required" ]
    },
    answer: {
        type: String,
        required: [ true, "Answer is required" ]
    }
}, {
    _id: false
})

// Behaviour Question Sub Schema *******************
const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [ true, "Technical question is required" ]
    },
    intention: {
        type: String,
        required: [ true, "Intention is required" ]
    },
    answer: {
        type: String,
        required: [ true, "Answer is required" ]
    }
}, {
    _id: false
})

// Skill Gap Sub Schema *******************
const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [ true, "Skill is required" ]
    },
    severity: {
        type: String,
        enum: [ "low", "medium", "high" ],
        required: [ true, "Severity is required" ]
    }
}, {
    _id: false
})

// Prepration Plan Sub Schema ******************
const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [ true, "Day is required" ]
    },
    focus: {
        type: String,
        required: [ true, "Focus is required" ]
    },
    tasks: [ {
        type: String,
        required: [ true, "Task is required" ]
    } ]
})


/***************************************  Main Interview Report  Schema *********************************/
const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [ true, "Job description is required" ]
    },
    resume: {
        type: String,
    },
    selfDescription: {
        type: String,
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    technicalQuestions: [ technicalQuestionSchema ],
    behavioralQuestions: [ behavioralQuestionSchema ],
    skillGaps: [ skillGapSchema ],
    preparationPlan: [ preparationPlanSchema ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    title: {
        type: String,
        required: [ true, "Job title is required" ]
    },
}, {
    timestamps: true
})


const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);

module.exports = interviewReportModel;  