const pureimage = require('pureimage');
const fs = require('fs');


module.exports = {
    visualize(nodes) {
        img = pureimage.make(1000, 1000);
        ctx = img.getContext('2d');
        var fnt = pureimage.registerFont('fonts/7454.ttf','Times New Roman');
        fnt.load(()=> {
            ctx.fillStyle = 'black';
            ctx.font = "48pt 'Times New Roman'";
            function blockSize(str) {
                return ctx.measureText(str);
            }
            function draw(node, x, y) {
                ctx.lineWidth = 2;
                if(node.type == 'process') {
                    metric = blockSize(node.text);
                    w = metric.width;
                    h = metric.emHeightAscent;
                    ctx.fillText(x - w / 2, y - h / 2);
                    ctx.beginPath();
                    ctx.moveTo(x - w / 2 - 20, y - h / 2 - 20);
                    ctx.lineTo(x + w / 2 + 20, y - h / 2 - 20);
                    ctx.lineTo(x + w / 2 + 20, y + h / 2 + 20);
                    ctx.lineTo(x - w / 2 - 20, y + h / 2 + 20);
                    ctx.closePath();
                    ctx.stroke();
                }
            }
            draw({type : 'process', text : 'abcd'});
            pureimage.encodePNGToStream(img, fs.createWriteStream('out.png'))
        })
    }
}