var mainSceneLinkCG, mainSceneLinkCGSphere, mainSceneLinkCGText, mainSceneLinkCGEarth, mainSceneLinkCGMoon, mainSceneLinkCGMoonCenter;
var hoveredCG = false;
var earthTweenRotation, moonTweenRotation;

function initMainSceneLinkCG() {
    mainSceneLinkCG = new THREE.Object3D();

    //initialise the earth
    var material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true
    });
    var geometry = new THREE.SphereGeometry(12, 12, 10, 10);
    mainSceneLinkCGEarth = new THREE.Mesh(geometry, material);
    mainSceneLinkCGEarth.position.set(-3, -2, 0);
    mainSceneLinkCG.add(mainSceneLinkCGEarth);

    //initialise the moon
    var geometry = new THREE.SphereGeometry(0.1, 0.1, 5, 5);
    var material = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0
    });
    mainSceneLinkCGMoonCenter = new THREE.Mesh(geometry, material);
    mainSceneLinkCG.add(mainSceneLinkCGMoonCenter);

    var geometry = new THREE.SphereGeometry(6, 6, 6, 6);
    var material = new THREE.MeshLambertMaterial({
        color: 0xFC8E11,
        emissive: 0xFF470A,
        wireframe: true
    });
    mainSceneLinkCGMoon = new THREE.Mesh(geometry, material);
    mainSceneLinkCGMoon.position.set(17.5, 0, 0);
    mainSceneLinkCGMoonCenter.rotation.set(Math.PI / 4 + 0.7, Math.PI / 4 - 0.3, 0);
    mainSceneLinkCGMoonCenter.add(mainSceneLinkCGMoon);

    //initialise the text
    var textCG = new THREE.TextGeometry("COMPUTERGRAFIK", {
        size: 8,
        height: 2,
        curveSegments: 4,
        font: "helvetiker",
        weight: "bold"
    });

    var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0x074271,
        specular: 0x074271,
        shininess: 1
    });
    mainSceneLinkCGText = new THREE.Mesh(textCG, material);
    textCG.computeBoundingBox();
    var centerOffset = -0.5 * (textCG.boundingBox.max.x - textCG.boundingBox.min.x);
    mainSceneLinkCGText.position.x = centerOffset;
    mainSceneLinkCGText.position.y = -5;
    var geometry = new THREE.BoxGeometry(
        textCG.boundingBox.max.x,
        textCG.boundingBox.max.y,
        textCG.boundingBox.max.z
    );
    var material = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0
    });
    mainSceneLinkCGTextVolume = new THREE.Mesh(geometry, material);
    mainSceneLinkCGTextVolume.userData = { animationNr: 1 };
    mainSceneLinkCGTextVolume.position.set(-1.85 * centerOffset, 0, 0);
    mainSceneLinkCGTextVolume.add(mainSceneLinkCGText);

    //initialise the stripe
    var loader = new THREE.JSONLoader();
    loader.load("models/stripe.json", function(geometry) {
        var material = new THREE.MeshPhongMaterial({
            color: 0xED4F00,
            emissive: 0xFF470A,
            specular: 0x000000,
            shininess: 6
        });
        var mainSceneLinkCGLine = new THREE.Mesh(geometry, material);
        mainSceneLinkCGLine.position.set(-2, -10, -0);
        mainSceneLinkCGLine.scale.set(1.8, 0.25, 0.05);
        mainSceneLinkCGTextVolume.add(mainSceneLinkCGLine);
    });

    //initialise the sphere
    var geometry = new THREE.SphereGeometry(30, 30, 30);
    var material = new THREE.MeshBasicMaterial({
        color: 0x073454,
        side: THREE.BackSide
    });
    mainSceneLinkCGSphere = new THREE.Mesh(geometry, material);
    mainSceneLinkCGSphere.position.set(-250, 80, -10);
    mainSceneLinkCGSphere.scale.set(0.8, 0.8, 0.8);
    mainSceneLinkCGSphere.rotation.set(0, 0.1, 0);
    mainSceneLinkCGSphere.userData = { sceneNr: 1, animationNr: 1 };
    mainSceneLinkCGSphere.add(mainSceneLinkCG);
    mainSceneLinkCGSphere.add(mainSceneLinkCGTextVolume);
    mainSceneLinks.add(mainSceneLinkCGSphere);
}

//this function rotates the moon around the earth and sets the earth into the center
function mainSceneLinkCGAnimate() {
    if (hoveredCG == false) {
        hoveredCG = true;
        mainSceneLinkCGText.material = mainSceneLinkTextMaterialHovered;
        mainSceneLinkCGSphere.material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.BackSide
        });

        earthTween = new TWEEN.Tween(mainSceneLinkCGEarth.position)
            .to({
                x: 0,
                y: 0,
                z: 0
            }, 100)
            .easing(TWEEN.Easing.Circular.Out).start();

        moonTween = new TWEEN.Tween(mainSceneLinkCGMoon.position)
            .to({
                x: 20,
                y: 0,
                z: 0
            }, 100)
            .easing(TWEEN.Easing.Circular.Out).start();

        earthTweenRotation = new TWEEN.Tween(mainSceneLinkCGEarth.rotation)
            .to({
                y: Math.PI / 2
            }, 1000)
            .onComplete(function() {
                mainSceneLinkCGEarth.rotation.y = 0;
            });

        earthTweenRotation.chain(earthTweenRotation);
        earthTweenRotation.start();

        moonTweenRotation = new TWEEN.Tween(mainSceneLinkCGMoonCenter.rotation)
            .to({
                z: 2 * Math.PI
            }, 1000)
            .onComplete(function() {
                mainSceneLinkCGMoonCenter.rotation.z = 0;
            });
        moonTweenRotation.chain(moonTweenRotation);
        moonTweenRotation.start();
    }
}

//this function sets moon and earth to where they come from
function mainSceneLinkCGAnimateBack() {
    if (hoveredCG == true) {
        hoveredCG = false;

        mainSceneLinkCGText.material = mainSceneLinkTextMaterial;

        mainSceneLinkCGSphere.material = new THREE.MeshBasicMaterial({
            color: 0x073454,
            side: THREE.BackSide
        });

        earthTweenBack = new TWEEN.Tween(mainSceneLinkCGEarth.position)
            .to({
                x: -3,
                y: -2,
                z: 0
            }, 100)
            .easing(TWEEN.Easing.Circular.Out).start();

        earthTweenRotation.stop();
        moonTweenRotation.stop();
        mainSceneLinkCGEarth.rotation.y = 0;

        moonTweenRotationBack = new TWEEN.Tween(mainSceneLinkCGMoonCenter.rotation)
            .to({
                x: Math.PI / 4 + 0.7,
                y: Math.PI / 4 - 0.3,
                z: 0
            }, 200).start();

        moonTweenBack = new TWEEN.Tween(mainSceneLinkCGMoon.position)
            .to({
                x: 17,
                y: 0,
                z: 0
            }, 100)
            .easing(TWEEN.Easing.Circular.Out).start();

    }
}
//stops the rotation of both earth and moon
function mainSceneLinkCGAnimateStop() {
    moonTweenRotation.stop();
    earthTweenRotation.stop();
}
