var mainScene, uniMesh, stripesMeshes;
var stripes = [];
var xPositions = [];
var stripesColor = []
var hovered = [];
var mainSceneShadow;

function setCamera() {
    $('#content').load('content/mainScene.html');
    $('#description').html("UNIVERSITY OF KOBLENZ&middot;LANDAU");
    $('#pageTitle').text("COMPUTATIONAL VISUALISTICS");
    cameraFixed = true;
    sceneNr = 0;
    renderer.setClearColor(0x09528a, 1);
    camera.position.set(0, 0, 450);
    scene.remove(cgScene);
    scene.add(mainScene);
}

function initMainScene() {

    //HTML Load
    $('#content').load('content/mainScene.html');

    mainScene = new THREE.Scene();
    mainScene.position.set(0, 0, 0);
    stripesMeshes = new THREE.Object3D();
    scene.add(mainScene);

    camera.position.set(0, 0, 450);
    camera.target = scene.position;

    // Light
    add3PointLight(0, 0, mainScene);

    //University Logo
    initUniMesh();

    //Links
    initMainSceneLinks();
}

function initUniMesh() {

    //"U" of the Logo 
    var loader = new THREE.JSONLoader();
    loader.load("models/uni.json", function(geometry) {
        var material = new THREE.MeshLambertMaterial();
        uniMesh = new THREE.Mesh(geometry, material);
        uniMesh.position.y = 0;

        var toggleUTweenBack = new TWEEN.Tween(uniMesh.rotation)
            .to({
                x: 0,
                y: -Math.PI * 0.08,
                z: 0
            }, 2500)
            .easing(TWEEN.Easing.Quadratic.InOut);
        var toggleUTween = new TWEEN.Tween(uniMesh.rotation)
            .to({
                x: 0,
                y: Math.PI * 0.08,
                z: 0
            }, 2500)
            .easing(TWEEN.Easing.Quadratic.InOut).chain(toggleUTweenBack);
        toggleUTweenBack.chain(toggleUTween);
        toggleUTween.start();


        //Shadow
        geometry = new THREE.PlaneGeometry(190, 85);
        var geomloader = new THREE.TextureLoader();
        geomloader.load(
            'materials/shadow.png',
            function(texture) {
                var material = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    opacity: 0.4
                });
                var mainSceneShadow = new THREE.Mesh(geometry, material);
                mainSceneShadow.rotation.x += (-Math.PI / 2);
                mainSceneShadow.position.y = -150;
                mainSceneShadow.position.x = -40;
                mainSceneShadow.position.z = 10;
                uniMesh.add(mainSceneShadow);

            });

        //Uni-Stripes
        loader.load("models/stripe.json", function(geometry) {
            for (var i = 0; i < 8; i++) {
                var material = new THREE.MeshPhongMaterial({
                    color: 0xFC8E11,
                    emissive: 0xFF470A,
                    specular: 0x111111,
                    shininess: 6
                });
                object = new THREE.Mesh(geometry, material);
                object.position.z = 2;
                object.position.x = (i > 3) ? 100.7 - 6.4 * i : -21.22 - 6.4 * i;
                xPositions.push(object.position.x);
                object.position.y = 40.998 - 19.2 * (i % 4);
                stripesMeshes.add(object);
                stripes.push(object);
            }

            uniMesh.add(stripesMeshes);
            mainScene.add(uniMesh);

        });

    });




}

function bounceStripe(stripe) {
    var indexHovered;
    hovered.push(stripe);
    for (var i = 0; i < stripes.length; i++) {
        if (stripes[i] == stripe) {
            indexHovered = i;
        }
    }
    var xHovered = xPositions[indexHovered];
    var yHovered = stripe.position.y;
    var zHovered = stripe.position.z;
    var hoverTweenBack = new TWEEN.Tween(stripe.position)
        .to({
            x: xHovered,
            y: yHovered,
            z: zHovered
        }, 200)
        .easing(TWEEN.Easing.Circular.Out).delay(50);

    hoverTweenBack.onComplete(function() {
        hovered.splice(hovered.indexOf(stripe), 1);
    });

    var hoverTween = new TWEEN.Tween(stripe.position)
        .to({
            x: xHovered + 8,
            y: yHovered,
            z: zHovered
        }, 200)
        .easing(TWEEN.Easing.Circular.Out).chain(hoverTweenBack).start();
}

function hoverStripes() {
    var hoveredThis = false;
    var intersects = raycaster.intersectObjects(stripesMeshes.children);

    if (intersects.length > 0) {
        for (var i = 0; i < hovered.length; i++) {
            if (hovered[i] == intersects[0].object) {
                hoveredThis = true;
            }
        }
        if (!hoveredThis) {
            bounceStripe(intersects[0].object);
        }
    }
}

function colorChangeStripes() {
    var color1 = new THREE.Color(0xFC8E11);
    var color2 = new THREE.Color(0xffffff);

    var intersects = raycaster.intersectObjects(stripesMeshes.children);
    if (intersects.length > 0) {
        if (intersects[0].object.material.color.equals(color1)) {
            intersects[0].object.material = new THREE.MeshPhongMaterial({
                color: color2,
                emissive: 0x000000,
                specular: 0x111111,
                transparent: true,
                opacity: 0.7,
                shininess: 6
            });
        } else if (intersects[0].object.material.color.equals(color2)) {
            intersects[0].object.material = new THREE.MeshPhongMaterial({
                color: color1,
                emissive: 0xFF470A,
                specular: 0x111111,
                shininess: 6
            });
        }
    }
}

function animateMainScene() {
    mainSceneLinkAbout.rotation.x = 0. * Math.PI - (mouse.y * Math.PI * 0.1);
    mainSceneLinkAbout.rotation.y = 0 * Math.PI + (mouse.x * Math.PI * 0.1);
}
