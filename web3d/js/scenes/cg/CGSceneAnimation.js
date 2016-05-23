function initCGSceneAnimations() {
    cloudsTweenRotation = new TWEEN.Tween(cgSceneClouds.rotation)
        .to({
            y: Math.PI * 2
        }, 450000)
        .onComplete(function() {
            cgSceneClouds.rotation.y = 0;
        }).easing(TWEEN.Easing.Linear.None);
    cloudsTweenRotation.chain(cloudsTweenRotation);

    earthTweenRotation = new TWEEN.Tween(cgSceneEarth.rotation)
        .to({
            y: Math.PI * 2
        }, 100000)
        .onComplete(function() {
            cgSceneEarth.rotation.y = 0;
            cgSceneRotateEarth(speed);
        }).easing(TWEEN.Easing.Linear.None);

    moonTweenRotation = new TWEEN.Tween(cgSceneMoon.rotation)
        .to({
            x: Math.PI * 2
        }, 8000)
        .onComplete(function() {
            cgSceneMoon.rotation.x = 0;
            cgSceneRotateMoon(speed);
        }).easing(TWEEN.Easing.Linear.None);

    moonTweenOrbitRotation = new TWEEN.Tween(cgSceneMoonCenter.rotation)
        .to({
            x: Math.PI * 2
        }, 3000)
        .onComplete(function() {
            cgSceneMoonCenter.rotation.x = 0;
            cgSceneRotateOrbit(speed);
        }).easing(TWEEN.Easing.Linear.None);
}

function cgSceneRotateEarth(speed) {

    earthTweenRotation.stop();										//Stoppe die Rotation der Erde
   
    var startRotation = cgSceneEarth.rotation.y; 					//Speichere die momentane Rotation der Erde ab
    earthTweenRotation = new TWEEN.Tween(cgSceneEarth.rotation)    //Erstelle eine neue Rotationsanimation. Diese...

        .to({
            y: Math.PI * 2 + startRotation 							// dreht die Erde um 360 Grad um ihre y-Achse und
        }, 100000 / speed) 											//... dauert (100000/speed) Millisekunden an, wobei (0.1 <= speed <= 5)
        .onComplete(function() { 									// Nach einer Drehung...
            cgSceneEarth.rotation.y = startRotation;  				//...wird der Rotationswert wieder zurück gesetzt (nicht sichtbar).
        }).easing(TWEEN.Easing.Linear.None);						// Die Animation läuft linear ab.
    earthTweenRotation.chain(earthTweenRotation);      				//Nach der Animation, wiederhole sie (Loop) 
    earthTweenRotation.start();										//Start der Animation
}

function cgSceneRotateMoon(speed) {
    moonTweenRotation.stop();
    var startRotation = cgSceneMoon.rotation.x;

    moonTweenRotation = new TWEEN.Tween(cgSceneMoon.rotation)
        .to({
            x: Math.PI * 2 + startRotation
        }, 8000 / speed)
        .onComplete(function() {
            cgSceneMoon.rotation.x = startRotation;
        }).easing(TWEEN.Easing.Linear.None);
    moonTweenRotation.chain(moonTweenRotation);
    moonTweenRotation.start();

}


function cgSceneRotateOrbit(speed) {
    moonTweenOrbitRotation.stop();
    var startRotation = cgSceneMoonCenter.rotation.z;

    moonTweenOrbitRotation = new TWEEN.Tween(cgSceneMoonCenter.rotation)
        .to({
            z: Math.PI * 2 + startRotation
        }, 3000 / speed)
        .onComplete(function() {
            cgSceneMoonCenter.rotation.z = startRotation;
        }).easing(TWEEN.Easing.Linear.None);
    moonTweenOrbitRotation.chain(moonTweenOrbitRotation);
    moonTweenOrbitRotation.start();

}


function cgSceneStopAnimations() {
    //reset Moon
    moonTweenRotation.stop();
    moonTweenOrbitRotation.stop();
    cgSceneMoon.rotation.x = 0;
    cgSceneMoonCenter.rotation.z = 0;

    //reset Earth
    earthTweenRotation.stop()
    cgSceneEarth.rotation.x = 0;
    cgSceneClouds.rotation.x = 0;
    cloudsTweenRotation.stop()
}
