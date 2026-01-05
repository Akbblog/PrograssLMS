const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dirsToScan = ['controllers', 'services', 'middlewares', 'routes', 'models'];

function scanDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            scanDir(filePath);
        } else if (file.endsWith('.js')) {
            let content = fs.readFileSync(filePath, 'utf8');
            let changed = false;
            
            // Fix responseStatus imports
            if (content.includes('require("../../handlers/responseStatus.handler")')) {
                content = content.replace(/require\("\.\.\/\.\.\/handlers\/responseStatus\.handler"\)/g, 'require("../../handlers/responseStatus.handler.js")');
                changed = true;
            }
            if (content.includes('require("../handlers/responseStatus.handler")')) {
                content = content.replace(/require\("\.\.\/handlers\/responseStatus\.handler"\)/g, 'require("../handlers/responseStatus.handler.js")');
                changed = true;
            }

            if (changed) {
                fs.writeFileSync(filePath, content);
                console.log(`Fixed imports in: ${filePath}`);
            }
        }
    });
}

console.log('Starting import fix...');
dirsToScan.forEach(d => {
    const fullPath = path.join(rootDir, d);
    if (fs.existsSync(fullPath)) {
        scanDir(fullPath);
    }
});
console.log('Import fix complete.');
