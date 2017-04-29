This is the code to generate [my homepage](http://www.harryjstevens.com/).

## Setup
```bash
$ git clone https://github.com/harrystevens/homepage
$ cd homepage
$ npm install
```

## Generate a list of posts
```bash
$ node build/scrape_blocks.js
$ node build/scrape_medium.js
```

## Build the site
```bash
$ node build/create_home.js
$ node build/create_blog.js
```

## To look at the site
```bash
$ python -m SimpleHTTPServer 1234
```
Open (localhost:1234)[http://localhost:1234/]