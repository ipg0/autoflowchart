const token = require('./tokenizer.js').token;

module.exports = {
    sanitize(tokens) {
        for(i = 1; i < tokens.length; i++) {
            if(tokens[i].type == 'name' && tokens[i - 1].type == 'name' && tokens[i].value == ';' && (tokens[i - 1].value == 'readln' || tokens[i - 1].value == 'read' || tokens[i - 1].value == 'writeln')) {
                tokens.splice(i, 0, new token('paren', '('), new token('paren', ')'));
            }
        }
        return tokens;
    }
}