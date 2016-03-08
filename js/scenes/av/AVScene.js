var avScenePositionX = 0,
    avScenePositionY = -3000;

var avScene, avSceneLight, avSceneLight2, avSceneFloor, avSceneLisa, avScenePyramid, avSceneSphere;
var avSceneSpotLight, avSceneSpotLight2;

function initAVScene() {
    renderer.setClearColor(0x000000);
    $('#description').text("Prof. Dr.-Ing. Dietrich Paulus");
    $('#pageTitle').text("ACTIVE VISION");
    $('#content').empty();

    avScene = new THREE.Scene();
    avScene.position = (avScenePositionX, avScenePositionY, 0);
    scene.add(avScene);
    camera.position.set(avScenePositionX, avScenePositionY, 450);
    camera.target = avScene.position;
    cameraFixed = true;

    //Light
    avSceneSpotLight = new THREE.SpotLight(0xffffff);
    avSceneSpotLight.position.set(100, 1000, 100);
    avSceneSpotLight.intensity = 1;
    avScene.add(avSceneSpotLight);
    avSceneSpotLight.castShadow = true;
    avSceneSpotLight.shadow.camera.near = 500;
    avSceneSpotLight.shadow.camera.far = 4000;
    avSceneSpotLight.shadow.camera.fov = 200;
    avSceneSpotLight.shadow.bias = 0.0001;
    avSceneSpotLight.shadow.mapSize.width = 2048;
    avSceneSpotLight.shadow.mapSize.height = 2048;

    avSceneSpotLight2 = new THREE.SpotLight(0xffffff);
    avSceneSpotLight2.position.set(-100, 1000, -100);
    avSceneSpotLight2.intensity = 0.2;
    avScene.add(avSceneSpotLight2);
    avSceneSpotLight2.castShadow = true;
    avSceneSpotLight2.shadow.camera.near = 500;
    avSceneSpotLight2.shadow.camera.far = 4000;
    avSceneSpotLight2.shadow.camera.fov = 200;
    avSceneSpotLight2.shadow.bias = 0.0001;
    avSceneSpotLight2.shadow.mapSize.width = 2048;
    avSceneSpotLight2.shadow.mapSize.height = 2048;


    //Lisa
    var lisaloader = new THREE.ObjectLoader();
    lisaloader.load("models/lisa.json", function(obj) {
        avSceneLisa = obj;
        avScene.add(avSceneLisa);
        avSceneLisa.scale.set(1, 1, 1);
        avSceneLisa.position.set(0, -99, -200);
        avSceneLisa.receiveShadow = true;
        avSceneLisa.castShadow = true;
    });

    //Floor
    var loader = new THREE.TextureLoader();
    var maxAnisotropy = renderer.getMaxAnisotropy();
    var textureDif = loader.load('materials/avDIFFUSE2.jpg');
    textureDif.anisotropy = maxAnisotropy;
    textureDif.wrapS = THREE.RepeatWrapping;
    textureDif.wrapT = THREE.RepeatWrapping;
    textureDif.repeat.set(6, 6);
    textureDif.magFilter = THREE.NearestFilter;
    textureDif.minFilter = THREE.LinearMipMapLinearFilter;
    var textureNorm = loader.load('materials/avNORMAL2.jpg');
    textureNorm.anisotropy = maxAnisotropy;
    textureNorm.wrapS = THREE.RepeatWrapping;
    textureNorm.wrapT = THREE.RepeatWrapping;
    textureNorm.repeat.set(6, 6);
    var textureDisp = loader.load('materials/avDISP2.jpg');
    textureDisp.anisotropy = maxAnisotropy;
    textureDisp.wrapS = THREE.RepeatWrapping;
    textureDisp.wrapT = THREE.RepeatWrapping;
    textureDisp.repeat.set(6, 6);
    material = new THREE.MeshPhongMaterial({
        map: textureDif,
        normalMap: textureNorm,
        displacementMap: textureDisp,
        shininess: 30
    });
    geometry = new THREE.BoxGeometry(600, 1, 600);
    avSceneFloor = new THREE.Mesh(geometry, material);
    avSceneFloor.position.set(0, -100, -200);
    avSceneFloor.receiveShadow = true;
    avScene.add(avSceneFloor);


    var material = new THREE.MeshPhongMaterial({
        color: 0xFC8E11,
        emissive: 0xFF470A,
        normalMap: textureNorm
    });
    geometry = new THREE.BoxGeometry(50, 50, 50);
    avSceneSphere = new THREE.Mesh(geometry, material);
    avSceneSphere.position.set(200, -30, -200)
    avScene.add(avSceneSphere);
     avSceneSphere.receiveShadow = true;
    avSceneSphere.castShadow = true;
}

//Keyboard
function avSceneKeyboard(delta, nodww) {
    if (keyboard.pressed('left') || keyboard.pressed('a')) {
        avSceneLisa.rotation.y += 3 * delta;
        if (avSceneLisa.rotation.y >= 1.0001 * Math.PI) {
            avSceneLisa.rotation.y -= 2 * Math.PI;
        }
    } else if (keyboard.pressed('right') || keyboard.pressed('d')) {
        avSceneLisa.rotation.y -= 3 * delta
        if (avSceneLisa.rotation.y <= -1.5 * Math.PI) {
            avSceneLisa.rotation.y += 2 * Math.PI;
        }
    }
    if (keyboard.pressed('up') || keyboard.pressed('w')) {
        if (!(avSceneLisa.position.z >= 70 && avSceneLisa.rotation.y > -Math.PI * 0.5 && avSceneLisa.rotation.y < Math.PI * 0.5) &&
            !(avSceneLisa.position.z <= -430 && !(avSceneLisa.rotation.y > -Math.PI * 0.5 && avSceneLisa.rotation.y < Math.PI * 0.5)) &&
            !(avSceneLisa.position.x >= 270 && !(avSceneLisa.rotation.y < 0 && avSceneLisa.rotation.y > -Math.PI)) &&
            !(avSceneLisa.position.x <= -270 && avSceneLisa.rotation.y < 0 && avSceneLisa.rotation.y > -Math.PI)) {
            avSceneLisa.translateZ(+80 * delta);
        }
    } else if (keyboard.pressed('down') || keyboard.pressed('s')) {
        if (!(avSceneLisa.position.z >= 70 && !(avSceneLisa.rotation.y > -Math.PI * 0.5 && avSceneLisa.rotation.y < Math.PI * 0.5)) &&
            !(avSceneLisa.position.z <= -430 && (avSceneLisa.rotation.y > -Math.PI * 0.5 && avSceneLisa.rotation.y < Math.PI * 0.5)) &&
            !(avSceneLisa.position.x >= 270 && (avSceneLisa.rotation.y < 0 && avSceneLisa.rotation.y > -Math.PI)) &&
            !(avSceneLisa.position.x <= -270 && !(avSceneLisa.rotation.y < 0 && avSceneLisa.rotation.y > -Math.PI))) {
            avSceneLisa.translateZ(-80 * delta);
        }
    }
}
