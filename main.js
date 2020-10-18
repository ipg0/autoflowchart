const fs = require('fs')
const tokenize = require('./tokenizer.js').tokenize;
const parse = require('./parser.js').parse;
const visualize = require('./visual.js').visualize;

const infile = fs.readFileSync(process.argv[2], 'utf-8');

var tokens = tokenize(infile);

[nodes, links] = parse(tokens);

//console.log(nodes, links);

visualize(nodes, links, process.argv[3]);