const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');

hGlob = 200;

module.exports = {
    visualize(nodes, links, file) {
        ltxt = '';
        nodes.forEach(node => {
            if (node.type == 'decision')
                hGlob += 382;
            else
                hGlob += 222;
            if (ltxt.length < node.text.length)
                ltxt = node.text;
            hGlob += 150;
        });
        hGlob += 300;
        wGlob = ltxt.length * 20 + 1000 + 0.1 * hGlob;
        const canvas = createCanvas(wGlob, hGlob);
        ctx = canvas.getContext('2d');
        registerFont('fonts/7454.ttf', { family: 'Times New Roman' });
        ctx.lineWidth = 5;
        x = wGlob / 2;
        y = 200;
        variator = false;
        albound = [];
        arbound = [];
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
            if (node.type == 'process') {
                ctx.beginPath();
                ctx.moveTo(x - w / 2 - 20, y - h / 2 - 20);
                ctx.lineTo(x + w / 2 + 20, y - h / 2 - 20);
                ctx.lineTo(x + w / 2 + 20, y + h / 2 + 20);
                ctx.lineTo(x - w / 2 - 20, y + h / 2 + 20);
                ctx.closePath();
                ctx.stroke();
                node.then = { dir: 'down', x: Math.trunc(x), y: Math.trunc(y + h / 2 + 20) };
                node.par = { dir: 'up', x: Math.trunc(x), y: Math.trunc(y - h / 2 - 20) };
            }
            if (node.type == 'subprogram') {
                ctx.beginPath();
                ctx.moveTo(x - w / 2 - 20, y - h / 2 - 20);
                ctx.lineTo(x + w / 2 + 20, y - h / 2 - 20);
                ctx.lineTo(x + w / 2 + 20, y + h / 2 + 20);
                ctx.lineTo(x - w / 2 - 20, y + h / 2 + 20);
                ctx.closePath();
                ctx.moveTo(x - w / 2 - 30, y - h / 2 - 20);
                ctx.lineTo(x + w / 2 + 30, y - h / 2 - 20);
                ctx.lineTo(x + w / 2 + 30, y + h / 2 + 20);
                ctx.lineTo(x - w / 2 - 30, y + h / 2 + 20);
                ctx.lineTo(x - w / 2 - 30, y - h / 2 - 20);
                ctx.stroke();
                node.then = { dir: 'down', x: Math.trunc(x), y: Math.trunc(y + h / 2 + 20) };
                node.par = { dir: 'up', x: Math.trunc(x), y: Math.trunc(y - h / 2 - 20) };
                node.w += 20;
            }
            if (node.type == 'data') {
                node.w += 20;
                ctx.beginPath();
                ctx.moveTo(x - w / 2 - 10, y - h / 2 - 20);
                ctx.lineTo(x + w / 2 + 30, y - h / 2 - 20);
                ctx.lineTo(x + w / 2 + 10, y + h / 2 + 20);
                ctx.lineTo(x - w / 2 - 30, y + h / 2 + 20);
                ctx.closePath();
                ctx.stroke();
                node.then = { dir: 'down', x: Math.trunc(x), y: Math.trunc(y + h / 2 + 20) };
                node.par = { dir: 'up', x: Math.trunc(x), y: Math.trunc(y - h / 2 - 20) };
            }
            if (node.type == 'incremental') {
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
                node.then = { dir: 'down', x: Math.trunc(x), y: Math.trunc(y + h / 2 + 20) };
                node.else = { dir: 'right', x: Math.trunc(x + w / 2 + 40), y: Math.trunc(y) }
                node.par = { dir: 'up', x: Math.trunc(x), y: Math.trunc(y - h / 2 - 20) };
                node.loop = { dir: 'left', x: Math.trunc(x - w / 2 - 40), y: Math.trunc(y) };
            }
            if (node.type == 'decision') {
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
                node.then = { dir: 'right', x: Math.trunc(x + w / 2 + 100), y: Math.trunc(y) };
                node.else = { dir: 'left', x: Math.trunc(x - w / 2 - 100), y: Math.trunc(y) };
                node.par = { dir: 'up', x: Math.trunc(x), y: Math.trunc(y - h / 2 - 100) };
            }
            if (node.type == 'terminator') {
                ctx.beginPath();
                ctx.moveTo(x - w / 2, y - h / 2 - 20);
                ctx.moveTo(x - w / 2, y - h / 2 - 20);
                ctx.lineTo(x + w / 2, y - h / 2 - 20);
                ctx.arc(x + w / 2, y, h / 2 + 20, Math.PI * 1.5, Math.PI * 0.5);
                ctx.lineTo(x - w / 2, y + h / 2 + 20);
                ctx.arc(x - w / 2, y, h / 2 + 20, Math.PI * 0.5, Math.PI * 1.5);
                ctx.stroke();
                node.then = { dir: 'down', x: Math.trunc(x), y: Math.trunc(y + h / 2 + 20) };
                node.par = { dir: 'up', x: Math.trunc(x), y: Math.trunc(y - h / 2 - 20) };
            }
        }

        function drawLink(from, to, ifrom, ito) {
            lbound = albound[nodes[ifrom].scope];
            rbound = arbound[nodes[ifrom].scope];
            lpref = 0;
            fromOffs = 0;
            false;
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            if (from.dir == 'left')
                lpref++;
            if (from.dir == 'right')
                lpref--;
            if (from.dir == 'down')
                fromOffs = 20;
            if (to.dir == 'left')
                lpref++;
            if (to.dir == 'right')
                lpref--;
            if (to.dir == 'up' && !to.offs)
                to.offs = 20;
            toOffs = to.offs;
            if(!toOffs)
                toOffs = 0;
            ctx.lineTo(from.x, from.y + fromOffs);
            if (lpref > 0) {
                ctx.lineTo(lbound, from.y + fromOffs);
                ctx.lineTo(lbound, to.y - toOffs);
                lbound -= 40;
            }
            else if (lpref < 0) {
                ctx.lineTo(rbound, from.y + fromOffs);
                ctx.lineTo(rbound, to.y - toOffs);
                rbound += 40;
            } else if (from.dir == 'down' && to.dir == 'up' && ito != ifrom + 1) {
                if (variator) {
                    ctx.lineTo(lbound, from.y + fromOffs);
                    ctx.lineTo(lbound, to.y - toOffs);
                    lbound -= 40;
                }
                else {
                    ctx.lineTo(rbound, from.y + fromOffs);
                    ctx.lineTo(rbound, to.y - toOffs);
                    rbound += 40;
                }
            }
            else if (from.dir != 'down' || to.dir != 'up' || ito != ifrom + 1) {
                let opt;
                pinc = 0;
                if (ifrom < ito)
                    inc = 1;
                else {
                    inc = -1;
                    pinc = -1;
                }
                for (i = ifrom + pinc; i != ito + inc; i += inc)
                    if (!opt || nodes[i].inBetween < nodes[opt].inBetween)
                        opt = i;
                if (from.dir == 'left') {
                    ctx.lineTo(lbound, from.y + fromOffs);
                    ctx.lineTo(lbound, nodes[opt].y + nodes[opt].h / 2 + nodes[opt].inBetween);
                    ctx.lineTo(rbound, nodes[opt].y + nodes[opt].h / 2 + nodes[opt].inBetween);
                    ctx.lineTo(rbound, to.y - toOffs);
                }
                else {
                    ctx.lineTo(rbound, from.y + fromOffs);
                    ctx.lineTo(rbound, nodes[opt].y + nodes[opt].h / 2 + nodes[opt].inBetween);
                    ctx.lineTo(lbound, nodes[opt].y + nodes[opt].h / 2 + nodes[opt].inBetween);
                    ctx.lineTo(lbound, to.y - toOffs);
                }
                rbound += 40;
                lbound -= 40;
            }
            ctx.lineTo(to.x, to.y - toOffs);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
            albound[nodes[ifrom].scope] = lbound;
            arbound[nodes[ifrom].scope] = rbound;
            to.offs += 20;
        }
        nodes.forEach(node => {
            drawNode(node, x, y);
            if (node.type == 'terminator' && node.text != 'Return' && node.text != 'Конец') {
                albound.push(x - node.w / 2 + 40);
                arbound.push(x + node.w / 2 + 40);
            }
            node.scope = albound.length - 1;
            node.y = y;
            y += node.h + 250;
            albound[albound.length - 1] = Math.min(albound[albound.length - 1], x - node.w / 2 - 20);
            arbound[arbound.length - 1] = Math.max(arbound[arbound.length - 1], x + node.w / 2 + 20);
            node.inBetween = 30;
        });
        links = links.sort(function cmp(a, b) {
            if (Math.abs(a.to - a.from) < Math.abs(b.to - b.from))
                return -1;
            else
                return 1;
        });
        for (let i = 0; i < links.length; i++) {
            variator = !variator;
            link = links[i];
            if (link.type == 'then')
                from = nodes[link.from].then;
            else if (link.type == 'else')
                from = nodes[link.from].else;
            if (nodes[link.to].type == 'incremental' && link.out == 'loop')
                to = nodes[link.to].loop;
            else
                to = nodes[link.to].par;
            drawLink(from, to, link.from, link.to);
        };
        canvas.createPNGStream().pipe(fs.createWriteStream(file));
        return;
    }
}