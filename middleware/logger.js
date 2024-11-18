const fs = require("fs");

function writeLog(req, res){
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  if(fs.existsSync(`./log/${today}.txt`)){
    fs.appendFileSync(`./log/${today}.txt`, `${req.method} ${res.statusCode} - ${req.url} - ${now.toISOString()} \n`);
  } else {
    fs.writeFileSync(`./log/${today}.txt`,  `${req.method} ${res.statusCode} - ${req.url} - ${now.toISOString()} \n`);
  }
};

module.exports = writeLog;