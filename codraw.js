function gep(key) {
    var str = location.search.split("?");
    if (str.length < 2) {
        return "";
    }

    var params = str[1].split("&");
    for (var i = 0; i < params.length; i++) {
        var keyVal = params[i].split("=");
        if (keyVal[0] == key && keyVal.length == 2) {
        return decodeURIComponent(keyVal[1]);
        }
    }
    return "";
}

let ROOM = gep('room');
let PASSWORD = gep('pass');

const stream = new Stream('client/app.php', 'client/rec.php', 'client/shop.php',
                          () => {
                            stream.add_tag(ROOM, PASSWORD);
                            setTimeout(() => {
                                stream.ask_tag(ROOM, PASSWORD);
                                if ($("#status").text() == "") {
                                    $("#status").text(`CONNECTED @ ${ROOM}`);
                                    $("#status").css('background-color', 'lightgreen');
                                }    
                            }, 1000);
                          });

let canvases = {};

stream.OnError = err => {
    $("#status").text(`ERROR @ ${ROOM}`);
    $("#status").css('background-color', 'red');

};

$(window).on('load resizeend', function () {
    let c = document.getElementById("drawn");
    let ctx = c.getContext("2d");

    stream.OnMessage = (e, from, data) => {
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

    $(c).on('mousedown touchstart', (e) => {
        isDrawing = true;

        if (!e.pageX) {
            e.offsetX = event.touches[0].pageX;
            e.offsetY = event.touches[0].pageY-50;
        }

        divPos = {
            left: e.offsetX,
            top: e.offsetY - e.offsetY*(50/900)
        };
        path.push([divPos.left, divPos.top]);
        //stream.send(`d ${divPos.left} ${divPos.top}`, ROOM);
        ctx.moveTo(divPos.left, divPos.top);
    });
    $(c).on('mousemove touchmove', (e) => {
        if (isDrawing) {

            if (!e.pageX) {
                e.offsetX = event.touches[0].pageX;
                e.offsetY = event.touches[0].pageY-50;
            }

            divPos = {
                left: e.offsetX,
                top: e.offsetY - e.offsetY*(50/900)
            };
            path.push([divPos.left, divPos.top]);
        //stream.send(`m ${divPos.left} ${divPos.top}`, ROOM);
            ctx.lineTo(divPos.left, divPos.top);
            ctx.stroke();
        }
    });
    $(c).on('mouseup touchend', () => {
        isDrawing = false;

        let payload = "";
        for (let p of path) {
            payload += `${p[0]} ${p[1]} `
        }
        path = [];

        stream.send(payload, ROOM);
    });
});
