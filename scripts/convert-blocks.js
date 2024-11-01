const fs = require("fs");

const file = `${__dirname}/../data/blocks.json`;
const blocks = JSON.parse(fs.readFileSync(file, "utf8"));

fs.writeFileSync(
  file,
  JSON.stringify(blocks.map(d => {
    d.publication = "blocks.roadtolarissa.com";
    d.url = d.url.replace("bl.ocks.org", "blocks.roadtolarissa.com");
    return d;
  }), null, 2)
);