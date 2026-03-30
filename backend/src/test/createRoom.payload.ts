import { body } from "express-validator";

export interface CreateRoomPayload {
  jobId: string;
  candidateId: string;
  interviewerIds: string[];
  title: string;
  scheduledDate: Date;
  durationMinutes: number;
  createdBy: string;
}

export const CreateRoomValidator = [
  body("jobId")
    .notEmpty()
    .withMessage("Job ID is required")
    .isString()
    .withMessage("Job ID must be a string"),
  body("candidateId")
    .notEmpty()
    .withMessage("Candidate ID is required")
    .isString()
    .withMessage("Candidate ID must be a string"),
  body("interviewerIds")
    .notEmpty()
    .withMessage("Interviewer IDs is required")
    .isArray()
    .withMessage("Interviewer IDs must be an array"),
  body("interviewerIds.*")
    .isString()
    .withMessage("Interviewer ID must be a string"),
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string"),
  body("scheduledDate")
    .notEmpty()
    .withMessage("Scheduled date is required")
    .isISO8601()
    .withMessage("Scheduled date must be a valid date"),
  body("durationMinutes")
    .notEmpty()
    .withMessage("Duration is required")
    .isInt({ min: 1 })
    .withMessage("Duration must be a positive integer"),
];
