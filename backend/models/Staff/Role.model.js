const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

/**
 * Role Schema
 * Defines custom roles and permissions for school staff
 */
const RoleSchema = new mongoose.Schema(
    {
        // Role name
        name: {
            type: String,
            required: true,
            trim: true,
        },
        // Description
        description: {
            type: String,
            trim: true,
        },
        // Role type
        type: {
            type: String,
            enum: ["system", "custom"],
            default: "custom",
        },
        // Color for UI display
        color: {
            type: String,
            default: "#6366f1", // Indigo
        },
        // Permissions object
        permissions: {
            // Dashboard
            viewDashboard: { type: Boolean, default: true },

            // Teachers
            viewTeachers: { type: Boolean, default: false },
            addTeachers: { type: Boolean, default: false },
            editTeachers: { type: Boolean, default: false },
            deleteTeachers: { type: Boolean, default: false },

            // Students
            viewStudents: { type: Boolean, default: true },
            addStudents: { type: Boolean, default: false },
            editStudents: { type: Boolean, default: false },
            deleteStudents: { type: Boolean, default: false },

            // Classes
            viewClasses: { type: Boolean, default: true },
            manageClasses: { type: Boolean, default: false },

            // Attendance
            viewAttendance: { type: Boolean, default: true },
            takeAttendance: { type: Boolean, default: false },
            editAttendance: { type: Boolean, default: false },

            // Communication
            accessCommunication: { type: Boolean, default: true },
            createGroups: { type: Boolean, default: false },
            manageGroups: { type: Boolean, default: false },
            sendPrivateMessages: { type: Boolean, default: false },

            // Assessments
            viewAssessments: { type: Boolean, default: true },
            createAssessments: { type: Boolean, default: false },
            gradeAssessments: { type: Boolean, default: false },

            // Courses
            viewCourses: { type: Boolean, default: true },
            createCourses: { type: Boolean, default: false },
            manageCourses: { type: Boolean, default: false },

            // Reports
            viewReports: { type: Boolean, default: false },
            exportReports: { type: Boolean, default: false },

            // Settings
            manageSchoolSettings: { type: Boolean, default: false },
            manageRoles: { type: Boolean, default: false },
        },
        // Multi-tenancy
        schoolId: {
            type: ObjectId,
            ref: "School",
            required: true,
            index: true,
        },
        // Created by
        createdBy: {
            type: ObjectId,
            ref: "Admin",
            required: true,
        },
        // Status
        isActive: {
            type: Boolean,
            default: true,
        },
        // Can this role be deleted?
        isDeletable: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Compound index for unique role names per school
RoleSchema.index({ name: 1, schoolId: 1 }, { unique: true });

/**
 * Create default roles for a new school
 */
RoleSchema.statics.createDefaultRoles = async function (schoolId, adminId) {
    const defaultRoles = [
        {
            name: "Full Access Teacher",
            description: "Full access to all teacher functionalities",
            type: "system",
            color: "#10b981", // Green
            permissions: {
                viewDashboard: true,
                viewTeachers: true,
                viewStudents: true,
                addStudents: true,
                editStudents: true,
                viewClasses: true,
                viewAttendance: true,
                takeAttendance: true,
                editAttendance: true,
                accessCommunication: true,
                sendPrivateMessages: true,
                viewAssessments: true,
                createAssessments: true,
                gradeAssessments: true,
                viewCourses: true,
                createCourses: true,
                manageCourses: true,
                viewReports: true,
            },
            schoolId,
            createdBy: adminId,
            isDeletable: false,
        },
        {
            name: "Restricted Teacher",
            description: "Limited access - view only with attendance",
            type: "system",
            color: "#f59e0b", // Amber
            permissions: {
                viewDashboard: true,
                viewStudents: true,
                viewClasses: true,
                viewAttendance: true,
                takeAttendance: true,
                accessCommunication: true,
                viewAssessments: true,
                viewCourses: true,
            },
            schoolId,
            createdBy: adminId,
            isDeletable: false,
        },
        {
            name: "Attendance Manager",
            description: "Focused on attendance management",
            type: "system",
            color: "#3b82f6", // Blue
            permissions: {
                viewDashboard: true,
                viewStudents: true,
                viewClasses: true,
                viewAttendance: true,
                takeAttendance: true,
                editAttendance: true,
                viewReports: true,
            },
            schoolId,
            createdBy: adminId,
            isDeletable: false,
        },
        {
            name: "View Only",
            description: "Read-only access to data",
            type: "system",
            color: "#6b7280", // Gray
            permissions: {
                viewDashboard: true,
                viewTeachers: true,
                viewStudents: true,
                viewClasses: true,
                viewAttendance: true,
                viewAssessments: true,
                viewCourses: true,
            },
            schoolId,
            createdBy: adminId,
            isDeletable: false,
        },
    ];

    return await this.insertMany(defaultRoles);
};

const Role = mongoose.models.Role || mongoose.model("Role", RoleSchema);

module.exports = Role;
