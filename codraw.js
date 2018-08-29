let ROOM = 'general';
let PASSWORD = '';

const stream = new Stream('client/app.php', 'client/rec.php', 'client/shop.php',
                          () => {
                            stream.add_tag(ROOM, PASSWORD);
                            setTimeout(() => stream.ask_tag(ROOM, PASSWORD), 1000);
                          });

let canvases = {};

stream.OnError = err => {
    console.log("Error: ");
    cosole.log(err);
};

$(window).on('load resizeend', function () {
    let c = document.getElementById("drawn");
    let ctx = c.getContext("2d");

    stream.OnMessage = (e, from, data) => {
        console.log("Data Received.");
        console.log(`data: ${from} ${data}`);

        if (from == stream.id) {
            return;
        }

        if (!(from in canvases)) {
            canvases = $('#drawn').before(`<canvas id="${from}" width="${$('#view').width()}" height="${$('#view').height()}"></canvas>`);
            canvases[from] = $('#'+from);
        }

        let c = document.getElementById(from);
        let ctx = c.getContext("2d");
    
        let list = data.split(' ');
        ctx.beginPath();
        ctx.moveTo(Number(list[0]), Number(list[1]));
        for (let i = 1, len = list.length; i < len; i += 2) {
            ctx.lineTo(Number(list[2*i]), Number(list[2*i+1]));
        }
        // /ctx.closePath();
        ctx.stroke();
    };

    const imgdata = ctx.getImageData(0, 0, c.width, c.height);
    $('#drawn').attr('width', $('#view').width());
    $('#drawn').attr('height', $('#view').height());
    ctx.putImageData(imgdata, 0, 0);

    for (let cvs in canvases) { if (!cvs) continue;
        let c = document.getElementById(cvs);
        if (!c) continue;
        let ctx = c.getContext('2d');
        const imgdata = ctx.getImageData(0, 0, c.width, c.height);
        canvases[cvs].attr('width', $('#view').width());
        canvases[cvs].attr('height', $('#view').height());
        ctx.putImageData(imgdata, 0, 0);
    }


    let isDrawing;
    let divPos = {};
    let path = [];

    c.onmousedown = function(e) {
        isDrawing = true;

        divPos = {
            left: e.offsetX,
            top: e.offsetY - e.offsetY*(50/900)
        };
        path.push([divPos.left, divPos.top]);
        //stream.send(`d ${divPos.left} ${divPos.top}`, ROOM);
        ctx.moveTo(divPos.left, divPos.top);
    };
    c.onmousemove = function(e) {
        if (isDrawing) {
            divPos = {
                left: e.offsetX,
                top: e.offsetY - e.offsetY*(50/900)
            };
            path.push([divPos.left, divPos.top]);
        //stream.send(`m ${divPos.left} ${divPos.top}`, ROOM);
            ctx.lineTo(divPos.left, divPos.top);
            ctx.stroke();
        }
    };
    c.onmouseup = function() {
        isDrawing = false;

        let payload = "";
        for (let p of path) {
            payload += `${p[0]} ${p[1]} `
        }
        path = [];

        stream.send(payload, ROOM);
    };
});
