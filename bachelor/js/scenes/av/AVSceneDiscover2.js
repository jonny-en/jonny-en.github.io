//declare some global variables
var DEBUG = true; //turn on JSARToolKit built-in debugging info
var threshold = 128;
var avDiscover2Scene;
var avDiscover2Camera;
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
    avSceneDiscoverNr = 2;
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setViewport(0, 0, WIDTH, HEIGHT);
    renderer.setScissor(0, 0, WIDTH, HEIGHT);

    var lisaloader = new THREE.ObjectLoader();
    lisaloader.load("models/lisa.json", function(obj) {
        avSceneDiscover2Lisa = obj;
        avSceneDiscover2Lisa.scale.set(1, 1, 1);
        avSceneDiscover2Lisa.rotation.x = -Math.PI / 2;
        var avSceneDiscover2SpotLight = new THREE.AmbientLight(0xffffff);
        avSceneDiscover2SpotLight.position.x = 100;
        avSceneDiscover2SpotLight.position.y = -100;
        avSceneDiscover2SpotLight.position.z = -100;


        avSceneDiscover2Lisa.add(avSceneDiscover2SpotLight);


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



        $container = $('#threejs-container');
        $container.append(renderer.domElement);
        renderer.domElement.focus();

        avDiscover2Scene = new THREE.Scene();



        avDiscover2Camera = new THREE.Camera();
        avDiscover2Scene.add(avDiscover2Camera);


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
        var markerCount = detector.detectMarkerLite(raster, threshold);

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


            // If this is a new id, let's start tracking it.
            if (markers[currId] == null) {

                //create new object for the marker
                markers[currId] = {};

                //create a new Three.js object as marker root
                var markerRoot = new THREE.Object3D();
                markerRoot.matrixAutoUpdate = false;
                markerRoots[currId] = markerRoot;


                markerRoot.add(avSceneDiscover2Lisa);
                /* var geometry = THREE.
                // Add the marker models and suchlike into your marker root object.
                var cube = new THREE.Mesh(
                    new THREE.CubeGeometry(120, 120, 120),
                    new THREE.MeshNormalMaterial({ color: 0xff00ff, wireframe: true })
                );
                cube.position.z = -60;
                markerRoot.add(cube);
        */
                // Add the marker root to your scene.


                avDiscover2Scene.add(markerRoot);
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

function copyMarkerMatrix(arMat, glMat) {
    glMat[0] = arMat.m00;
    glMat[1] = -arMat.m10;
    glMat[2] = arMat.m20;
    glMat[3] = 0;
    glMat[4] = arMat.m01;
    glMat[5] = -arMat.m11;
    glMat[6] = arMat.m21;
    glMat[7] = 0;
    glMat[8] = -arMat.m02;
    glMat[9] = arMat.m12;
    glMat[10] = -arMat.m22;
    glMat[11] = 0;
    glMat[12] = arMat.m03;
    glMat[13] = -arMat.m13;
    glMat[14] = arMat.m23;
    glMat[15] = 1;
}
