//Global Variables for MainScene
var mainScene, uniMesh, stripesMeshes;
var stripes = [];
var xPositions = [];
var stripesColor = [];
var hovered = [];
var mainSceneShadow;
var cylinders;

function initMainScene() {

    //HTML Load
    $('#content').load('content/mainScene.html');

    mainScene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x123c5c, 100, 2500);

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
            var material = new THREE.MeshPhongMaterial({
                color: 0xFC8E11,
                emissive: 0xFF470A,
                specular: 0x111111,
                shininess: 6
            });
            for (var i = 0; i < 8; i++) {
                var object = new THREE.Mesh(geometry, material);
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
    initAbout();
}

//given stripe bounces back and forth
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

//function for the hover effect of the stripes. 
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

//function for color change when stripe is clicked
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

//from here on the code descripes the about section, which is in front of the actual main scene.

//function that is called when the user clicks on the about link
function goBackToAbout() {
    $('#content').load('content/mainSceneAbout.html');
    cameraBack();
    loadAboutSprites();
}

//animate function for the camera to move back
function cameraBack() {
    var cameraBackTween = new TWEEN.Tween(camera.position).to({
        z: 1500
    }, 2000).easing(TWEEN.Easing.Circular.InOut).start().onComplete(function() {
        $('#mainSceneAboutContainer').fadeIn("slow");
    });
}

//function that is called when the user clicks on the back link
function goToFront() {
    $('#content').fadeOut("slow", function() {
        $('#content').load('content/mainScene.html');
    });
    cameraFront();
}

//animate function for the camera to move forth
function cameraFront() {
    var cameraBackTween = new TWEEN.Tween(camera.position).to({
        z: 450
    }, 2000).easing(TWEEN.Easing.Circular.InOut).start().onComplete(function() {
        $('#content').fadeIn("slow");
    });
}

//function for changing the color of the study section.
function hoverCylinders() {
    var hoveredThis = false;
    var intersects = raycaster.intersectObjects(cylinders.children);

    if (intersects.length > 0) {
        for (var i = 0; i < cylinders.children.length; i++) {
            cylinders.children[i].material = new THREE.MeshPhongMaterial({
                color: 0xFC8E11,
                emissive: 0xFF470A,
                specular: 0x111111,
                shininess: 0
            });
        }
        intersects[0].object.material = new THREE.MeshLambertMaterial();
    }
}


function initAbout() {
    var material = new THREE.MeshPhongMaterial({
        color: 0xFC8E11,
        emissive: 0xFF470A,
        specular: 0x111111,
        shininess: 0
    });

    //initialise structure of course of studies
    cylinders = new THREE.Object3D();
    mainScene.add(cylinders);
    cylinders.position.y = -50;
    cylinders.position.x = 25;
    var geometry = new THREE.CylinderBufferGeometry(60, 60, 40.5, 32);
    var cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.set(0, 0, 900);

    var geometry = new THREE.CylinderBufferGeometry(60, 60, 33, 32);
    var cylinder2 = new THREE.Mesh(geometry, material);
    cylinder2.position.set(0, 40.5, 900);

    var geometry = new THREE.CylinderBufferGeometry(60, 60, 24, 32);
    var cylinder3 = new THREE.Mesh(geometry, material);
    cylinder3.position.set(0, 72.5, 900);

    var geometry = new THREE.CylinderBufferGeometry(60, 60, 22.5, 32);
    var cylinder4 = new THREE.Mesh(geometry, material);
    cylinder4.position.set(0, 99.5, 900);

    var geometry = new THREE.CylinderBufferGeometry(60, 60, 18, 32);
    var cylinder5 = new THREE.Mesh(geometry, material);
    cylinder5.position.set(0, 123, 900);

    var geometry = new THREE.CylinderBufferGeometry(60, 60, 18, 32);
    var cylinder6 = new THREE.Mesh(geometry, material);
    cylinder6.position.set(0, 144, 900);

    cylinders.add(cylinder);
    cylinders.add(cylinder2);
    cylinders.add(cylinder3);
    cylinders.add(cylinder4);
    cylinders.add(cylinder5);
    cylinders.add(cylinder6);
}

