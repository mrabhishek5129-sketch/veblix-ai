const fs = require("fs");
const path = require("path");

const targets = ["AI Website Builder", "AIWebBuilder", "AI Website"];
const results = [];

function searchDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".next" && entry.name !== ".git") {
        searchDir(fullPath);
      }
    } else if (/\.(tsx?|jsx?|json|html|css|md)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      for (const t of targets) {
        if (content.includes(t)) {
          results.push({ file: fullPath, match: t });
          break;
        }
      }
    }
  }
}

searchDir(path.join(__dirname, "..", "src"));
searchDir(path.join(__dirname, "..", "public"));

console.log("MATCHED_FILES:", JSON.stringify(results, null, 2));
