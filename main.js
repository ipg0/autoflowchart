const fs = require('fs')
const tokenize = require('./tokenizer.js').tokenize;
const parse = require('./parser.js').parse;
const visualize = require('./visual.js').visualize;
const dfs = require('./dfs.js').dfs;
const sanitize = require('./sanitizer.js').sanitize;

const infile = fs.readFileSync(process.argv[2], 'utf-8');

var tokens = tokenize(infile);

quiet = false;

if(process.argv.includes('-q'))
    quiet = true;

if(!quiet)
    console.log('Tokenizer: OK');

tokens = sanitize(tokens);

[nodes, links] = parse(tokens);

if(!quiet)
    console.log('Parser: OK');

if(!quiet)
    console.log('Nodes: ', nodes, '\nLinks: ', links);

links = dfs(nodes, links);

if(!quiet)
    console.log('DFS check: OK');

if(!quiet)
    console.log('Configured links: ', links);

visualize(nodes, links, process.argv[3]);

if(!quiet)
    console.log('Visualisation: OK\nDone.');