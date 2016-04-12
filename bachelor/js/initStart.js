// Set up global Variables
var scene, camera, renderer;
var sceneNr = 0; //mainScene = 0, cg = 1 
var raycaster;
var mouse;
var cameraFixed = true;
var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;
var updateFcts = [];
var keyboard;
//Call init methods   
init();
animate();


function init() {
    $('#topNavigation').load("content/topNavigation.html");


    scene = new THREE.Scene();

    //Camera
    camera = new THREE.PerspectiveCamera(50, WIDTH / HEIGHT, 0.1, 2000000);
    camera.position.set(0, 0, 450);
    camera.target = scene.position;
    scene.add(camera);

    //Raycaster and Mouse
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Renderer 
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0x09528a, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.appendChild(renderer.domElement);

    //Event Listener
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    //Keyboard
    keyboard = new THREEx.KeyboardState(renderer.domElement);
    renderer.domElement.setAttribute("tabIndex", "0");
    renderer.domElement.focus();

    updateFcts.push(function(delta, now) {
        if (sceneNr === 2) {
            avSceneKeyboard(delta, now);
        }
    });


    //Resize Window Event Listener
    window.addEventListener('resize', function() {
        var WIDTH = window.innerWidth,
            HEIGHT = window.innerHeight;
        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
    });

    //initialize MainScene
    initMainScene();
}


function onDocumentTouchStart(event) {
    event.preventDefault();
    event.clientX = event.touches[0].clientX;
    event.clientY = event.touches[0].clientY;
    onDocumentMouseDown(event);
}

function onDocumentMouseDown(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    if (cameraFixed) {
        if (sceneNr === 0) {
            colorChangeStripes();
            clickableLinks();
        }
    }
}

function onDocumentMouseMove(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    if (cameraFixed) {
        hoverStripes();
        hoverMainSceneLinks();
    }
}

var lastTimeMsec = null;
requestAnimationFrame(function animate(nowMsec) {
    requestAnimationFrame(animate);
    lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
    var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
    lastTimeMsec = nowMsec;
    updateFcts.forEach(function(updateFn) {
        updateFn(deltaMsec / 1000, nowMsec / 1000);
    });
});

function animate() {
    requestAnimationFrame(animate);
    animateMainScene();
    render();
}

function render() {

    TWEEN.update();
    if (cameraFixed) {
        camera.position.x = camera.target.x + (mouse.x * 200);
        camera.position.y = camera.target.y + (mouse.y * 150) + 50;

    }
    camera.lookAt(camera.target);

    //Viewport for AVScene
    if (sceneNr === 2) {
        camera.position.y += 100;
        renderAvScene();
    }
    if (sceneNr === 0 | sceneNr === 1) { //Else Render Standard Viewport
        renderer.render(scene, camera);
    }
}

function updateSize() {

    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = (WIDTH / 2) / HEIGHT;
    camera.updateProjectionMatrix();

}

function changeScene(sceneOld, sceneNewToken) {
    if (sceneNewToken == 'cg') {
        initCGScene();
        renderer.render(scene, camera);
    }
    if (sceneNewToken == 'av') {
        initAVScene();
        renderer.render(scene, camera);
    }
    scene.remove(sceneOld);
}

function backToMainScene() {
    sceneNr = 0;
    document.body.appendChild(renderer.domElement);
    if (cameraFixed) {
        avSceneDiscoverNr = -1;
        renderer.autoClear = true;
        renderer.clear();
        renderer.setSize(WIDTH, HEIGHT);
        renderer.setScissor(0, 0, WIDTH, HEIGHT);
        renderer.setViewport(0, 0, WIDTH, HEIGHT);
        camera.fov = 50;
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
        $('#content').load('content/mainScene.html');
        $('#description').html("UNIVERSITY OF KOBLENZ&middot;LANDAU");
        $('#pageTitle').text("COMPUTATIONAL VISUALISTICS");
        cameraFixed = true;
        renderer.setClearColor(0x09528a, 1);
        camera.position.set(0, 0, 450);
        scene.remove(cgScene);
        scene.remove(avScene);
        scene.add(mainScene);
        renderer.clearDepth();
        renderer.clear();
        renderer.render(scene, camera);
    }
}
