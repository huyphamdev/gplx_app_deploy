const fs = require('fs');

function updateFile(filename) {
  let content = fs.readFileSync(filename, 'utf-8');
  content = content.replace(/<span class="right"><span style="color: #0171ec;">\{\{topicStats\[(\d+)\]\.correct\}\} đúng<\/span> &nbsp; <span style="color: red;">\{\{topicStats\[\1\]\.wrong\}\} sai<\/span><\/span>/g, 
    '<span class="right" ng-if="topicStats[$1].correct > 0 || topicStats[$1].wrong > 0"><span style="color: #0171ec;">{{topicStats[$1].correct}} đúng</span> &nbsp; <span style="color: red;">{{topicStats[$1].wrong}} sai</span></span>');
  fs.writeFileSync(filename, content);
}

updateFile('views/home.html');
updateFile('views/list-topic.html');
console.log('done');
