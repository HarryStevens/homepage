var fs = require("fs");

var head = fs.readFileSync("components/head.html", "utf-8"),
  	body = fs.readFileSync("components/home.html", "utf-8"),
  	foot = fs.readFileSync("components/foot.html", "utf-8"),
  	bottom = fs.readFileSync("components/bottom.html", "utf-8");

fs.writeFileSync("index.html", head + body + foot + bottom);
