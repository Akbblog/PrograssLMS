const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dirsToScan = ['models', 'routes', 'services', 'controllers'];
let errorCount = 0;

function scanDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            scanDir(filePath);
        } else if (file.endsWith('.js')) {
            try {
                require(filePath);
                console.log(`✅ Loaded: ${path.relative(rootDir, filePath)}`);
            } catch (e) {
                console.error(`❌ Failed to load: ${path.relative(rootDir, filePath)}`);
                console.error(`   Error: ${e.message}`);
                errorCount++;
            }
        }
    });
}

console.log('Starting comprehensive load test...');
dirsToScan.forEach(d => {
    const fullPath = path.join(rootDir, d);
    if (fs.existsSync(fullPath)) {
        scanDir(fullPath);
    }
});

if (errorCount === 0) {
    console.log('🎉 All modules loaded successfully!');
} else {
    console.error(`⚠️ Found ${errorCount} errors.`);
    process.exit(1);
}
