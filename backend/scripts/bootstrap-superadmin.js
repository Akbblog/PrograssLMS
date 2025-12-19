require('dotenv').config();
const mongoose = require('mongoose');
require('../config/dbConnect');
const Admin = require('../models/Staff/admin.model');
const { hashPassword } = require('../handlers/passHash.handler');

async function main() {
  try {
    if (process.env.ALLOW_BOOTSTRAP !== '1') {
      console.error('Refusing to bootstrap superadmin: set ALLOW_BOOTSTRAP=1');
      process.exit(1);
    }

    const email = process.env.SUPERADMIN_EMAIL;
    const password = process.env.SUPERADMIN_PASSWORD;
    const name = process.env.SUPERADMIN_NAME || 'Super Admin';

    if (!email || !password) {
      console.error('Please set SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD in environment');
      process.exit(1);
    }

    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (existing.role === 'super_admin') {
        console.log('SuperAdmin already exists:', { id: existing._id.toString(), email: existing.email });
        process.exit(0);
      }
      // If exists but not super_admin, promote
      existing.role = 'super_admin';
      existing.schoolId = undefined;
      existing.createdBy = undefined;
      await existing.save();
      console.log('Existing user promoted to SuperAdmin:', { id: existing._id.toString(), email: existing.email });
      process.exit(0);
    }

    const hashed = await hashPassword(password);
    const admin = new Admin({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role: 'super_admin',
    });
    await admin.save();
    console.log('SuperAdmin created:', { id: admin._id.toString(), email: admin.email });
    process.exit(0);
  } catch (err) {
    console.error('Failed to bootstrap superadmin:', err);
    process.exit(2);
  }
}

main();
