// Set up global Variables
var scene, camera, renderer;
var raycaster;

var mouse;
var updateFcts = [];
var lastTimeMsec = null;
var keyboard;

var sceneNr = 0; //mainScene = 0, cg = 1, av = 2, mv = 3
var cameraFixed = true;

var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;


//Call init methods   
init();
animate();

//First called init method. Sets up the main structure of the application.
function init() {
    $('#top-navigation').load("content/topNavigation.html");

    scene = new THREE.Scene();

    //initialise camera
    camera = new THREE.PerspectiveCamera(50, WIDTH / HEIGHT, 0.1, 2000000);
    camera.position.set(0, 0, 450);
    camera.target = scene.position;
    scene.add(camera);

    //initialise raycaster and mouse
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
    window.addEventListener('resize', updateSize);

    //Initialise the first scene which is the main scene
    initMainScene();
}

//Event function for touchscreen
function onDocumentTouchStart(event) {
    event.preventDefault();
    event.clientX = event.touches[0].clientX;
    event.clientY = event.touches[0].clientY;
    onDocumentMouseDown(event);
}

//Event function for mouse click
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
//Event function for Mouse Move
function onDocumentMouseMove(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    if (cameraFixed && sceneNr === 0) {
        hoverStripes();
        hoverMainSceneLinks();
        hoverCylinders();
    }
}

//Overwritten requestAnimationFrame to compute the amount of time the keyboard was pressed.
requestAnimationFrame(function animate(nowMsec) {
    requestAnimationFrame(animate);
    lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
    var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
    lastTimeMsec = nowMsec;
    updateFcts.forEach(function(updateFn) {
        updateFn(deltaMsec / 1000, nowMsec / 1000);
    });
});

//Renderfunction
function animate() {
    requestAnimationFrame(animate);

    TWEEN.update();
    if (cameraFixed) {
        camera.position.x = camera.target.x + (mouse.x * 200);
        camera.position.y = camera.target.y + (mouse.y * 150) + 50;

    }
    camera.lookAt(camera.target);

    if (sceneNr === 0 || sceneNr ===1) {
        renderer.render(scene, camera);
    }
    if (sceneNr === 2) {
        camera.position.y += 100;
        renderAvScene();
    }
}

//this function is called when the browser window changes its size
function updateSize() {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

//this function controlls the interchange of the different scenes.
function changeScene(sceneOld, sceneNewToken) {
    document.body.appendChild(renderer.domElement);

    //setting some values back to normal. This is important when coming from a scene whose rendering proccess differs.
    avSceneDiscoverNr = -1;
    renderer.autoClear = true;
    renderer.clear();
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setScissor(0, 0, WIDTH, HEIGHT);
    renderer.setViewport(0, 0, WIDTH, HEIGHT);
    camera.fov = 50;
    camera.target = new THREE.Vector3(0, 0, 0);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();

    // When a user is using the main scene the application first does'nt know which scene he actually came from. This is for finding out.
    if (sceneOld === 'undef') {
        if (sceneNr === 0) {
            sceneOld = mainScene;
        }
        if (sceneNr === 1) {
            sceneOld = cgScene;
        }
        if (sceneNr === 2) {
            sceneOld = avScene;
        }

    }

    //This is the actual change. It removes the oldScene and initialises the new one
    if (sceneOld != 'undef') {
        scene.remove(sceneOld);
    }
    //computer graphics
    if (sceneNewToken == 'cg') {
        sceneNr = 1;
        initCGScene();
        renderer.render(scene, camera);
    }
    //active vision
    if (sceneNewToken == 'av') {
        sceneNr = 2;
        initAVScene();
        renderer.render(scene, camera);
    }
    //medical visualisation
    if (sceneNewToken == 'mv') {
        sceneNr = 3;
        initMVScene();
        renderer.render(scene, camera);
    }
    //mainscene
    if (sceneNewToken == 'ms') {
        document.body.appendChild(renderer.domElement);
        sceneNr = 0;
        scene.add(mainScene);
        renderer.setClearColor(0x09528a, 1);
        renderer.render(scene, camera);
        $('#content').load('content/mainScene.html');
        $('#description').html("UNIVERSIT&Auml;T KOBLENZ&middot;LANDAU");
        $('#page-title').text("COMPUTERVISUALISTIK");
        cameraFixed = true;
        camera.position.set(0, 0, 450);

    }
}