let ROOM = 'general';
let PASSWORD = '';

const stream = new Stream('client/app.php', 'client/rec.php', 'client/shop.php');
stream.ask_tag(ROOM, PASSWORD);

stream.OnMessage = (e, data) => {
    console.log("Data Received.");
    console.log(`data: ${data}`);
};

stream.OnError = err => {
    console.log("Error: ");
    cosole.log(err);
};

$(window).on('load resizeend', function () {
    let c = document.getElementById("drawn");
    let ctx = c.getContext("2d");
    const imgdata = ctx.getImageData(0, 0, c.width, c.height);
    
    $('#drawn').attr('width', $('#view').width());
    $('#drawn').attr('height', $('#view').height());

    ctx.putImageData(imgdata, 0, 0);

    let isDrawing;
    let divPos = {};
    const offset = $('#drawn').offset();

    c.onmousedown = function(e) {
        isDrawing = true;
        divPos = {
            left: e.pageX - offset.left,
            top: e.pageY - offset.top
        };
        console.log(`d ${divPos.left} ${divPos.top}`);
//        stream.send("d ${divPos.left} ${divPos.top}", ROOM);
        ctx.moveTo(divPos.left, divPos.top);
    };
    c.onmousemove = function(e) {
        if (isDrawing) {
            divPos = {
                left: e.pageX - offset.left,
                top: e.pageY - offset.top
            };
//            stream.send("m ${divPos.left} ${divPos.top}", ROOM);
            console.log(`m ${divPos.left} ${divPos.top}`);
            ctx.lineTo(divPos.left, divPos.top);
            ctx.stroke();
        }
    };
    c.onmouseup = function() {
        isDrawing = false;
    };
});
