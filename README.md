This is the code to generate [my homepage](http://www.harryjstevens.com/).

## Setup
```bash
$ git clone https://github.com/harrystevens/homepage
$ cd homepage
$ npm install
```

## Generate a list of posts
```bash
$ node scrape_blocks.js
$ node scrape_medium.js
```

## To look at the site
```bash
$ python -m SimpleHTTPServer 1234
```
Open localhost:1234