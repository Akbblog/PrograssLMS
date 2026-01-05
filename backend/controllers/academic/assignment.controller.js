const Assignment = require("../../models/Academic/Assignment.model");

// Create Assignment
exports.createAssignment = async (req, res) => {
    try {
        const { title, description, subject, classLevel, dueDate, totalPoints, attachments, academicYear, academicTerm } = req.body;
        const schoolId = req.userAuth.schoolId;
        const teacher = req.userAuth._id;

        const assignment = await Assignment.create({
            title,
            description,
            subject,
            classLevel,
            teacher,
            dueDate,
            totalPoints: totalPoints || 100,
            attachments,
            schoolId,
            academicYear,
            academicTerm,
        });

        res.status(201).json({
            status: "success",
            data: assignment,
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// Get Assignments (Teacher/Admin/Student)
exports.getAssignments = async (req, res) => {
    try {
        const { classLevel, subject, studentId } = req.query;
        const schoolId = req.userAuth.schoolId;

        let query = { schoolId };
        if (classLevel) query.classLevel = classLevel;
        if (subject) query.subject = subject;

        const assignments = await Assignment.find(query)
            .populate("subject", "name")
            .populate("classLevel", "name")
            .populate("teacher", "name")
            .sort({ dueDate: -1 });

        // If student, include submission status
        if (studentId) {
            const assignmentsWithStatus = assignments.map((assignment) => {
                const submission = assignment.submissions.find(
                    (sub) => sub.student.toString() === studentId
                );
                return {
                    ...assignment.toObject(),
                    mySubmission: submission || null,
                };
            });
            return res.status(200).json({ status: "success", data: assignmentsWithStatus });
        }

        res.status(200).json({ status: "success", data: assignments });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// Submit Assignment (Student)
exports.submitAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const { content, fileUrl } = req.body;
        const studentId = req.userAuth._id;

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ status: "fail", message: "Assignment not found" });
        }

        // Check if already submitted
        const existingSubmission = assignment.submissions.find(
            (sub) => sub.student.toString() === studentId.toString()
        );

        if (existingSubmission) {
            existingSubmission.content = content;
            existingSubmission.fileUrl = fileUrl;
            existingSubmission.submittedAt = Date.now();
            existingSubmission.status = new Date() > assignment.dueDate ? "late" : "submitted";
        } else {
            assignment.submissions.push({
                student: studentId,
                content,
                fileUrl,
                status: new Date() > assignment.dueDate ? "late" : "submitted",
            });
        }

        await assignment.save();

        res.status(200).json({
            status: "success",
            message: "Assignment submitted successfully",
            data: assignment,
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// Grade Submission (Teacher)
exports.gradeSubmission = async (req, res) => {
    try {
        const { assignmentId, studentId } = req.params;
        const { grade, feedback } = req.body;

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ status: "fail", message: "Assignment not found" });
        }

        const submission = assignment.submissions.find(
            (sub) => sub.student.toString() === studentId
        );

        if (!submission) {
            return res.status(404).json({ status: "fail", message: "Submission not found" });
        }

        submission.grade = grade;
        submission.feedback = feedback;
        submission.status = "graded";

        await assignment.save();

        res.status(200).json({
            status: "success",
            message: "Submission graded successfully",
            data: assignment,
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};
