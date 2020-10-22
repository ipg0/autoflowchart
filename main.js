const fs = require('fs')
const tokenize = require('./tokenizer.js').tokenize;
const parse = require('./parser.js').parse;
const visualize = require('./visual.js').visualize;
const dfs = require('./dfs.js').dfs;
const sanitize = require('./sanitizer.js').sanitize;

const infile = fs.readFileSync(process.argv[2], 'utf-8');

var tokens = tokenize(infile);

tokens = sanitize(tokens);

[nodes, links] = parse(tokens);

links = dfs(nodes, links);

visualize(nodes, links, process.argv[3]);