This is the code to generate [my homepage](http://www.harryjstevens.com/).

## Setup
```bash
git clone git@github.com:HarryStevens/homepage.git
cd homepage
npm install
```

## Build
```bash
npm run build
```

This command creates the entire site. But it is made up of other commands, which you can use individually.

### Generate post list
```bash
node build/scrape_blocks.js
node build/scrape_medium.js
```

### Build the site
```bash
node build/create_blog.js
node build/create_home.js
```

## Open
```bash
python -m SimpleHTTPServer 1234
```
Open localhost:1234 in your browser.