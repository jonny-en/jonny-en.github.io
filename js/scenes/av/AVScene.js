var avScene, avSceneFloor, avSceneBox;
var avSceneSpotLight, avSceneAmbientLight;
var avSceneLisa, avSceneLisaCamera;

var avSceneDiscoverNr = 3;
var avSceneDiscover1Gui;
var avSceneSky, avSceneSun;

var avdlight = THREE.AmbientLight(0x404040);

var avSceneCopyPass;
var dotScreenEffect;
var edgeEffect;
var colorCorrectionEffect;
var blackWhiteEffect;
var brightnessContrastEffect;


var filterParameters = {
    edgeFilter: false,
    bc: new THREE.Vector2(0.0, 0.0),
    colorCorrectionFilter: false,
    blackWhiteFilter: false,
    dotFilter: false,
    rgbShift: false,
};

function initAVScene() {
    //Content
    $('#description').text("Prof. Dr.-Ing. Dietrich Paulus");
    $('#page-title').text("AKTIVES SEHEN");
    $('#content').load('content/av/avSceneStart.html');
    //Scene
    renderer.setClearColor(0x000000);

    avScene = new THREE.Scene();
    scene.add(avScene);
    //Camera
    camera.position.set(0, 250, 450);
    camera.position.y += 125;
    camera.fov = 60;
    cameraFixed = true;
    camera.updateProjectionMatrix();

    //Lisa Camera
    avSceneLisaCamera = new THREE.PerspectiveCamera(100, WIDTH / 2 * HEIGHT, 5, 600000);
    avSceneLisaCamera.position.set(0, 108, -12);
    avSceneLisaCamera.lookAt(new THREE.Vector3(0, 60, 80));


    //Lisa
    var lisaloader = new THREE.ObjectLoader();
    lisaloader.load("models/lisa.json", function(obj) {
        avSceneLisa = obj;
        avScene.add(avSceneLisa);
        avSceneLisa.scale.set(1, 1, 1);
        avSceneLisa.rotation.y = Math.PI / 2 - 0.5;
        avSceneLisa.position.set(0, 0.5, -200);
        avSceneLisa.receiveShadow = true;
        avSceneLisa.castShadow = true;
        avSceneLisa.add(avSceneLisaCamera);
        camera.target = avSceneLisa.position;

    });

    //Sky
    avSceneSky = new THREE.Sky();
    avSceneSun = new THREE.Mesh(
        new THREE.SphereBufferGeometry(20000, 16, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    avSceneSun.position.y = -700000;
    avSceneSun.visible = false;

    var uniforms = avSceneSky.uniforms;
    uniforms.turbidity.value = 1;
    uniforms.reileigh.value = 0.1;
    uniforms.luminance.value = 0.8;
    uniforms.mieCoefficient.value = 0.0;
    uniforms.mieDirectionalG.value = 0.75;

    var theta = Math.PI * (0.23 - 0.5);
    var phi = 2 * Math.PI * (0.35 - 0.5);
    var distance = 400000;

    avSceneSun.position.x = distance * Math.cos(phi);
    avSceneSun.position.y = distance * Math.sin(phi) * Math.sin(theta);
    avSceneSun.position.z = distance * Math.sin(phi) * Math.cos(theta);

    avSceneSky.uniforms.sunPosition.value.copy(avSceneSun.position);
    avScene.add(avSceneSun);

    avScene.add(avSceneSky.mesh);
    avScene.add(avSceneSun);

    //PostProcessing

    composer = new THREE.EffectComposer(renderer);

    dotScreenEffect = new THREE.ShaderPass(THREE.DotScreenShader);
    edgeEffect = new THREE.ShaderPass(THREE.EdgeShader2);
    colorCorrectionEffect = new THREE.ShaderPass(THREE.ColorCorrectionShader);
    blackWhiteEffect = new THREE.ShaderPass(THREE.ColorifyShader);
    brightnessContrastEffect = new THREE.ShaderPass(THREE.BrightnessContrastShader);

    avSceneCopyPass = new THREE.ShaderPass(THREE.CopyShader);
    composer.addPass(new THREE.RenderPass(scene, avSceneLisaCamera));
    composer.addPass(avSceneCopyPass);
    avSceneCopyPass.renderToScreen = true;

    //add PostProcessing which should be shown at Start of Discover1
    composer.insertPass(brightnessContrastEffect, composer.passes.length - 1);


    //Light
    avSceneSpotLight = new THREE.SpotLight(0xffffff);
    avSceneSpotLight.position.set(-300, 1000, 300);
    avSceneSpotLight.target.position.set(0, 0, 0);
    avSceneSpotLight.intensity = 1;
    avScene.add(avSceneSpotLight);
    avSceneSpotLight.castShadow = true;
    avSceneSpotLight.shadow.camera.near = 500;
    avSceneSpotLight.shadow.camera.far = 2000;
    avSceneSpotLight.shadow.camera.fov = 50;
    avSceneSpotLight.shadow.bias = 0.001;
    avSceneSpotLight.shadow.mapSize.width = 2048;
    avSceneSpotLight.shadow.mapSize.height = 1024;

    var avSceneAmbientLight = new THREE.AmbientLight(0x404040);
    avScene.add(avSceneAmbientLight);

    //Floor
    var loader = new THREE.TextureLoader();
    var maxAnisotropy = renderer.getMaxAnisotropy();
    var textureDif = loader.load('materials/redsand/diffuse.png');
    textureDif.anisotropy = maxAnisotropy;
    textureDif.wrapS = THREE.RepeatWrapping;
    textureDif.wrapT = THREE.RepeatWrapping;
    textureDif.repeat.set(2, 2);
    textureDif.magFilter = THREE.NearestFilter;
    textureDif.minFilter = THREE.LinearMipMapLinearFilter;
    var textureNorm = loader.load('materials/redsand/normal.png');
    textureNorm.anisotropy = maxAnisotropy;
    textureNorm.wrapS = THREE.RepeatWrapping;
    textureNorm.wrapT = THREE.RepeatWrapping;
    textureNorm.repeat.set(2, 2);
    var textureSpec = loader.load('materials/redsand/specular.png');
    textureSpec.anisotropy = maxAnisotropy;
    textureSpec.wrapS = THREE.RepeatWrapping;
    textureSpec.wrapT = THREE.RepeatWrapping;
    textureSpec.repeat.set(2, 2);
    material = new THREE.MeshPhongMaterial({
        map: textureDif,
        normalMap: textureNorm,
        specularMap: textureSpec,
        shininess: 100
    });
    geometry = new THREE.PlaneGeometry(600, 600);
    avSceneFloor = new THREE.Mesh(geometry, material);
    avSceneFloor.position.set(0, 0, -200);
    avSceneFloor.receiveShadow = true;
    avSceneFloor.rotation.x = -Math.PI / 2;
    avScene.add(avSceneFloor);

    //Wooden Box
    var boxDif = loader.load('materials/wood/diffuse.png');
    boxDif.anisotropy = maxAnisotropy;
    var boxNorm = loader.load('materials/wood/normal.png');
    boxNorm.anisotropy = maxAnisotropy;
    var boxSpecular = loader.load('materials/wood/specular.png');
    boxSpecular.anisotropy = maxAnisotropy;

    material = new THREE.MeshPhongMaterial({
        map: boxDif,
        normalMap: boxNorm,
        specular: boxSpecular,
        shininess: 10
    });

    geometry = new THREE.CylinderBufferGeometry(25, 25, 60, 20);
    avSceneBox = new THREE.Mesh(geometry, material);
    avSceneBox.position.set(200, 70, -300);
    avScene.add(avSceneBox);
    avSceneBox.receiveShadow = true;
    avSceneBox.castShadow = true;

    //Lemon Ball
    var sphereDif = loader.load('materials/firestone/diffus.png');
    sphereDif.anisotropy = maxAnisotropy;
    var sphereNorm = loader.load('materials/firestone/normal.png');
    sphereNorm.anisotropy = maxAnisotropy;
    var sphereEmissive = loader.load('materials/firestone/emissive.png');
    sphereEmissive.anisotropy = maxAnisotropy;
    var sphereSpecular = loader.load('materials/firestone/specular.png');
    sphereSpecular.anisotropy = maxAnisotropy;
    material = new THREE.MeshPhongMaterial({
        map: sphereDif,
        normalMap: sphereNorm,
        emissiveMap: sphereEmissive,
        specularMap: sphereSpecular,
        shininess: 40
    });

    geometry = new THREE.SphereGeometry(25, 30, 30);
    avSceneSphere = new THREE.Mesh(geometry, material);
    avSceneSphere.position.set(200, 70, -50);
    avScene.add(avSceneSphere);
    avSceneSphere.receiveShadow = true;
    avSceneSphere.castShadow = true;
    avSceneSphere.rotation.y = Math.PI / 2;
    //Tricot Torus
    var torusDif = loader.load('materials/stone/diffuse.png');
    torusDif.anisotropy = maxAnisotropy;
    var torusNorm = loader.load('materials/stone/normal.png');
    torusNorm.anisotropy = maxAnisotropy;
    var torusSpec = loader.load('materials/stone/specular.png');
    torusSpec.anisotropy = maxAnisotropy;
    material = new THREE.MeshPhongMaterial({
        map: torusDif,
        normalMap: torusNorm,
        shininess: 120
    });

    geometry = new THREE.TorusKnotGeometry(20, 8, 100, 16);
    avSceneTorus = new THREE.Mesh(geometry, material);
    avSceneTorus.position.set(200, 70, -175);
    avScene.add(avSceneTorus);
    avSceneTorus.receiveShadow = true;
    avSceneTorus.castShadow = true;

}

//Keyboard
function avSceneKeyboard(delta, nodww) {
    if (avSceneDiscoverNr === 2) {
        if (keyboard.pressed('left') || keyboard.pressed('a')) {
            avSceneDiscover2Lisa.rotation.y += 3 * delta;
            if (avSceneDiscover2Lisa.rotation.y >= 1.0001 * Math.PI) {
                avSceneDiscover2Lisa.rotation.y -= 2 * Math.PI;
            }
        } else if (keyboard.pressed('right') || keyboard.pressed('d')) {
            avSceneDiscover2Lisa.rotation.y -= 3 * delta;
            if (avSceneDiscover2Lisa.rotation.y <= -1.5 * Math.PI) {
                avSceneDiscover2Lisa.rotation.y += 2 * Math.PI;
            }
        }
        if (keyboard.pressed('up') || keyboard.pressed('w')) {
            if (!(avSceneDiscover2Lisa.position.z >= 200 && avSceneDiscover2Lisa.rotation.y > -Math.PI * 0.5 && avSceneDiscover2Lisa.rotation.y < Math.PI * 0.5) &&
                !(avSceneDiscover2Lisa.position.z <= -200 && !(avSceneDiscover2Lisa.rotation.y > -Math.PI * 0.5 && avSceneDiscover2Lisa.rotation.y < Math.PI * 0.5)) &&
                !(avSceneDiscover2Lisa.position.x >= 200 && !(avSceneDiscover2Lisa.rotation.y < 0 && avSceneDiscover2Lisa.rotation.y > -Math.PI)) &&
                !(avSceneDiscover2Lisa.position.x <= -200 && avSceneDiscover2Lisa.rotation.y < 0 && avSceneDiscover2Lisa.rotation.y > -Math.PI)) {
                avSceneDiscover2Lisa.translateZ(+80 * delta);
            }
        } else if (keyboard.pressed('down') || keyboard.pressed('s')) {
            if (!(avSceneDiscover2Lisa.position.z >= 200 && !(avSceneDiscover2Lisa.rotation.y > -Math.PI * 0.5 && avSceneDiscover2Lisa.rotation.y < Math.PI * 0.5)) &&
                !(avSceneDiscover2Lisa.position.z <= -200 && (avSceneDiscover2Lisa.rotation.y > -Math.PI * 0.5 && avSceneDiscover2Lisa.rotation.y < Math.PI * 0.5)) &&
                !(avSceneDiscover2Lisa.position.x >= 200 && (avSceneDiscover2Lisa.rotation.y < 0 && avSceneDiscover2Lisa.rotation.y > -Math.PI)) &&
                !(avSceneDiscover2Lisa.position.x <= -200 && !(avSceneDiscover2Lisa.rotation.y < 0 && avSceneDiscover2Lisa.rotation.y > -Math.PI))) {
                avSceneDiscover2Lisa.translateZ(-80 * delta);
            }
        }
    } else {
        if (keyboard.pressed('left') || keyboard.pressed('a')) {
            avSceneLisa.rotation.y += 3 * delta;
            if (avSceneLisa.rotation.y >= 1.0001 * Math.PI) {
                avSceneLisa.rotation.y -= 2 * Math.PI;
            }
        } else if (keyboard.pressed('right') || keyboard.pressed('d')) {
            avSceneLisa.rotation.y -= 3 * delta;
            if (avSceneLisa.rotation.y <= -1.5 * Math.PI) {
                avSceneLisa.rotation.y += 2 * Math.PI;
            }
        }
        if (keyboard.pressed('up') || keyboard.pressed('w')) {
            if (lisaMovableForward) {
                avSceneLisa.translateZ(+80 * delta);
            }
        } else if (keyboard.pressed('down') || keyboard.pressed('s')) {
            if (lisaMovableBackwards) {
                avSceneLisa.translateZ(-80 * delta);
            }
        }
    }
}

function lisaMovableForward() {
    return (!(avSceneLisa.position.z >= 70 && avSceneLisa.rotation.y > -Math.PI * 0.5 && avSceneLisa.rotation.y < Math.PI * 0.5) &&
        !(avSceneLisa.position.z <= -430 && !(avSceneLisa.rotation.y > -Math.PI * 0.5 && avSceneLisa.rotation.y < Math.PI * 0.5)) &&
        !(avSceneLisa.position.x >= 130 && !(avSceneLisa.rotation.y < 0 && avSceneLisa.rotation.y > -Math.PI)) &&
        !(avSceneLisa.position.x <= -235 && avSceneLisa.rotation.y < 0 && avSceneLisa.rotation.y > -Math.PI));
}

function lisaMovableBackwards() {
    return (!(avSceneLisa.position.z >= 70 && !(avSceneLisa.rotation.y > -Math.PI * 0.5 && avSceneLisa.rotation.y < Math.PI * 0.5)) &&
        !(avSceneLisa.position.z <= -430 && (avSceneLisa.rotation.y > -Math.PI * 0.5 && avSceneLisa.rotation.y < Math.PI * 0.5)) &&
        !(avSceneLisa.position.x >= 130 && (avSceneLisa.rotation.y < 0 && avSceneLisa.rotation.y > -Math.PI)) &&
        !(avSceneLisa.position.x <= -235 && !(avSceneLisa.rotation.y < 0 && avSceneLisa.rotation.y > -Math.PI)));
}

function renderAvScene() {
    renderer.autoClear = true;
    window[getRenderMethodByDiscoverNr(avSceneDiscoverNr)]();
}

function getRenderMethodByDiscoverNr(number) {
    var renderFunction = {
        0: 'avSceneRender0',
        1: 'avSceneRender1',
        2: 'avSceneRender2',
        3: 'avSceneRenderElse',
    }
    return renderFunction[number];
}

function avSceneRender0() {
    if (video_ready) {
        updateSize();
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            //Zeichne das Webcambild 
            videoContext.drawImage(video, 0, 0, videoCanvas.width, videoCanvas.height);
            //Zeichne die Bedienfelder darüber
            for (var i = 0; i < buttons.length; i++){
                layer2Context.drawImage(buttons[i].image, buttons[i].x, buttons[i].y, buttons[i].w, buttons[i].h);
            }
            //Berechne das Differenzbild
            blend();
            //Erkenne eine Bewegung und führe eine entsprechende Reaktion aus
            checkAreas();
            //Zeichne die Szene
            renderer.render(scene, camera);
        }
    }
}

function avSceneRender1() {
    //update window size and set variables
    updateSize();
    var left = 0;
    var bottom = 0;
    var halfWidth = Math.floor(WIDTH * 0.5);

    renderer.setScissorTest(true);

    //Setze den Viewport für Lisas Kamera
    renderer.setViewport(halfWidth, bottom, halfWidth, HEIGHT);
    renderer.setScissor(halfWidth, bottom, WIDTH, HEIGHT);
    //Setze Kameraparameter anhand der Fenstergröße
    avSceneLisaCamera.aspect = halfWidth / HEIGHT;
    avSceneLisaCamera.updateProjectionMatrix();
    //Zeichne Lisas Sicht
    composer.render();

    //Setze den Viewport für die Standardkamera
    renderer.setViewport(left, bottom, halfWidth, HEIGHT);
    renderer.setScissor(left, bottom, halfWidth, HEIGHT);

    //Setze Kameraparameter anhand der Fenstergröße
    camera.aspect = halfWidth / HEIGHT;
    camera.updateProjectionMatrix();
    //Zeichne die Standardsicht
    renderer.render(scene, camera);
}

function avSceneRender2() {
    if (video_ready2) {
        renderer.autoClear = false;
        renderer.clear(true, true, true);
        renderer.render(videoScene, videoCam);
        renderer.render(avDiscover2Scene, avDiscover2Camera);
        loop();
    }
}


function avSceneRenderElse() {
    renderer.render(scene, camera);
}
