const fs = require('fs');
let content = fs.readFileSync('js/full-exams.js', 'utf8');
let matches = content.match(/exam:\s*(\d+).*?licenseCode:\s*['"`].*?A1.*?['"`]/gs);
let counts = {};
if (matches) {
  matches.forEach(m => {
    let examMatch = m.match(/exam:\s*(\d+)/);
    if (examMatch) {
      let examId = examMatch[1];
      counts[examId] = (counts[examId] || 0) + 1;
    }
  });
}
console.log("Exam counts:", counts);
