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
				ctx.moveTo(divPos.left, divPos.top);
		};
		c.onmousemove = function(e) {
				if (isDrawing) {
						divPos = {
								left: e.pageX - offset.left,
								top: e.pageY - offset.top
						};
						ctx.lineTo(divPos.left, divPos.top);
						ctx.stroke();
				}
		};
		c.onmouseup = function() {
				isDrawing = false;
		};
});
