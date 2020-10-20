var promise = [];

var links = [];

function node(nodes, type, text) {
    this.type = type;
    this.text = text;
    this.index = nodes.length;
    nodes.push({type : type, text : text});
}

function connect(from, to, primary = 'primary', override = '', loop = '') {
    if(promise[0]) {
        temp = promise[0];
        promise.shift();
        connect(temp, to, primary = 'primary');
    }
    if(from.then || override == 'else') {
        from.else = to;
        links.push({type : 'else', from : from.index, to : to.index});
    }
    else {
        from.then = to;
        links.push({type : 'then', from : from.index, to : to.index});
    }
    if(primary == 'primary') {
        to.parent = from;
    }
    return to;
}

module.exports = {
    parse(tokens) {
        nodes = [];
        const start = new node(nodes, 'terminator', 'Начало');
        last = start;
        esc = [];
        escAction = [];
        escLinker = [];
        scope = ['global'];
        for(i = 0; i < tokens.length; i++) {
            noAction = true;
            oldScope = [...scope];
            if(tokens[i].type == 'name') {
                if(tokens[i].value == 'begin') {
                    noAction = false;
                    if(scope[scope.length - 1] == 'global') {
                        scope.push('main');
                        escAction.push('');
                        escLinker.push(null);
                    }
                    else {
                        scope.push('begin at token ' + i);
                        escAction.push('');
                        escLinker.push(null);
                    }
                    esc.push('end');
                }

                if(tokens[i].value == esc[esc.length - 1]) {
                    noAction = false;
                    if(scope[scope.length - 1] == 'main') {
                        last = connect(last, new node(nodes, 'terminator', 'Конец'));
                        scope.pop();
                        esc.pop();
                        escAction.pop();
                        escLinker.pop();
                    }
                    if(escAction[escAction.length - 1] == '') {
                        scope.pop();
                        esc.pop();
                        escAction.pop();
                        escLinker.pop();
                        continue;
                    }
                    if(escAction[escAction.length - 1] == 'linkThen') {
                        promise.push(escLinker[escLinker.length - 1]);
                        scope.pop();
                        esc.pop();
                        escAction.pop();
                        escLinker.pop();
                        i--;
                    }
                    if(escAction[escAction.length - 1] == 'linkElse') {
                        promise.push(escLinker[escLinker.length - 1]);
                        scope.pop();
                        esc.pop();
                        escAction.pop();
                        escLinker.pop();
                        i--;
                    }
                    if(escAction[escAction.length - 1] == 'linkBack') {
                        if(escLinker[escLinker.length - 1].type == 'incremental')
                            last = connect(last, escLinker[escLinker.length - 1], primary = 'no', '');
                        else
                            last = connect(last, escLinker[escLinker.length - 1], primary = 'no');
                        scope.pop();
                        esc.pop();
                        escAction.pop();
                        escLinker.pop();
                        i--;
                    }
                    if(escAction[escAction.length - 1] == 'setLinker') {
                        promise.push(escLinker[escLinker.length - 1]);
                        scope.pop();
                        esc.pop();
                        escAction.pop();
                        escLinker.pop();
                        i--;
                    }
                }

                if(tokens[i].value == ';') {
                    noAction = false;
                    while(escAction[escAction.length - 1] == 'setLinker') {
                        promise.push(escLinker[escLinker.length - 1]);
                        scope.pop();
                        esc.pop();
                        escAction.pop();
                        escLinker.pop();
                    }
                }

                if(tokens[i].value == 'for') {
                    noAction = false;
                    i++;
                    ctr = tokens[i].value;
                    i += 3;
                    from = '';
                    while(tokens[i].type != 'name' || tokens[i].value != 'to') {
                        from += tokens[i].value + ' ';
                        i++;
                    }
                    to = '';
                    i++;
                    while(tokens[i].type != 'name' || tokens[i].value != 'do') {
                        to += tokens[i].value + ' ';
                        i++;
                    }
                    esc.push(';');
                    last = connect(last, new node(nodes, 'incremental', ctr + ' = ' + from + ' .. ' + to));
                    scope.push('incremental at token ' + i);
                    escAction.push('linkBack');
                    escLinker.push(last);
                }

                if(tokens[i].value == 'while') {
                    noAction = false;
                    i++;
                    condition = '';
                    while(tokens[i].type != 'name' || tokens[i].value != 'do') {
                        condition += tokens[i].value + ' ';
                        i++;
                    }
                    esc.push(';');
                    last = connect(last, new node(nodes, 'decision', condition));
                    scope.push('looping decision at token ' + i);
                    escAction.push('linkBack');
                    escLinker.push(last);
                }

                if(tokens[i].value == 'repeat') {
                    noAction = false;
                    scope.push('repeat at token ' + i);
                    if(last.then)
                        escAction.push('linkElse');
                    else
                        escAction.push('linkThen');
                    escLinker.push(last);
                    esc.push('until spec');
                }

                if(tokens[i].value == 'until') {
                    noAction = false;
                    i++;
                    condition = '';
                    while(tokens[i].type != 'name' || (tokens[i].value != ';' && tokens[i].value != 'else')) {
                        condition += tokens[i].value + ' ';
                        i++;
                    }
                    i--;
                    last = connect(last, new node(nodes, 'decision', condition));
                    if(escAction[escAction.length - 1] == 'linkThen')
                        connect(last, escLinker[escLinker.length - 1].then, 'no', 'else');
                    else
                        connect(last, escLinker[escLinker.length - 1].else, 'no', 'else');
                    scope.pop();
                    escLinker.pop();
                    escAction.pop();
                    esc.pop();
                }

                if(tokens[i].value == 'if') {
                    noAction = false;
                    i++;
                    condition = '';
                    while(tokens[i].type != 'name' || tokens[i].value != 'then') {
                        condition += tokens[i].value + ' ';
                        i++;
                    }
                    esc.push(';');
                    last = connect(last, new node(nodes, 'decision', condition));
                    scope.push('decision at token ' + i);
                    escAction.push('setLinker');
                    escLinker.push(last);
                }

                if(tokens[i].value == 'else') {
                    noAction = false;
                    while(escAction[escAction.length - 1] != 'setLinker') {
                        if(escAction[escAction.length - 1] == 'linkBack') {
                            last = connect(last, escLinker[escLinker.length - 1], primary = 'no');
                        }
                        scope.pop();
                        esc.pop();
                        escAction.pop();
                        escLinker.pop();
    
                        while(escAction[escAction.length - 1] == 'linkBack') {
                                last = connect(last, escLinker[escLinker.length - 1], primary = 'no');
                                scope.pop();
                                esc.pop();
                                escAction.pop();
                                escLinker.pop();
                        }
                    }

                    if(last.then)
                        escAction[escAction.length - 1] = 'linkElse';
                    else
                        escAction[escAction.length - 1] = 'linkThen';
                    temp = escLinker[escLinker.length - 1];
                    escLinker[escLinker.length - 1] = last;
                    last = temp;
                }

                if(tokens[i].value == 'readln' || tokens[i].value == 'read') {
                    noAction = false;
                    params = '';
                    i += 2;
                    while(tokens[i].type != 'paren' || tokens[i].value != ')') {
                        params += tokens[i].value + ' ';                            
                        i++;
                    }
                    if(params != '')
                        params = 'Ввод: ' + params;
                    else
                        params = 'Ожидание ввода';
                    last = connect(last, new node(nodes, 'data', params));
                }

                if(tokens[i].value == 'writeln' || tokens[i].value == 'write') {
                    noAction = false;
                    params = '';
                    i += 2;
                    while(tokens[i].type != 'paren' || tokens[i].value != ')') {
                        params += tokens[i].value + ' ';
                        i++;
                    }
                    if(params != '')
                        params = 'Вывод: ' + params;
                    else
                        params = 'Перевод строки';
                    last = connect(last, new node(nodes, 'data', params));
                }

                if(noAction && scope[scope.length - 1] != 'global') {
                    proc = '';
                    while(tokens[i].type != 'name' || tokens[i].value != ';') {
                        proc += tokens[i].value + ' ';
                        i++; 
                    }
                    i--;
                    last = connect(last, new node(nodes, 'process', proc));
                }
            }
        }
        return [nodes, links];
    }
}
