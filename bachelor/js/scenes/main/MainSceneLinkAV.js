var mainSceneLinkAV, mainSceneLinkAVSphere, mainSceneLinkAVText, mainSceneLinkAVLisa;
var hoveredAV = false;

function initMainSceneLinkAV() {
    mainSceneLinkAV = new THREE.Object3D();

    //Text
    var textAV = new THREE.TextGeometry("ACTIVE VISION", {
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
    mainSceneLinkAVText = new THREE.Mesh(textAV, material);

    textAV.computeBoundingBox();
    var centerOffset = -0.5 * (textAV.boundingBox.max.x - textAV.boundingBox.min.x);
    mainSceneLinkAVText.position.x = centerOffset;
    mainSceneLinkAVText.position.y = -5;
    var geometry = new THREE.BoxGeometry(
        textAV.boundingBox.max.x,
        textAV.boundingBox.max.y,
        textAV.boundingBox.max.z
    );
    var material = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0
    });
    mainSceneLinkAVTextVolume = new THREE.Mesh(geometry, material);
    mainSceneLinkAVTextVolume.position.set(-2 * centerOffset, 0, 0);
    mainSceneLinkAVTextVolume.add(mainSceneLinkAVText);

    //Stripe
    var loader = new THREE.JSONLoader();
    loader.load("models/stripe.json", function(geometry) {
        var material = new THREE.MeshPhongMaterial({
            color: 0xED4F00,
            emissive: 0xFF470A,
            specular: 0x000000,
            shininess: 6
        });
        var mainSceneLinkAVLine = new THREE.Mesh(geometry, material);
        mainSceneLinkAVLine.position.set(-2, -10, -0);
        mainSceneLinkAVLine.scale.set(1.45, 0.25, 0.05);
        mainSceneLinkAVTextVolume.add(mainSceneLinkAVLine);
    });

    //Sphere
    var geometry = new THREE.SphereGeometry(30, 30, 30);
    var material = new THREE.MeshBasicMaterial({
        color: 0x073454,
        side: THREE.BackSide
    });
    mainSceneLinkAVSphere = new THREE.Mesh(geometry, material);

    mainSceneLinkAVSphere.position.set(-270, 20, -10);
    mainSceneLinkAVSphere.scale.set(0.8, 0.8, 0.8);
    mainSceneLinkAVSphere.rotation.set(0, 0.1, 0);

    mainSceneLinkAVSphere.add(mainSceneLinkAV);
    mainSceneLinkAVSphere.add(mainSceneLinkAVTextVolume);
    mainSceneLinks.add(mainSceneLinkAVSphere);

    //Lisa
    var loader = new THREE.ObjectLoader();
    loader.load("models/lisamin.json", function(obj) {
        mainSceneLinkAVLisa = obj;
        mainSceneLinkAVSphere.add(mainSceneLinkAVLisa);
        mainSceneLinkAVLisa.rotation.set(0, Math.PI / 2, 0);
        mainSceneLinkAVLisa.scale.set(0.4, 0.4, 0.4);
        mainSceneLinkAVLisa.position.set(0, -20, 0)
    });

}

function mainSceneLinkAVAnimate() {
    if (hoveredAV == false) {
        hoveredAV = true;
        mainSceneLinkAVText.material = mainSceneLinkTextMaterialHovered;
        mainSceneLinkAVSphere.material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.BackSide
        });

        lisaTweenRotation = new TWEEN.Tween(mainSceneLinkAVLisa.rotation)
            .to({
                y: Math.PI * 2 + Math.PI / 2
            }, 1000)
            .onComplete(function() {
                mainSceneLinkAVLisa.rotation.y = Math.PI / 2;
            });

        lisaTweenRotation.chain(lisaTweenRotation);
        lisaTweenRotation.start();
    }
}


function mainSceneLinkAVAnimateBack() {
    if (hoveredAV == true) {
        hoveredAV = false;

        mainSceneLinkAVText.material = mainSceneLinkTextMaterial;

        mainSceneLinkAVSphere.material = new THREE.MeshBasicMaterial({
            color: 0x073454,
            side: THREE.BackSide
        });
        lisaTweenRotation.stop();
        lisaTweenRotationBack = new TWEEN.Tween(mainSceneLinkAVLisa.rotation)
            .to({
                y: Math.PI / 2
            }, 400)
            .onComplete(function() {
                mainSceneLinkAVLisa.rotation.y = Math.PI/2;
            });
        lisaTweenRotationBack.start();

    }
}
