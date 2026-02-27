const fs = require("fs");
const path = require("path");

function ensureDir(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
  }
}

function writeRequirementEvidence(payload) {
  const baseDir = path.join(process.cwd(), "reports", "evidence", "requirements");
  ensureDir(baseDir);

  const fileName = `${payload.id.toLowerCase()}-${Date.now()}.json`;
  const fullPath = path.join(baseDir, fileName);
  fs.writeFileSync(fullPath, JSON.stringify(payload, null, 2), "utf-8");
  return fullPath;
}

module.exports = {
  writeRequirementEvidence
};