//loading all sprites for the about section
function loadAboutSprites() {
    //loading all sprites for the structure of the courses
    var cylinderSprites = new THREE.Object3D();
    cylinderSprites.position.x = -250;

    var orangeSprites = new THREE.Object3D();
    orangeSprites.add(genBigSprite('AUFBAU', 140, 20, 900, "rgba(255,200,0, 1.0)"));
    orangeSprites.add(genBigSprite('INSTITUTE (Externe Links)', 350, 20, 900, "rgba(255,200,0, 1.0)"));

    mainScene.add(orangeSprites);

    //loading all sprites next to the structure
    cylinderSprites.add(genSprite('INFORMATIK', 224, -120));
    cylinderSprites.add(genSprite('COMPUTERVISUALISTIK', 175, -80));
    cylinderSprites.add(genSprite('MATHEMATIK &', 211, -45));
    cylinderSprites.add(genSprite('THEORETISCHE INFORMATIK', 152, -55));
    cylinderSprites.add(genSprite('WAHLPFLICHT', 216, -23));
    cylinderSprites.add(genSprite('SEMINARE & PROJEKTE', 175, 0));
    cylinderSprites.add(genSprite('BACHELORARBEIT', 198, 20));

    //loading the sprites percentages
    cylinderSprites.add(genProcentSprite('27%', 380, -165));
    cylinderSprites.add(genProcentSprite('22%', 380, -128));
    cylinderSprites.add(genProcentSprite('16%', 380, -97));
    cylinderSprites.add(genProcentSprite('15%', 380, -70));
    cylinderSprites.add(genProcentSprite('12%', 380, -46));
    cylinderSprites.add(genProcentSprite('8%', 385, -26));

    mainScene.add(cylinderSprites);


    //loading the logos of the working groups
    var instituteSprites = new THREE.Object3D();
    instituteSprites.position.set(450, 0, 750);
    mainScene.add(instituteSprites);

    var loader = new THREE.TextureLoader();

    loader.load('images/informatik.png', function(texture) {
        var spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        var sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(125, 62.5, 1.0);
        sprite.position.set(-200, 0, 30);
        instituteSprites.add(sprite);
    });

    loader.load('images/west.png', function(texture) {
        var spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        var sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(120, 32, 1.0);
        instituteSprites.add(sprite);
    });

    loader.load('images/ist.png', function(texture) {
        var spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        var sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(155.25, 75, 1.0);
        sprite.position.set(-200, 100, -30);

        instituteSprites.add(sprite);
    });

    loader.load('images/agas.png', function(texture) {
        var spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        var sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(155.25, 75, 1.0);
        sprite.position.set(0, 100, 40);

        instituteSprites.add(sprite);
    });

    instituteSprites.add(genBigSprite('COMPUTERGRAFIK', -120, -200, -30, "rgba(255,255,255, 1.0)"));
    instituteSprites.add(genBigSprite('COMPUTERLINGUISTIK', 80, -200, -30, "rgba(255,255,255, 1.0)"));
}



function genSprite(text, xPosition, yPosition) {
    var structureCanvas = document.createElement('canvas');
    structureCanvas.width = 1200;
    structureCanvas.height = 1200;
    var structureContext = structureCanvas.getContext('2d');
    structureContext.font = 'bold 70px Montserrat,Helvetica';
    structureContext.fillStyle = "rgba(255,255,255, 1.0)";
    structureContext.fillText(text, 10, 50);

    var texture = new THREE.Texture(structureCanvas);
    texture.needsUpdate = true;
    var spriteMaterial = new THREE.SpriteMaterial({
        map: texture
    });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(150, 150, 1.0);
    sprite.position.set(xPosition, yPosition, 900);
    return sprite;
}

function genProcentSprite(text, xPosition, yPosition) {
    var structureCanvas = document.createElement('canvas');
    structureCanvas.width = 1200;
    structureCanvas.height = 1200;
    var structureContext = structureCanvas.getContext('2d');
    structureContext.font = 'bold 60px Montserrat,Helvetica';
    structureContext.fillStyle = "rgba(255,255,255, 1.0)";
    structureContext.fillText(text, 5, 50);

    var texture = new THREE.Texture(structureCanvas);
    texture.needsUpdate = true;
    var spriteMaterial = new THREE.SpriteMaterial({
        map: texture
    });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(250, 250, 1.0);
    sprite.position.set(xPosition, yPosition, 980);
    return sprite;
}

function genBigSprite(text, xPosition, yPosition, zPosition, color) {

    var structureCanvas = document.createElement('canvas');
    structureCanvas.width = 1200;
    structureCanvas.height = 1200;
    var structureContext = structureCanvas.getContext('2d');
    structureContext.font = 'bold 70px Montserrat,Helvetica';
    structureContext.fillStyle = color;
    structureContext.fillText(text, 5, 50);

    var texture = new THREE.Texture(structureCanvas);
    texture.needsUpdate = true;
    var spriteMaterial = new THREE.SpriteMaterial({
        map: texture
    });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(250, 250, 1.0);
    sprite.position.set(xPosition, yPosition, zPosition);

    return sprite;
}
