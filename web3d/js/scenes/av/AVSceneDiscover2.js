//the code builds up on the code from http://www.html5rocks.com/de/tutorials/webgl/jsartoolkit_webrtc/ 
//thanks to writer of the tutorial.

//declare some global variables
var DEBUG = true; //turn on JSARToolKit built-in debugging info
var threshold = 128;
var avDiscover2Scene;
var avDiscover2Camera;
var avSceneDiscover2SpotLight;
var $video;
var videoScene;
var videoCam;
var video_ready2 = false;
var $canvas;
var videoTex;
var plane;
var markerRoots = {};
var $container;
var tmp = new Float32Array(16);
var resultMat;
var source;
var markerCount;
// Create a RGB raster object for the 2D canvas.
// JSARToolKit uses raster objects to read image data.
// Note that you need to set canvas.changed = true on every frame.
var raster;

// FLARParam is the thing used by FLARToolKit to set camera parameters.
// Here we create a FLARParam for images with 320x240 pixel dimensions.
var param;

// The FLARMultiIdMarkerDetector is the actual detection engine for marker detection.
// It detects multiple ID markers. ID markers are special markers that encode a number.
var detector;
var markers = {};

var emptyFloatArray;
var avSceneDiscover2Lisa;
// I'm going to use a glMatrix-style matrix as an intermediary.
// So the first step is to create a function to convert a glMatrix matrix into a Three.js Matrix4.
THREE.Matrix4.prototype.setFromArray = function(m) {
    return this.set(
        m[0], m[4], m[8], m[12],
        m[1], m[5], m[9], m[13],
        m[2], m[6], m[10], m[14],
        m[3], m[7], m[11], m[15]
    );
};

function avSceneDiscover2() {
    resetAvSceneDiscover2();
    avSceneDiscoverNr = 2;
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setViewport(0, 0, WIDTH, HEIGHT);
    renderer.setScissor(0, 0, WIDTH, HEIGHT);
    renderer.domElement.focus();

    avSceneDiscover2SpotLight = new THREE.SpotLight(0xffffff);
    avSceneDiscover2SpotLight.position.x = 0;
    avSceneDiscover2SpotLight.position.y = 200;
    avSceneDiscover2SpotLight.position.z = 0;

    var lisaloader = new THREE.ObjectLoader();
    lisaloader.load("models/lisa.json", function(obj) {
        avSceneDiscover2Lisa = obj;
        avSceneDiscover2Lisa.scale.set(1, 1, 1);
    });

    $('#content').load('content/av/avSceneDiscover2.html', function() {
        $canvas = $('#mainCanvas')[0];

        // Create a RGB raster object for the 2D canvas.
        // JSARToolKit uses raster objects to read image data.
        // Note that you need to set canvas.changed = true on every frame.
        raster = new NyARRgbRaster_Canvas2D($canvas);

        // FLARParam is the thing used by FLARToolKit to set camera parameters.
        // Here we create a FLARParam for images with 320x240 pixel dimensions.
        param = new FLARParam(640, 480);

        // The FLARMultiIdMarkerDetector is the actual detection engine for marker detection.
        // It detects multiple ID markers. ID markers are special markers that encode a number.
        detector = new FLARMultiIdMarkerDetector(param, 120);

        // For tracking video set continue mode to true. In continue mode, the detector
        // tracks markers across multiple frames.
        detector.setContinueMode(true);


        //stream to video element
        $video = $('#mainVideo')[0];
        streamVideo($video);
        source = $video;

        $container = $('body');

        avDiscover2Scene = new THREE.Scene();
        avDiscover2Scene.add(avSceneDiscover2SpotLight);

        avDiscover2Camera = new THREE.PerspectiveCamera(50, WIDTH / HEIGHT, 0.1, 20000);

        param.copyCameraMatrix(tmp, 10, 10000);
        avDiscover2Camera.projectionMatrix.setFromArray(tmp);

        // Create scene and quad for the video.
        //NOTE: must use <canvas> as the texture, not <video>, otherwise there will be a 1-frame lag
        videoTex = new THREE.Texture($canvas);

        var geometry = new THREE.PlaneGeometry(2, 2, 0);
        var material = new THREE.MeshBasicMaterial({
            map: videoTex,
            depthTest: false,
            depthWrite: false
        });

        plane = new THREE.Mesh(geometry, material);
        videoScene = new THREE.Scene();
        videoCam = new THREE.Camera();
        videoScene.add(plane);
        videoScene.add(videoCam);


        // Create a NyARTransMatResult object for getting the marker translation matrices.
        resultMat = new NyARTransMatResult();

        vmarkers = {};

        emptyFloatArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        video_ready2 = true;
    });
}

