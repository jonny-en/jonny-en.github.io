var mainSceneLinks, mainSceneLinkTextMaterial, mainSceneLinkTextMaterialHovered;

function initMainSceneLinks() {
    mainSceneLinks = new THREE.Object3D();
    mainSceneLinkTextMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0x074271,
        specular: 0x074271,
        shininess: 1
    });
    mainSceneLinkTextMaterialHovered = new THREE.MeshPhongMaterial({
        color: 0x000000,
        emissive: 0x000000,
        specular: 0x000000,
        shininess: 0
    });
    initMainSceneLinkAbout();
    initMainSceneLinkCG();
    initMainSceneLinkAV();
    initMainSceneLinkMV();
    mainScene.add(mainSceneLinks);
}

function hoverMainSceneLinks() {
    var intersects = raycaster.intersectObjects([mainSceneLinkAboutSphere, mainSceneLinkAboutTextVolume,
        mainSceneLinkCGTextVolume, mainSceneLinkCGSphere,
        mainSceneLinkAVSphere, mainSceneLinkAVTextVolume,
        mainSceneLinkMVSphere, mainSceneLinkMVTextVolume
    ]);
    if (intersects.length > 0) {
        window[getAnimationFuncByObject(intersects[0].object.userData.animationNr)]();
    } else {
        mainSceneLinkCGAnimateBack();
        mainSceneLinkAboutAnimateBack();
        mainSceneLinkAVAnimateBack();
        mainSceneLinkMVAnimateBack();
    }
}

//finds out, which link is clicked.
function clickableLinks() {
    var intersects = raycaster.intersectObjects([mainSceneLinkAboutSphere, mainSceneLinkAboutTextVolume,
        mainSceneLinkCGTextVolume, mainSceneLinkCGSphere,
        mainSceneLinkAVSphere, mainSceneLinkAVTextVolume,
        mainSceneLinkMVSphere, mainSceneLinkMVTextVolume
    ]);
    if (intersects.length > 0) {
        //switch off user controls
        cameraFixed = false;
        $('#content').empty();

        //fly back when clicked on the about link
        if (intersects[0].object == mainSceneLinkAboutSphere || intersects[0].object == mainSceneLinkAboutTextVolume) {
            goBackToAbout();
            cameraFixed = true;
        } else {
            //else fly to sphere and stop animations
            window[getStopAnimationFuncByObject(intersects[0].object.userData.animationNr)]();
            flyToMainSceneLink(getSphereByObject(intersects[0].object.userData.animationNr));
        }
    }
}

//Is called by clickableLinks() and sets the scene change in motion.
function flyToMainSceneLink(sphere) {
    //switch off user control
    cameraFixed = false;

    //Start position animation to sphere. As soon as the animation has finished, change the scene.
    var animatePosition = new TWEEN.Tween(camera.position).to({
            x: sphere.position.x,
            y: sphere.position.y,
            z: sphere.position.z
        }, 2000)
        .easing(TWEEN.Easing.Circular.InOut)
        .onComplete(function() {
            //calls function changeScene(newSceneNrs) according to the clicked sphere   
            changeScene(sphere.userData.sceneNr);
        })
        .start();

    //Start viewing direction animation to sphere
    var animateTarget = new TWEEN.Tween(camera.target).to({
            x: sphere.position.x,
            y: sphere.position.y,
            z: sphere.position.z
        }, 1200)
        .easing(TWEEN.Easing.Circular.Out)
        .start();
}

function getAnimationFuncByObject(nr) {
    var map = {
        0: 'mainSceneLinkAboutAnimate',
        1: 'mainSceneLinkCGAnimate',
        2: 'mainSceneLinkAVAnimate',
        3: 'mainSceneLinkMVAnimate'
    };
    return map[nr];
}

function getStopAnimationFuncByObject(nr) {
    var map = {
        1: 'mainSceneLinkCGAnimateStop',
        2: 'mainSceneLinkAVAnimateStop',
        3: 'mainSceneLinkMVAnimateStop'
    };
    return map[nr];
}

function getSphereByObject(nr) {
    var map = {
        1: mainSceneLinkCGSphere,
        2: mainSceneLinkAVSphere,
        3: mainSceneLinkMVSphere
    };
    return map[nr];
}
