const pureimage = require('pureimage');
const fs = require('fs');

hGlob = 200;
wGlob = 5000;

module.exports = {
    visualize(nodes, links, file) {
		nodes.forEach(node => {
			if(node.type == 'decision')
				hGlob += 382;
			else
				hGlob += 222;
		});
		hGlob += 200;
        img = pureimage.make(wGlob, hGlob);
        ctx = img.getContext('2d');
        var fnt = pureimage.registerFont('fonts/7454.ttf','Times New Roman');
        fnt.load(()=> {
            ctx.lineWidth = 5;
            x = wGlob / 2;
            y = 200;
            lbound = x;
			rbound = x;
			incScope = [];
            let lines = [];
            let nLines = [];
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, wGlob, hGlob);
            ctx.fillStyle = 'black';
            ctx.font = "48pt 'Times New Roman'";
            function blockSize(str) {
                return ctx.measureText(str);
            }
            function drawNode(node, x, y) {
                metric = blockSize(node.text);
                w = metric.width;
				h = metric.emHeightAscent + metric.emHeightDescent;
                node.h = h + 40;
                node.w = w + 40;
                ctx.fillText(node.text, x - w / 2, y + h / 2);
                if(node.type == 'process') {
                    ctx.beginPath();
                    ctx.moveTo(x - w / 2 - 20, y - h / 2 - 20);
                    ctx.lineTo(x + w / 2 + 20, y - h / 2 - 20);
                    ctx.lineTo(x + w / 2 + 20, y + h / 2 + 20);
                    ctx.lineTo(x - w / 2 - 20, y + h / 2 + 20);
                    ctx.closePath();
                    ctx.stroke();
                    node.then = {dir : 'down', x : Math.trunc(x), y : Math.trunc(y + h / 2 + 20)};
                    node.par = {dir : 'up', x : Math.trunc(x), y : Math.trunc(y - h / 2 - 20)};
                }
                if(node.type == 'data') {
                    node.w += 20;
                    ctx.beginPath();
                    ctx.moveTo(x - w / 2 - 10, y - h / 2 - 20);
                    ctx.lineTo(x + w / 2 + 30, y - h / 2 - 20);
                    ctx.lineTo(x + w / 2 + 10, y + h / 2 + 20);
                    ctx.lineTo(x - w / 2 - 30, y + h / 2 + 20);
                    ctx.closePath();
                    ctx.stroke();
                    node.then = {dir : 'down', x : Math.trunc(x), y : Math.trunc(y + h / 2 + 20)};
                    node.par = {dir : 'up', x : Math.trunc(x), y : Math.trunc(y - h / 2 - 20)};
                }
                if(node.type == 'incremental') {
                    node.w += 40;
                    ctx.beginPath();
                    ctx.moveTo(x - w / 2 - 20, y - h / 2 - 20);
                    ctx.lineTo(x + w / 2 + 20, y - h / 2 - 20);
                    ctx.lineTo(x + w / 2 + 40, y);
                    ctx.lineTo(x + w / 2 + 20, y + h / 2 + 20);
                    ctx.lineTo(x - w / 2 - 20, y + h / 2 + 20);
                    ctx.lineTo(x - w / 2 - 40, y);
                    ctx.closePath();
                    ctx.stroke();
                    ctx.fillText('выход', x + w / 2 + 40, y - 50);
                    ctx.fillText('возврат', x - w / 2 - 200, y - 50);
                    node.then = {dir : 'down', x : Math.trunc(x), y : Math.trunc(y + h / 2 + 20)};
                    node.else = {dir : 'right', x : Math.trunc(x + w / 2 + 40), y : Math.trunc(y)}
                    node.par = {dir : 'up', x : Math.trunc(x), y : Math.trunc(y - h / 2 - 20)};
                    node.loop = {dir : 'left', x : Math.trunc(x - w / 2 - 40), y : Math.trunc(y)};
                }
                if(node.type == 'decision') {
                    node.h += 160;
                    node.w += 160;
                    ctx.beginPath();
                    ctx.moveTo(x - w / 2 - 100, y);
                    ctx.lineTo(x, y - h / 2 - 100);
                    ctx.lineTo(x + w / 2 + 100, y);
                    ctx.lineTo(x, y + h / 2 + 100);
                    ctx.closePath();
                    ctx.stroke();
                    ctx.fillText('да', x + w / 2 + 100, y - 50);
                    ctx.fillText('нет', x - w / 2 - 150, y - 50);
                    node.then = {dir : 'right', x : Math.trunc(x + w / 2 + 100), y : Math.trunc(y)};
                    node.else = {dir : 'left', x : Math.trunc(x - w / 2 - 100), y : Math.trunc(y)};
                    node.par = {dir : 'up', x : Math.trunc(x), y : Math.trunc(y - h / 2 - 100)};
                }
                if(node.type == 'terminator') {
                    ctx.beginPath();
                    ctx.moveTo(x - w / 2, y - h / 2 - 20);
                    ctx.arc(x - w / 2, y, h / 2 + 20, Math.PI * 2.5, Math.PI * 3.5);
                    ctx.moveTo(x - w / 2, y - h / 2 - 20);
                    ctx.lineTo(x + w / 2, y - h / 2 - 20);
                    ctx.arc(x + w / 2, y, h / 2 + 20, Math.PI * 3.5, Math.PI * 4.5);
                    ctx.lineTo(x - w / 2, y + h / 2 + 20);
                    ctx.stroke();
                    node.then = {dir : 'down', x : Math.trunc(x), y : Math.trunc(y + h / 2 + 20)};
                    node.par = {dir : 'up', x : Math.trunc(x), y : Math.trunc(y - h / 2 - 20)};
                }
            }

            function intersects(x1, y1, x2, y2, x3, y3, x4, y4) {
                if(x1 == x2)
                    orientation1 = 'vertical';
                else
                    orientation1 = 'horizontal';
                if(x3 == x4)
                    orientation2 = 'vertical';
                else
                    orientation2 = 'horizontal';
                if(orientation1 == orientation2) {
                    return false;
                }
                if(x1 > x2)
                    [x1, x2] = [x2, x1];
                if(y1 > y2)
                    [y1, y2] = [y2, y1];
                if(x3 > x4)
                    [x3, x4] = [x4, x3];
                if(y3 > y4)
                    [y3, y4] = [y4, y3];
                if(orientation1 == 'vertical') {
                    return (y1 <= y3 && y2 >= y3 && x3 <= x1 && x4 >= x1);
                }
                else {
                    return (y3 <= y1 && y4 >= y1 && x1 <= x3 && x1 >= x3);
                }
            }

            function mergeLines() {
                nLines.forEach(line => {
                    lines.push(line);
                });
                nLines = [];
            }

            function drawLine(destination, x, y) {
                x = Math.round(x);
                y = Math.round(y);
                from = ctx.path[ctx.path.length - 1][1];
                from.x = Math.round(from.x);
                from.y = Math.round(from.y);
                if(from.x == x && from.y == y)
                    return false;
                let i = 0;
                ctx.lineTo(x, y);
                //nLines.push({x1 : from.x, y1 : from.y, x2 : x, y2 : y, destination : destination});
                return false;
            }

            function drawLink(from, to, ifrom, ito, destination) {
                lpref = 0;
                toOffs = 0;
                fromOffs = 0;
                terminate = false;
                ctx.beginPath();
                ctx.moveTo(from.x, from.y);
                if(from.dir == 'left')
                    lpref++;
                if(from.dir == 'right')
                    lpref--;
                if(from.dir == 'down')
                    fromOffs = 20;
                if(to.dir == 'left')
                    lpref++;
                if(to.dir == 'right')
                    lpref--;
                if(to.dir == 'up')
                    toOffs = 20;
                terminate = drawLine(destination, from.x, from.y + fromOffs);
                if(terminate) {return};
                if(lpref > 0) {
                    terminate = drawLine(destination, lbound, from.y + fromOffs);
                    if(terminate) {lbound -= 40; return};
                    terminate = drawLine(destination, lbound, to.y - toOffs);
                    if(terminate) {lbound -= 40; return};
                    lbound -= 40;
                }
                else if(lpref < 0) {
                    terminate = drawLine(destination, rbound, from.y + fromOffs);
                    if(terminate) {rbound += 40; return};
                    terminate = drawLine(destination, rbound, to.y - toOffs);
                    if(terminate) {rbound += 40; return};
                    rbound += 40;
                } else if(from.dir != 'down' || to.dir != 'up' || ito != ifrom + 1) {
                    let opt;
                    pinc = 0;
                    if(ifrom < ito)
                        inc = 1;
                    else {
                        inc = -1;
                        pinc = -1;
                    }
                    for(i = ifrom + pinc; i != ito + inc; i += inc)
                        if(!opt || nodes[i].inBetween < nodes[opt].inBetween)
                            opt = i;
                    if(from.dir == 'left') {
                        terminate = drawLine(destination, lbound, from.y + fromOffs);
                        if(terminate) {lbound -= 40; rbound += 40; return};
                        terminate = drawLine(destination, lbound, nodes[opt].y + nodes[opt].h / 2 + nodes[opt].inBetween);
                        if(terminate) {lbound -= 40; rbound += 40; return};
                        terminate = drawLine(destination, rbound, nodes[opt].y + nodes[opt].h / 2 + nodes[opt].inBetween);
                        if(terminate) {lbound -= 40; rbound += 40; return};
                        terminate = drawLine(destination, rbound, to.y - toOffs);
                        if(terminate) {lbound -= 40; rbound += 40; return};
                    }
                    else {
                        terminate = drawLine(destination, rbound, from.y + fromOffs);
                        if(terminate) {lbound -= 40; rbound += 40; return};
                        terminate = drawLine(destination, rbound, nodes[opt].y + nodes[opt].h / 2 + nodes[opt].inBetween);
                        if(terminate) {lbound -= 40; rbound += 40; return};
                        terminate = drawLine(destination, lbound, nodes[opt].y + nodes[opt].h / 2 + nodes[opt].inBetween);
                        if(terminate) {lbound -= 40; rbound += 40; return};
                        terminate = drawLine(destination, lbound, to.y - toOffs);
                        if(terminate) {lbound -= 40; rbound += 40; return};
                    }
                    rbound += 40;
                    lbound -= 40;
                }
                terminate = drawLine(destination, to.x, to.y - toOffs);
                if(terminate) {return};
                terminate = drawLine(destination, to.x, to.y);
                if(terminate) {return};
                if(to.dir == 'left') {
                    ctx.lineTo(to.x - 15, to.y - 5);
                    ctx.moveTo(to.x, to.y);
                    ctx.lineTo(to.x - 15, to.y + 5);
                }
                else {
                    ctx.lineTo(to.x - 5, to.y - 15);
                    ctx.moveTo(to.x, to.y);
                    ctx.lineTo(to.x + 5, to.y - 15);
                }
                ctx.stroke();
                mergeLines();
            }
            nodes.forEach(node => {
                drawNode(node, x, y);
                node.y = y;
				y += node.h + 150;
				lbound = Math.min(lbound, x - node.w / 2 - 20);
				rbound = Math.max(rbound, x + node.w / 2 + 20);
				node.inBetween = 30;
            });
            links = links.sort(function cmp(a, b) {
                if(Math.abs(a.to - a.from) < Math.abs(b.to - b.from))
                    return -1;
                else
                    return 1;
            });
            for(let i = 0; i < links.length; i++) {
				link = links[i];
                if(link.type == 'then')
                    from = nodes[link.from].then;
                else if(link.type == 'else')
                    from = nodes[link.from].else;
                if(nodes[link.to].type == 'incremental' && link.out == 'loop')
                    to = nodes[link.to].loop;
                else
					to = nodes[link.to].par;
				drawLink(from, to, link.from, link.to, to);
            };
            pureimage.encodePNGToStream(img, fs.createWriteStream(file));
            return;
        });
    }
}