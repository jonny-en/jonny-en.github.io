// assign global variables to HTML elements
var video;
var videoCanvas;
var videoContext;

var layer2Canvas;
var layer2Context;

var blendCanvas;
var blendContext;

var messageArea;
var camvideo;

var buttons;

var lastImageData;



var camvideo;
var video_ready = false;



function avSceneDiscover0() {
    document.body.appendChild(renderer.domElement);
    renderer.domElement.focus();

    if (avLocalMediaStream != null) {
        avLocalMediaStream.getTracks()[0].stop();
    }

    avSceneDiscoverNr = 0;
    renderer.setViewport(0, 0, WIDTH, HEIGHT);
    renderer.setScissor(0, 0, WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();

    $('#content').load('content/av/avSceneDiscover0.html', function() {
        camvideo = $('#monitor')[0];
        video = $('#monitor')[0];
        videoCanvas = $('#videoCanvas')[0];
        videoContext = videoCanvas.getContext('2d');


        layer2Canvas = $('#layer2')[0];
        layer2Context = layer2Canvas.getContext('2d');

        blendCanvas = $('#blendCanvas')[0];
        blendContext = blendCanvas.getContext('2d');

        messageArea = $('messageArea')[0];

        buttons = [];

        var button1 = new Image();
        button1.src = "images/left.png";
        var buttonData1 = { name: "red", image: button1, x: 140 - 96 - 30, y: 10, w: 32, h: 32 };
        buttons.push(buttonData1);

        var button2 = new Image();
        button2.src = "images/up.png";
        var buttonData2 = { name: "green", image: button2, x: 240 - 64 - 20, y: 10, w: 32, h: 32 };
        buttons.push(buttonData2);

        var button3 = new Image();
        button3.src = "images/right.png";
        var buttonData3 = { name: "blue", image: button3, x: 310 - 32 - 10, y: 10, w: 32, h: 32 };
        buttons.push(buttonData3);

        initCam();
        video_ready = true;
    });

}

function initCam() {

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    window.URL = window.URL || window.webkitURL;

    if (!navigator.getUserMedia) {
        $('#messageError').innerHTML =
            'Sorry. <code>navigator.getUserMedia()</code> is not available.';
    }
    navigator.getUserMedia({
        video: true
    }, gotStream, noStream);

    videoContext.translate(320, 0);
    videoContext.scale(-1, 1);

    // background color if no video present
    videoContext.fillStyle = '#ffffff';
    videoContext.fillRect(0, 0, videoCanvas.width, videoCanvas.height);
}


function blend() {
    var width = WIDTH;
    var height = HEIGHT;
    // get current webcam image data
    var sourceData = videoContext.getImageData(0, 0, width, height);
    if (!lastImageData) lastImageData = videoContext.getImageData(0, 0, width, height);
    // create a ImageData instance to receive the blended result
    var blendedData = videoContext.createImageData(width, height);
    // blend the 2 images
    differenceAccuracy(blendedData.data, sourceData.data, lastImageData.data);
    // draw the result in a canvas
    blendContext.putImageData(blendedData, 0, 0);
    // store the current webcam image
    lastImageData = sourceData;
}

function differenceAccuracy(target, data1, data2) {
    if (data1.length != data2.length) return null;
    var i = 0;
    while (i < (data1.length * 0.25)) {
        var average1 = (data1[4 * i] + data1[4 * i + 1] + data1[4 * i + 2]) / 3;
        var average2 = (data2[4 * i] + data2[4 * i + 1] + data2[4 * i + 2]) / 3;
        var diff = compute_threshold(fastAbs(average1 - average2));
        target[4 * i] = diff;
        target[4 * i + 1] = diff;
        target[4 * i + 2] = diff;
        target[4 * i + 3] = 0xFF;
        ++i;
    }
}

function fastAbs(value) {
    return (value ^ (value >> 31)) - (value >> 31);
}

function compute_threshold(value) {
    return (value > 0x15) ? 0xFF : 0;
}

// check if white region from blend overlaps area of interest (e.g. triggers)
function checkAreas() {
    for (var b = 0; b < buttons.length; b++) {
        // get the pixels in a note area from the blended image
        var blendedData = blendContext.getImageData(buttons[b].x, buttons[b].y, buttons[b].w, buttons[b].h);

        // calculate the average lightness of the blended data
        var i = 0;
        var sum = 0;
        var countPixels = blendedData.data.length * 0.25;
        while (i < countPixels) {
            sum += (blendedData.data[i * 4] + blendedData.data[i * 4 + 1] + blendedData.data[i * 4 + 2]);
            ++i;
        }
        // calculate an average between of the color values of the note area [0-255]
        var average = Math.round(sum / (3 * countPixels));
        if (average > 50) // more than 20% movement detected
        {
            console.log("Button " + buttons[b].name + " triggered."); // do stuff
            if (buttons[b].name == "red") {
                avSceneLisa.rotation.y += 0.1;
                if (avSceneLisa.rotation.y >= 1.0001 * Math.PI) {
                    avSceneLisa.rotation.y -= 2 * Math.PI;
                }
            }
            if (buttons[b].name == "green") {
                if (!(avSceneLisa.position.z >= 70 && avSceneLisa.rotation.y > -Math.PI * 0.5 && avSceneLisa.rotation.y < Math.PI * 0.5) &&
                    !(avSceneLisa.position.z <= -430 && !(avSceneLisa.rotation.y > -Math.PI * 0.5 && avSceneLisa.rotation.y < Math.PI * 0.5)) &&
                    !(avSceneLisa.position.x >= 130 && !(avSceneLisa.rotation.y < 0 && avSceneLisa.rotation.y > -Math.PI)) &&
                    !(avSceneLisa.position.x <= -130 && avSceneLisa.rotation.y < 0 && avSceneLisa.rotation.y > -Math.PI)) {
                    avSceneLisa.translateZ(4);
                }
            }
            if (buttons[b].name == "blue") {
                avSceneLisa.rotation.y -= 0.1;
                if (avSceneLisa.rotation.y <= -1.5 * Math.PI) {
                    avSceneLisa.rotation.y += 2 * Math.PI;
                }
            }
            // messageArea.innerHTML = "Button " + buttons[b].name + " triggered.";
        }
        // console.log("Button " + b + " average " + average);
    }
}



function gotStream(stream) {
    if (video_ready === true) {
        if (window.URL) {
            camvideo.src = window.URL.createObjectURL(stream);
        } else // Opera
        {
            camvideo.src = stream;
        }

        camvideo.onerror = function(e) {
            stream.stop();
        };

        stream.onended = noStream;
    }
}

function noStream(e) {
    var msg = 'No camera available.';
    if (e.code == 1) {
        msg = 'User denied access to use camera.';
    }
    document.getElementById('errorMessage').textContent = msg;
}
