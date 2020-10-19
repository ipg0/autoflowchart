const fs = require('fs')
const tokenize = require('./tokenizer.js').tokenize;
const parse = require('./parser.js').parse;
const visualize = require('./visual.js').visualize;
const dfs = require('./dfs.js').dfs;

const infile = fs.readFileSync(process.argv[2], 'utf-8');

var tokens = tokenize(infile);

[nodes, links] = parse(tokens);

links = dfs(nodes, links, 0);

visualize(nodes, links, process.argv[3]);