const School = require("../../models/School.model");
const Admin = require("../../models/Staff/admin.model");
const bcrypt = require("bcryptjs");
const responseStatus = require("../../handlers/responseStatus.handler");

/**
 * Create a school and primary admin
 */
exports.createSchool = async (data, creatorId, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      plan,
      adminName,
      adminEmail,
      adminPassword,
    } = data;

    const existing = await School.findOne({ email });
    if (existing) return responseStatus(res, 400, "failed", "School already exists");

    // plan limits
    let limits = { maxStudents: 100, maxTeachers: 10, maxClasses: 20 };
    if (plan === "standard") limits = { maxStudents: 500, maxTeachers: 50, maxClasses: 100 };
    if (plan === "premium") limits = { maxStudents: 999999, maxTeachers: 999999, maxClasses: 999999 };

    const school = await School.create({
      name,
      email,
      phone,
      address,
      subscription: { plan: plan || "trial", limits },
    });

    const hashed = await bcrypt.hash(adminPassword, 10);
    const admin = await Admin.create({
      name: adminName,
      email: adminEmail,
      password: hashed,
      schoolId: school._id,
      role: "admin",
      createdBy: creatorId,
    });

    school.primaryAdmin = admin._id;
    await school.save();

    return responseStatus(res, 201, "success", { school, admin: { _id: admin._id, name: admin.name, email: admin.email } });
  } catch (error) {
    return responseStatus(res, 500, "failed", error.message);
  }
};

exports.getAllSchools = async (res) => {
  try {
    const schools = await School.find().populate("primaryAdmin", "name email").sort("-createdAt");
    const prices = { trial: 0, basic: 29, standard: 79, premium: 149 };
    const revenue = schools.reduce((sum, s) => sum + (prices[s.subscription.plan] || 0), 0);
    return responseStatus(res, 200, "success", { results: schools.length, totalRevenue: revenue, data: schools });
  } catch (error) {
    return responseStatus(res, 500, "failed", error.message);
  }
};

exports.getSchoolById = async (id, res) => {
  try {
    const school = await School.findById(id).populate("primaryAdmin", "name email phone");
    if (!school) return responseStatus(res, 404, "failed", "School not found");
    return responseStatus(res, 200, "success", school);
  } catch (error) {
    return responseStatus(res, 500, "failed", error.message);
  }
};

exports.updateSchool = async (id, updates, res) => {
  try {
    const school = await School.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!school) return responseStatus(res, 404, "failed", "School not found");
    return responseStatus(res, 200, "success", school);
  } catch (error) {
    return responseStatus(res, 500, "failed", error.message);
  }
};

exports.updateSubscription = async (id, payload, res) => {
  try {
    const { plan, status, endDate } = payload;
    const school = await School.findById(id);
    if (!school) return responseStatus(res, 404, "failed", "School not found");

    if (plan) {
      school.subscription.plan = plan;
      if (plan === "basic") {
        school.subscription.limits = { maxStudents: 100, maxTeachers: 10, maxClasses: 20 };
      } else if (plan === "standard") {
        school.subscription.limits = { maxStudents: 500, maxTeachers: 50, maxClasses: 100 };
        school.features.parentPortal = true;
        school.features.analytics = true;
      } else if (plan === "premium") {
        school.subscription.limits = { maxStudents: 999999, maxTeachers: 999999, maxClasses: 999999 };
        school.features.parentPortal = true;
        school.features.analytics = true;
        school.features.whiteLabel = true;
        school.features.smsNotifications = true;
      }
    }
    if (status) school.subscription.status = status;
    if (endDate) school.subscription.endDate = endDate;

    await school.save();
    return responseStatus(res, 200, "success", school);
  } catch (error) {
    return responseStatus(res, 500, "failed", error.message);
  }
};

exports.toggleStatus = async (id, payload, res) => {
  try {
    const { isSuspended, suspensionReason } = payload;
    const school = await School.findById(id);
    if (!school) return responseStatus(res, 404, "failed", "School not found");
    school.isSuspended = !!isSuspended;
    school.suspensionReason = suspensionReason || "";
    school.isActive = !school.isSuspended;
    await school.save();
    return responseStatus(res, 200, "success", school);
  } catch (error) {
    return responseStatus(res, 500, "failed", error.message);
  }
};

exports.analytics = async (res) => {
  try {
    const totalSchools = await School.countDocuments();
    const activeSchools = await School.countDocuments({ "subscription.status": "active" });
    const suspendedSchools = await School.countDocuments({ isSuspended: true });
    const planDistribution = await School.aggregate([{ $group: { _id: "$subscription.plan", count: { $sum: 1 } } }]);
    const schools = await School.find({ "subscription.status": "active" });
    const prices = { trial: 0, basic: 29, standard: 79, premium: 149 };
    const monthlyRevenue = schools.reduce((sum, school) => sum + (prices[school.subscription.plan] || 0), 0);
    const totalUsage = await School.aggregate([{ $group: { _id: null, totalStudents: { $sum: "$subscription.usage.studentCount" }, totalTeachers: { $sum: "$subscription.usage.teacherCount" }, totalClasses: { $sum: "$subscription.usage.classCount" } } }]);

    return responseStatus(res, 200, "success", {
      schools: {
        total: totalSchools,
        active: activeSchools,
        suspended: suspendedSchools,
        trial: planDistribution.find(p => p._id === "trial")?.count || 0,
        basic: planDistribution.find(p => p._id === "basic")?.count || 0,
        standard: planDistribution.find(p => p._id === "standard")?.count || 0,
        premium: planDistribution.find(p => p._id === "premium")?.count || 0,
      },
      revenue: { monthly: monthlyRevenue, annual: monthlyRevenue * 12 },
      usage: totalUsage[0] || { totalStudents: 0, totalTeachers: 0, totalClasses: 0 },
    });
  } catch (error) {
    return responseStatus(res, 500, "failed", error.message);
  }
};

/**
 * Delete a school and its associated admin permanently
 */
exports.deleteSchool = async (id, res) => {
  try {
    const school = await School.findById(id);
    if (!school) return responseStatus(res, 404, "failed", "School not found");

    // Delete the primary admin associated with this school
    if (school.primaryAdmin) {
      await Admin.findByIdAndDelete(school.primaryAdmin);
    }

    // Delete all admins associated with this school
    await Admin.deleteMany({ schoolId: id });

    // Delete the school
    await School.findByIdAndDelete(id);

    return responseStatus(res, 200, "success", { message: "School deleted successfully" });
  } catch (error) {
    return responseStatus(res, 500, "failed", error.message);
  }
};
