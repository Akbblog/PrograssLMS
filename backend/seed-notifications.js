/**
 * Seed script to create notifications for each role for manual verification.
 * Run: node seed-notifications.js
 */
const mongoose = require('mongoose');
require('dotenv').config();
const dbConnect = require('./config/dbConnect');
const notifications = require('./lib/notifications');

async function run() {
  await dbConnect();

  console.log('Seeding notifications...');

  await notifications.createNotification({
    title: 'Welcome Admin',
    message: 'This is a seeded notification for admins',
    type: 'info',
    targetRoles: ['admin'],
  });

  await notifications.createNotification({
    title: 'Welcome Teacher',
    message: 'This is a seeded notification for teachers',
    type: 'info',
    targetRoles: ['teacher'],
  });

  await notifications.createNotification({
    title: 'Welcome Student',
    message: 'This is a seeded notification for students',
    type: 'info',
    targetRoles: ['student'],
  });

  console.log('Done.');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });