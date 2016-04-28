var mainSceneLinkMV, mainSceneLinkMVSphere, mainSceneLinkMVText, mainSceneLinkMVUpperTeeth, mainSceneLinkMVLowerTeeth;
var hoveredMV = false;

function initMainSceneLinkMV() {
    mainSceneLinkMV = new THREE.Object3D();
    //Text
    var textMV = new THREE.TextGeometry("MEDIZ. VISUALISIERUNG", {
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
    mainSceneLinkMVText = new THREE.Mesh(textMV, material);

    textMV.computeBoundingBox();
    var centerOffset = -0.5 * (textMV.boundingBox.max.x - textMV.boundingBox.min.x);
    mainSceneLinkMVText.position.x = centerOffset;
    mainSceneLinkMVText.position.y = -5;
    var geometry = new THREE.BoxGeometry(
        textMV.boundingBox.max.x,
        textMV.boundingBox.max.y,
        textMV.boundingBox.max.z
    );
    var material = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0
    });
    mainSceneLinkMVTextVolume = new THREE.Mesh(geometry, material);
    mainSceneLinkMVTextVolume.position.set(-1.75 * centerOffset, 0, 0);
    mainSceneLinkMVTextVolume.add(mainSceneLinkMVText);

    //Stripe
    var loader = new THREE.JSONLoader();
    loader.load("models/stripe.json", function(geometry) {
        var material = new THREE.MeshPhongMaterial({
            color: 0xED4F00,
            emissive: 0xFF470A,
            specular: 0x000000,
            shininess: 6
        });
        var mainSceneLinkMVLine = new THREE.Mesh(geometry, material);
        mainSceneLinkMVLine.position.set(-2, -10, -0);
        mainSceneLinkMVLine.scale.set(2.3, 0.25, 0.05);
        mainSceneLinkMVTextVolume.add(mainSceneLinkMVLine);
    });

    //Sphere
    var geometry = new THREE.SphereGeometry(30, 30, 30);
    var material = new THREE.MeshBasicMaterial({
        color: 0x073454,
        side: THREE.BackSide
    });
    mainSceneLinkMVSphere = new THREE.Mesh(geometry, material);

    mainSceneLinkMVSphere.position.set(-290, -40, -10);
    mainSceneLinkMVSphere.scale.set(0.8, 0.8, 0.8);
    mainSceneLinkMVSphere.rotation.set(0, 0.1, 0);

    mainSceneLinkMVSphere.add(mainSceneLinkMV);
    mainSceneLinkMVSphere.add(mainSceneLinkMVTextVolume);
    mainSceneLinks.add(mainSceneLinkMVSphere);

    var mvloader = new THREE.ObjectLoader();
    mvloader.load("models/upperteeth.json", function(obj) {
        mainSceneLinkMVUpperTeeth = obj;
        mainSceneLinkMVUpperTeeth.rotation.set(0, Math.PI, 0);
        mainSceneLinkMVUpperTeeth.scale.set(4.5, 4.5, 4.5);
        mainSceneLinkMVUpperTeeth.position.set(0, -10, 0);
        mainSceneLinkMVSphere.add(mainSceneLinkMVUpperTeeth);
    });

    var mvloader2 = new THREE.ObjectLoader();
    mvloader2.load("models/lowerteeth.json", function(obj) {
        mainSceneLinkMVLowerTeeth = obj;
        mainSceneLinkMVLowerTeeth.rotation.set(0.2, Math.PI, 0);
        mainSceneLinkMVLowerTeeth.scale.set(4.5, 4.5, 4.5);
        mainSceneLinkMVLowerTeeth.position.set(0, -15, -5);
        mainSceneLinkMVSphere.add(mainSceneLinkMVLowerTeeth);
    });

}

function mainSceneLinkMVAnimate() {
    if (hoveredMV == false) {
        hoveredMV = true;

        mainSceneLinkMVText.material = mainSceneLinkTextMaterialHovered;
        mainSceneLinkMVSphere.material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.BackSide
        });
        lowerTeethTweenPositionDown = new TWEEN.Tween(mainSceneLinkMVLowerTeeth.position)
            .to({
                y: -18,
                z: -10
            }, 300);
        lowerTeethTweenPositionUp = new TWEEN.Tween(mainSceneLinkMVLowerTeeth.position)
            .to({
                y: -12,
                z: -5
            }, 300).chain(lowerTeethTweenPositionDown);
        lowerTeethTweenPositionDown.chain(lowerTeethTweenPositionUp).start();



        lowerTeethTweenRotationDown = new TWEEN.Tween(mainSceneLinkMVLowerTeeth.rotation)
            .to({
                x: 0.4
            }, 300);
        lowerTeethTweenRotationUp = new TWEEN.Tween(mainSceneLinkMVLowerTeeth.rotation)
            .to({
                x: 0
            }, 300).chain(lowerTeethTweenRotationDown);
        lowerTeethTweenRotationDown.chain(lowerTeethTweenRotationUp).start();



        upperTeethTweenRotationDown = new TWEEN.Tween(mainSceneLinkMVUpperTeeth.rotation)
            .to({
                x: -0.2
            }, 300);
        upperTeethTweenRotationUp = new TWEEN.Tween(mainSceneLinkMVUpperTeeth.rotation)
            .to({
                x: 0
            }, 300).chain(upperTeethTweenRotationDown);
        upperTeethTweenRotationDown.chain(upperTeethTweenRotationUp);
        upperTeethTweenRotationDown.start();
    }
}


function mainSceneLinkMVAnimateBack() {
    if (hoveredMV == true) {
        hoveredMV = false;

        mainSceneLinkMVText.material = mainSceneLinkTextMaterial;

        mainSceneLinkMVSphere.material = new THREE.MeshBasicMaterial({
            color: 0x073454,
            side: THREE.BackSide
        });
        lowerTeethTweenRotationDown.stop();
        lowerTeethTweenRotationUp.stop();
        lowerTeethTweenPositionDown.stop();
        lowerTeethTweenPositionUp.stop();
        upperTeethTweenRotationDown.stop();
        upperTeethTweenRotationUp.stop();
        lowerTeethTweenPositionBack = new TWEEN.Tween(mainSceneLinkMVLowerTeeth.position)
            .to({
                y: -15
            }, 200).start();
        lowerTeethTweenRotationBack = new TWEEN.Tween(mainSceneLinkMVLowerTeeth.rotation)
            .to({
                x: 0.2
            }, 200).start();
        upperTeethTweenRotationBack = new TWEEN.Tween(mainSceneLinkMVUpperTeeth.rotation)
            .to({
                x: 0
            }, 200).start();
    }
}
