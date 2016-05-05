var mainSceneLinks;
var mainSceneLinkTextMaterial, mainSceneLinkTextMaterialHovered;

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
    var intersects = raycaster.intersectObjects(mainSceneLinks.children, true);
    if (intersects.length > 0) {
        if (intersects[0].object == mainSceneLinkAboutSphere || intersects[0].object == mainSceneLinkAboutText) {
            mainSceneLinkAboutAnimate();
        }
        if (intersects[0].object == mainSceneLinkCGSphere || intersects[0].object == mainSceneLinkCGText) {
            mainSceneLinkCGAnimate();
        }
        if (intersects[0].object == mainSceneLinkAVSphere || intersects[0].object == mainSceneLinkAVText) {
            mainSceneLinkAVAnimate();
        }
        if (intersects[0].object == mainSceneLinkMVSphere || intersects[0].object == mainSceneLinkMVText) {
            mainSceneLinkMVAnimate();
        }
    } else {
        mainSceneLinkCGAnimateBack();
        mainSceneLinkAboutAnimateBack();
        mainSceneLinkAVAnimateBack();
        mainSceneLinkMVAnimateBack();
    }
}

function clickableLinks() {

    var intersects = raycaster.intersectObjects([mainSceneLinkAboutSphere, mainSceneLinkAboutText, 
        mainSceneLinkCGText, mainSceneLinkCGSphere, 
        mainSceneLinkAVSphere, mainSceneLinkAVText,
        mainSceneLinkMVSphere, mainSceneLinkMVText]);
    if (intersects.length > 0) {

        cameraFixed = false;
        $('#content').empty();

        //About Link
        if (intersects[0].object == mainSceneLinkAboutSphere || intersects[0].object == mainSceneLinkAboutText) {
            goBackToAbout();
             cameraFixed = true;
        }
        //CG Link
        if (intersects[0].object == mainSceneLinkCGSphere || intersects[0].object == mainSceneLinkCGText) {
            flyToMainSceneLink(mainSceneLinkCGSphere);
            moonTweenRotation.stop();
            earthTweenRotation.stop();
        }
        //AV Link
        if (intersects[0].object == mainSceneLinkAVSphere || intersects[0].object == mainSceneLinkAVText) {
            flyToMainSceneLink(mainSceneLinkAVSphere);
            lisaTweenRotation.stop();
        }
        //MV Link
        if (intersects[0].object == mainSceneLinkMVSphere || intersects[0].object == mainSceneLinkMVText) {
            flyToMainSceneLink(mainSceneLinkMVSphere);
            lowerTeethTweenRotationDown.stop();
            lowerTeethTweenRotationUp.stop();
            lowerTeethTweenPositionDown.stop();
            lowerTeethTweenPositionUp.stop();
            upperTeethTweenRotationDown.stop();
            upperTeethTweenRotationUp.stop();
        }
    }
}

function flyToMainSceneLink(sphere) {

    cameraFixed = false;
    var tween = new TWEEN.Tween(camera.position).to({
            x: sphere.position.x,
            y: sphere.position.y,
            z: sphere.position.z
        }, 2000)
        .easing(TWEEN.Easing.Circular.InOut)
        .onComplete(function() {
            if (sphere == mainSceneLinkCGSphere) {
                changeScene(mainScene, 'cg');
            }
            if (sphere == mainSceneLinkAVSphere) {
                changeScene(mainScene, 'av');
            }
            if (sphere == mainSceneLinkMVSphere) {
                changeScene(mainScene, 'mv');
            }
        })
        .start();

    var tween = new TWEEN.Tween(camera.target).to({
            x: sphere.position.x,
            y: sphere.position.y,
            z: sphere.position.z
        }, 1200)
        .easing(TWEEN.Easing.Circular.Out)
        .start();

}
