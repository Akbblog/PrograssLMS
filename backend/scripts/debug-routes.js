const path = require('path');
const express = require('express');

const tryLoad = (relativePath) => {
    const fullPath = path.join(__dirname, '../routes/v1', relativePath);
    try {
        const module = require(fullPath);
        console.log(`✅ Successfully loaded ${relativePath}`);
        console.log(`   Type: ${typeof module}`);
        // console.log(`   Is Express Router: ${Object.getPrototypeOf(module) === express.Router}`);
        console.log(`   Stack length: ${module.stack ? module.stack.length : 'N/A'}`);
        if (module.stack) {
             module.stack.forEach((layer, i) => {
                 if (layer.route) {
                     console.log(`     [${i}] Route: ${Object.keys(layer.route.methods).join(',').toUpperCase()} ${layer.route.path}`);
                 }
             });
        }
    } catch (e) {
        console.error(`❌ Failed to load ${relativePath}:`);
        console.error(e);
    }
};

console.log('Testing route loading...');
tryLoad('academic/teacherAttendance.router.js');
tryLoad('academic/class.router.js');
tryLoad('academic/academicYear.router.js');
tryLoad('academic/academicTerm.router.js');