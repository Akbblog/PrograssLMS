const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    // Branding
    logo: {
      type: String, // URL to logo
      default: "",
    },
    primaryColor: {
      type: String,
      default: "#3B82F6", // Blue
    },
    secondaryColor: {
      type: String,
      default: "#10B981", // Green
    },
    customDomain: {
      type: String,
      default: "",
    },
    // Subscription Management
    subscription: {
      plan: {
        type: String,
        enum: ["trial", "basic", "standard", "premium"],
        default: "trial",
      },
      status: {
        type: String,
        enum: ["active", "inactive", "suspended", "expired"],
        default: "active",
      },
      startDate: {
        type: Date,
        default: Date.now,
      },
      endDate: {
        type: Date,
        // default to 14 days from creation (trial end)
        default: function () {
          const trialEnd = new Date();
          trialEnd.setDate(trialEnd.getDate() + 14);
          return trialEnd;
        },
      },
      // Usage Limits
      limits: {
        maxStudents: {
          type: Number,
          default: 100, // Basic plan default
        },
        maxTeachers: {
          type: Number,
          default: 10,
        },
        maxClasses: {
          type: Number,
          default: 20,
        },
      },
      // Current Usage
      usage: {
        studentCount: {
          type: Number,
          default: 0,
        },
        teacherCount: {
          type: Number,
          default: 0,
        },
        classCount: {
          type: Number,
          default: 0,
        },
      },
    },
    // Features enabled for this school
    features: {
      onlineExams: {
        type: Boolean,
        default: true,
      },
      attendance: {
        type: Boolean,
        default: true,
      },
      analytics: {
        type: Boolean,
        default: false, // Premium feature
      },
      whiteLabel: {
        type: Boolean,
        default: false, // Premium feature
      },
      parentPortal: {
        type: Boolean,
        default: false, // Standard+
      },
      smsNotifications: {
        type: Boolean,
        default: false, // Premium
      },
      // Core Module Toggles
      canManageTeachers: {
        type: Boolean,
        default: true,
      },
      canManageStudents: {
        type: Boolean,
        default: true,
      },
      canManageAcademics: {
        type: Boolean,
        default: true,
      },
      canManageAttendance: {
        type: Boolean,
        default: true,
      },
      canManageCommunication: {
        type: Boolean,
        default: true,
      },
      canManageExams: {
        type: Boolean,
        default: true,
      },
      canManageFinance: {
        type: Boolean,
        default: true,
      },
      canViewReports: {
        type: Boolean,
        default: true,
      },
      canManageRoles: {
        type: Boolean,
        default: true,
      },
    },

    // Module configuration, branding and integrations
    moduleConfig: {
      library: { enabled: { type: Boolean, default: true } },
      transport: { enabled: { type: Boolean, default: true } },
      hr: { enabled: { type: Boolean, default: true } },
      qrAttendance: { enabled: { type: Boolean, default: false } }
    },
    branding: {
      primaryColor: { type: String, default: '#3B82F6' },
      secondaryColor: { type: String, default: '#10B981' },
      documentWatermark: { type: String, default: '' },
      emailHeader: { type: String, default: '' },
      emailFooter: { type: String, default: '' }
    },
    integrations: {
      smsGateway: { provider: String, apiKey: String, senderId: String },
      paymentGateway: { provider: String, merchantId: String, apiKey: String },
      emailService: { provider: String, apiKey: String }
    },

    // Admin who registered the school
    primaryAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    suspensionReason: {
      type: String,
      default: "",
    },
    // Payment & Billing
    paymentSettings: {
      provider: { type: String, default: "stripe" },
      providerCustomerId: { type: String, default: "" },
      billingContact: {
        name: { type: String, default: "" },
        email: { type: String, default: "" },
        phone: { type: String, default: "" },
      },
      currency: { type: String, default: "USD" },
      billingAddress: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String,
      },
    },
    // Storage limits and usage
    storage: {
      limitMB: { type: Number, default: 1024 }, // default 1GB
      usedMB: { type: Number, default: 0 },
    },
    // Email and SMS templates & gateway
    emailTemplates: {
      welcome: { type: String, default: "" },
      passwordReset: { type: String, default: "" },
      invoice: { type: String, default: "" },
    },
    smsGateway: {
      provider: { type: String, default: "twilio" },
      apiKey: { type: String, default: "" },
      senderId: { type: String, default: "" },
    },
    // Notification settings
    notificationSettings: {
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
      pushNotifications: { type: Boolean, default: false },
    },
    // Global permissions and feature flags for admins
    globalPermissions: {
      canManageUsers: { type: Boolean, default: true },
      canManageBilling: { type: Boolean, default: false },
      canViewAnalytics: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

// Method to check if school can add more students
schoolSchema.methods.canAddStudent = function () {
  return this.subscription.usage.studentCount < this.subscription.limits.maxStudents;
};

// Method to check if school can add more teachers
schoolSchema.methods.canAddTeacher = function () {
  return this.subscription.usage.teacherCount < this.subscription.limits.maxTeachers;
};

// Method to check if subscription is valid
schoolSchema.methods.isSubscriptionValid = function () {
  return (
    this.subscription.status === "active" &&
    this.subscription.endDate > new Date()
  );
};

// Method to increment storage usage (in MB)
schoolSchema.methods.addStorageUsage = function (mb) {
  this.storage.usedMB += mb;
  // clamp to 0..limit
  if (this.storage.usedMB < 0) this.storage.usedMB = 0;
  if (this.storage.usedMB > this.storage.limitMB) this.storage.usedMB = this.storage.limitMB;
  return this.save();
};

// Method to check available storage
schoolSchema.methods.availableStorageMB = function () {
  return Math.max(0, this.storage.limitMB - this.storage.usedMB);
};

// Method to check if feature is enabled
schoolSchema.methods.hasFeature = function (featureName) {
  return this.features[featureName] === true;
};

const School = mongoose.models.School || mongoose.models.School || mongoose.model("School", schoolSchema);

module.exports = School;
