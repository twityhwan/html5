function noise() {
    //Returns a value between 0.5 and 1
    return Math.random() * 0.5 + 0.5;
};

function colorDistance(scale, dest, src) {
    // returns a red, blue or green value for the 'sepia' pixel
    // which is a weighted average of the original value and the calculated value
    return (scale * dest + (1 - scale) * src);
};

var processSepia = function (pixel) {
    // takes a given pixel and updates its red, blue and green values
    // using a randomly weighted average of the initial and calculated red/blue/green values
    pixel.r = colorDistance(noise(), (pixel.r * 0.393) + (pixel.g * 0.769) + (pixel.b * 0.189), pixel.r);
    pixel.g = colorDistance(noise(), (pixel.r * 0.349) + (pixel.g * 0.686) + (pixel.b * 0.168), pixel.g);
    pixel.b = colorDistance(noise(), (pixel.r * 0.272) + (pixel.g * 0.534) + (pixel.b * 0.131), pixel.b);
};

var processSepia = function (binaryData, l) {
    for (var i = 0; i < l; i += 4) {
        var r = binaryData[i];
        var g = binaryData[i + 1];
        var b = binaryData[i + 2];

        binaryData[i] = colorDistance(noise(), (r * 0.393) + (g * 0.769) + (b * 0.189), r);
        binaryData[i + 1] = colorDistance(noise(), (r * 0.349) + (g * 0.686) + (b * 0.168), g);
        binaryData[i + 2] = colorDistance(noise(), (r * 0.272) + (g * 0.534) + (b * 0.131), b);
    }
};

var source = document.getElementById("source");

/*
   source.onload = function () {
   var canvas = document.getElementById("target");
   canvas.width = source.clientWidth;
   canvas.height = source.clientHeight;

// ... tempContext is the 2D context of canvas
tempContext.drawImage(source, 0, 0, canvas.width, canvas.height);

var canvasData = tempContext.getImageData(0, 0, canvas.width, canvas.height);
var binaryData = canvasData.data;
}
 */

source.onload = function () {
    console.log("source.onload()");
    var start = new Date();

    var canvas = document.getElementById("target");
    canvas.width = source.clientWidth;
    canvas.height = source.clientHeight;
    console.log("canvas w: "+canvas.width+", h: "+canvas.height);

    if (!canvas.getContext) {
        log.innerText = "Canvas not supported. Please install a HTML5 compatible browser.";
        return;
    }

    var tempContext = canvas.getContext("2d");
    // len is the number of items in the binaryData array
    // it is 4 times the number of pixels in the canvas object
    var len = canvas.width * canvas.height * 4;

    tempContext.drawImage(source, 0, 0, canvas.width, canvas.height);

    var canvasData = tempContext.getImageData(0, 0, canvas.width, canvas.height);
    var binaryData = canvasData.data;

    // processSepia is a variation of the previous version. See below
    processSepia(binaryData, len);

    tempContext.putImageData(canvasData, 0, 0);
    var diff = new Date() - start;
    log.innerText = "Process done in " + diff + " ms (no web workers)";

}

