const fs = require('fs');

function fixStats(filename) {
  let content = fs.readFileSync(filename, 'utf-8');
  content = content.replace(/<span class="left">\{\{topicStats\[(\d+)\]\.total\}\} câu hỏi<\/span>\s*<span class="right">/g, 
    '<span class="left">{{topicStats[$1].total}} câu hỏi</span>\n                    <span class="right" ng-if="topicStats[$1].correct > 0 || topicStats[$1].wrong > 0">');
  fs.writeFileSync(filename, content);
}

fixStats('views/home.html');
fixStats('views/list-topic.html');
console.log('done');
