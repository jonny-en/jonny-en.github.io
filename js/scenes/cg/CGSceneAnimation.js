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
	earthTweenRotation.stop();
	var startRotation = cgSceneEarth.rotation.y;

	earthTweenRotation = new TWEEN.Tween(cgSceneEarth.rotation)
		.to({
			y: Math.PI * 2 + startRotation
		}, 100000 / speed)
		.onComplete(function() {
			cgSceneEarth.rotation.y = startRotation;
		}).easing(TWEEN.Easing.Linear.None);
		earthTweenRotation.chain(earthTweenRotation);
	earthTweenRotation.start();

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