function loop() {
    if ($video.readyState === $video.HAVE_ENOUGH_DATA && sceneNr === 2 && avSceneDiscoverNr === 2) {
        // Draw the video frame to the canvas.
        $canvas.getContext('2d').drawImage($video, 0, 0, $canvas.width, $canvas.height);

        // Tell JSARToolKit that the canvas has changed.
        $canvas.changed = true;

        // Update the video texture.
        videoTex.needsUpdate = true;

        //move all marker roots to origin so that they will disappear when not tracked
        Object.keys(markerRoots).forEach(function(key) {
            markerRoots[key].matrix.setFromArray(emptyFloatArray);
            markerRoots[key].matrixWorldNeedsUpdate = true;
        });
        // Do marker detection by using the detector object on the raster object.
        // The threshold parameter determines the threshold value
        // for turning the video frame into a 1-bit black-and-white image.
        //
        //NOTE: THE CANVAS MUST BE THE SAME SIZE AS THE RASTER
        //OTHERWISE WILL GET AN "Uncaught #<Object>" ERROR
        markerCount = detector.detectMarkerLite(raster, threshold);

        // Go through the detected markers and get their IDs and transformation matrices.
        for (var i = 0; i < markerCount; i++) {

            // Get the ID marker data for the current marker.
            // ID markers are special kind of markers that encode a number.
            // The bytes for the number are in the ID marker data.
            var id = detector.getIdMarkerData(i);


            // Read bytes from the id packet.
            var currId = -1;
            // This code handles only 32-bit numbers or shorter.
            if (id.packetLength <= 4) {
                currId = 0;
                for (var j = 0; j < id.packetLength; j++) {
                    currId = (currId << 8) | id.getPacketData(j);
                }
            }

            if (markers[currId] == null) {

                //create new object for the marker
                markers[currId] = {};

                //create a new Three.js object as marker root
                var markerRoot = new THREE.Object3D();
                markerRoot.matrixAutoUpdate = false;
                markerRoots[currId] = markerRoot;


                markerRoot.add(avSceneDiscover2Lisa);

                avDiscover2Scene.add(markerRoot);
                avSceneDiscover2SpotLight.target = avSceneDiscover2Lisa;
            }

            // Get the transformation matrix for the detected marker.
            detector.getTransformMatrix(i, resultMat);

            // Copy the marker matrix to the tmp matrix.
            copyMarkerMatrix(resultMat, tmp);

            // Copy the marker matrix over to your marker root object.
            markerRoots[currId].matrix.setFromArray(tmp);
            markerRoots[currId].matrixWorldNeedsUpdate = true;
        }
    }
}

function copyMarkerMatrix(mat, cm) {
    cm[0] = mat.m00;
    cm[1] = -mat.m10;
    cm[2] = mat.m20;
    cm[3] = 0;

    cm[4] = mat.m02;
    cm[5] = -mat.m12;
    cm[6] = mat.m22;
    cm[7] = 0;

    cm[8] = -mat.m01;
    cm[9] = mat.m11;
    cm[10] = -mat.m21;
    cm[11] = 0;

    cm[12] = mat.m03;
    cm[13] = -mat.m13;
    cm[14] = mat.m23;
    cm[15] = 1;
}

function resetAvSceneDiscover2() {
    DEBUG = true; //turn on JSARToolKit built-in debugging info
    threshold = 128;
    avDiscover2Scene = null;
    avDiscover2Camera = null;
    $video = null;
    videoScene = null;
    videoCam = null;
    video_ready2 = false;
    $canvas = null;
    videoTex = null;
    plane = null;
    markerRoots = {};
    $container = null;
    tmp = new Float32Array(16);
    resultMat = null;
    source = null;
    markerCount = null;
    raster = null;
    param = null;
    detector = null;
    markers = {};
    emptyFloatArray = null;
    avSceneDiscover2Lisa = null;
    avSceneDiscover2SpotLight = null;

}
