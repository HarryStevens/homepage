const fs = require("fs"),
      scraperama = require("scraperama");

// empty json
const json = [];

// throttled scraper
const scrape_gist_limited = scraperama.throttle(scrape_gist, 5000);

// find out how many gists there are
scraperama.html("https://gist.github.com/harrystevens", ($) => {

  console.log("Data will output as data/blocks.json");

  const number = Math.ceil($("#gist-pjax-container > div > div > div.col-9.col-md-9.col-12 > div.pagehead.py-0.border-0.mt-md-0.mt-6.mr-md-0.mr-n3.ml-md-0.ml-n3 > nav > div.UnderlineNav-body > a.js-selected-navigation-item.selected.UnderlineNav-item > span").text() / 10);
  console.log(`Total gist pages: ${number}`)

  for (let i = 1; i <= number; i++){
    scrape_gist_limited(i);
  }

});
  
function scrape_gist(n){

  scraperama.html(`https://gist.github.com/harrystevens?page=${n}`, ($) => {

    $(".gist-snippet").each(function(block_index, block){
      
      // make sure the gist is a block
      if ($(block).find("a:nth-of-type(2)").text() == ".block"){
      
        // an empty object for the block info
        const obj = {};

        obj.block_number = (n - 1) * 10 + (block_index + 1);

        obj.category = "Blocks";
        obj.headline = $(block).find("span.f6.color-fg-muted").text().trim();
        obj.date = $(block).find("time-ago").text().trim();
        obj.publication = "blocks.roadtolarissa.com";
        obj.slug = slugify(obj.headline);
        const url_end = $(block).find("a:nth-of-type(2)").attr("href");
        obj.url = `https://blocks.roadtolarissa.com${url_end}`;

        console.log(`Got block number ${obj.block_number}\t${obj.headline}`);

        scraperama.html(`https://gist.github.com/${url_end}`, ($) => {
          
          obj.img = $("#file-thumbnail-png").find("img").attr("src");

          json.push(obj);

          fs.writeFileSync(`${__dirname}/../data/blocks.json`, JSON.stringify(json));

        });

      }
      
    });

  });
}


function slugify(text){
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}