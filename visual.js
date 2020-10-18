const pureimage = require('pureimage');
const fs = require('fs');

module.exports = {
    visualize(nodes, links, file) {
        img = pureimage.make(2000, 4000);
        ctx = img.getContext('2d');
        var fnt = pureimage.registerFont('fonts/7454.ttf','Times New Roman');
        fnt.load(()=> {
            ctx.lineWidth = 5;
            x = 1000;
            y = 200;
            lbound = x;
            rbound = x;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, 2000, 4000);
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
                    node.then = {dir : 'down', x : x, y : y + h / 2 + 20};
                    node.par = {dir : 'up', x : x, y : y - h / 2 - 20};
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
                    node.then = {dir : 'down', x : x, y : y + h / 2 + 20};
                    node.par = {dir : 'up', x : x, y : y - h / 2 - 20};
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
                    node.then = {dir : 'down', x : x, y : y + h / 2 + 20};
                    node.else = {dir : 'right', x : x + w / 2 + 40, y : y}
                    node.par = {dir : 'up', x : x, y : y - h / 2 - 20};
                    node.loop = {dir : 'left', x : x - w / 2 - 40, y : y};
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
                    node.then = {dir : 'right', x : x + w / 2 + 100, y : y};
                    node.else = {dir : 'left', x : x - w / 2 - 100, y : y};
                    node.par = {dir : 'up', x : x, y : y - h / 2 - 100};
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
                    node.then = {dir : 'down', x : x, y : y + h / 2 + 20};
                    node.par = {dir : 'up', x : x, y : y - h / 2 - 20};
                }
            }

            function drawLink(from, to, ifrom, ito, type) {
                lpref = 0;
                toOffs = 0;
                fromOffs = 0;
                if(ifrom < ito)
                    ctx.strokeStyle = 'blue';
                else 
                    ctx.strokeStyle = 'red';
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
                
                ctx.lineTo(from.x, from.y + fromOffs);
                if(lpref > 0) {
                    ctx.lineTo(lbound, from.y + fromOffs);
                    ctx.lineTo(lbound, to.y - toOffs);
                    lbound -= 20;
                }
                else if(lpref < 0) {
                    ctx.lineTo(rbound, from.y + fromOffs);
                    ctx.lineTo(rbound, to.y - toOffs);
                    rbound += 20;
                } else if(from.dir != 'down' || to.dir != 'up' && ito != ifrom + 1) {
                    opt = ifrom;
                    if(ifrom < ito)
                        inc = 1;
                    else
                        inc = -1;
                    for(i = ifrom; i != ito + inc; i += inc)
                        if(nodes[i].inBetween < nodes[opt].inBetween)
                            opt = i;
                    if(from.dir == 'left') {
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
                    rbound += 20;
                    lbound -= 20;
                }
                ctx.lineTo(to.x, to.y - toOffs);
                ctx.lineTo(to.x, to.y);
                ctx.stroke();
            }
            nodes.forEach(node => {
                drawNode(node, x, y);
                node.y = y;
                y += node.h + 150;
                lbound = Math.min(lbound, x - node.w / 2 - 20);
                rbound = Math.max(rbound, x + node.w / 2 + 20);
                node.inBetween = 30;
            });
            links.forEach(link => {
                if(link.type == 'then')
                    from = nodes[link.from].then;
                else
                    from = nodes[link.from].else;

                if(nodes[link.to].type == 'incremental' && nodes[link.to].fpar)
                    to = nodes[link.to].loop;
                else
                    to = nodes[link.to].par;
                if(nodes[link.to].type == 'incremental')
                    nodes[link.to].fpar = true;
                drawLink(from, to, link.from, link.to, link.type);

            });
            pureimage.encodePNGToStream(img, fs.createWriteStream(file));
            return;
        });
    }
}