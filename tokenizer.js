function token(type, value) {
	this.type = type;
	if(type != 'string')
		this.value = value.toLowerCase();
	else
		this.value = value;
}

module.exports = {
	token : token,
	tokenize(infile) {
		let tokens = []
		for(let i = 0; i < infile.length; i++) {
			if(infile[i] == '/' && infile[i + 1] == '/')
				while(infile[i] != '\n')
					i++;
			if(/[\(\)\[\]\{\}]/.test(infile[i]))
				tokens.push(new token('paren', infile[i]));
			if(infile[i] == ';')
				tokens.push(new token('name', infile[i]));
			if(infile[i] == ',')
				tokens.push(new token('comma', infile[i]));
			if(/[<>+\-*/=]/.test(infile[i]))
				tokens.push(new token('oper', infile[i]));
			let value = '';
			if(infile[i] == '.')
				tokens.push(new token('dot', infile[i]));
			if(infile[i] == ':') {
				if(infile)
				tokens.push(new token('colon', infile[i]));
			}
			while(/[0-9.]/.test(infile[i])) {
				value += infile[i];
				i++;
			}
			if(value != '') {tokens.push(new token('number', value.toLowerCase())); i--; continue;}
			while(/[a-z1-9_]/i.test(infile[i])) {
					value += infile[i];
					i++;
			}
			if(value.toLowerCase() == 'div') {tokens.push(new token('oper', ' div ')); i--; continue};
			if(value.toLowerCase() == 'mod') {tokens.push(new token('oper', ' mod ')); i--; continue};
			if(value != '') {tokens.push(new token('name', value.toLowerCase())); i--; continue};
			if(infile[i] == '\'') {
				i++;
				value = '"';
				while(infile[i] != '\'') {
					value += infile[i];
					i++;
				}
				value += '"';
				tokens.push(new token('string', value));
			}
			if(infile[i] == '{') {
				while(infile[i] != '}')
					i++;
			}
		}
		return tokens;
	}
}