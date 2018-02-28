## temporary splash page for tokenomics.io

built with:
- [yeoman](yeoman.io)
- yeoman's  [generator-webapp](https://github.com/yeoman/generator-webapp)
- [d3](https://d3js.org/)

key files:
- `src/index.html` - the main index page.
- `src/scripts/main.js` - the d3 visualization script.
- `src/styles/main.scss` - the stylesheet.

to serve this site locally:
- run `npm install` from project directory
- Run `gulp serve` to preview and watch for changes
- Run `gulp serve:test` to run the tests in the browser. Right now there are no tests.
- Run `gulp` to build your webapp for production
- Run `gulp serve:dist` to preview the production build
