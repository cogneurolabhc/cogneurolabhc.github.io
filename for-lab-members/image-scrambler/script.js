$(document).ready(function() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var tempCanvas = document.createElement('canvas');
    var tempCtx = tempCanvas.getContext('2d');

    $('#image').change(function() {
        var img = new Image();
        img.onload = function() {
            var aspectRatio = img.width / img.height;
            var displayWidth, displayHeight;
            if (aspectRatio > 1) {
                displayWidth = 500;
                displayHeight = Math.round(500 / aspectRatio);
            } else {
                displayHeight = 500;
                displayWidth = Math.round(500 * aspectRatio);
            }
            canvas.width = displayWidth;
            canvas.height = displayHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, displayWidth, displayHeight);
            $('#scramblerpreview').html('<img src="' + canvas.toDataURL() + '">');
        };
        img.src = URL.createObjectURL($('#image')[0].files[0]);
    });

    $('#scramble-btn').click(function() {
        var img = new Image();
        img.onload = function() {
            var width = img.width;
            var height = img.height;
            var rows = parseInt($('#rows').val());
            var cols = parseInt($('#cols').val());
            var rowHeight = Math.ceil(height / rows);
            var colWidth = Math.ceil(width / cols);
            width = colWidth * cols;
            height = rowHeight * rows;
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            tempCanvas.width = width;
            tempCanvas.height = height;

            var tiles = [];
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {
                    var tile = ctx.getImageData(j * colWidth, i * rowHeight, colWidth, rowHeight);
                    tiles.push(tile);
                }
            }
            tiles.sort(() => Math.random() - 0.5);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {
                    ctx.putImageData(tiles[i * cols + j], j * colWidth, i * rowHeight);
                }
            }

            tempCtx.drawImage(canvas, 0, 0);
            canvas.width = img.width;
            canvas.height = img.height;
            ctx = canvas.getContext('2d');
            ctx.drawImage(tempCanvas, 0, 0, width, height, 0, 0, img.width, img.height);
            tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = 500;
            tempCanvas.height = 500;
            tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 500, 500);

            $('#scramblerpreview').html('<img src="' + tempCanvas.toDataURL() + '">');
            $('#download-btn').prop('disabled', false);
        };
        img.src = URL.createObjectURL($('#image')[0].files[0]);
    });

    $('#download-btn').click(function() {
        var link = document.createElement('a');
        link.download = 'scrambled_image.png';
        link.href = canvas.toDataURL();
        link.click();
    });
});
