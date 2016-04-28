function cgSceneDiscover2() {
	cgSceneStopAnimations();
 	setMaterial();

	//Content & Gui
	$('#content').load("content/cg/cgSceneDiscover2.html", function() {
		cgSceneDiscover2Gui = new dat.GUI({
			autoPlace: false,
			width: 400
		});

		var customContainer = document.getElementById('cgDiscover2Gui');
		customContainer.appendChild(cgSceneDiscover2Gui.domElement);
		var bumpScale = cgSceneDiscover2Gui.add(parameters2, 'bumpScale', 0, 4).listen().name('Bump Effect');
		var shininess = cgSceneDiscover2Gui.add(parameters2, 'shininess', 0, 20).listen().name('Shine Effect');
		var cloudsOpacity = cgSceneDiscover2Gui.add(parameters2, 'cloudsOpacity', 0, 1).listen().name('Clouds Opacity');
		var glowOpacity = cgSceneDiscover2Gui.add(parameters2, 'glowOpacity', 0, 1).listen().name('Glow Opacity');
		cgSceneDiscover2Gui.add(parameters2, 'reset').name("Reset Material Parameters");
		var nightMode = cgSceneDiscover2Gui.add(parameters2, 'nightMode').listen().name('Night Mode')

		bumpScale.onChange(function(value) {
			cgSceneMoon.material.bumpScale = value;
			cgSceneEarth.material.bumpScale = value;
		});
		shininess.onChange(function(value) {
			cgSceneEarth.material.shininess = value;
		});
		cloudsOpacity.onChange(function(value) {
			cgSceneClouds.material.opacity = value;
		});
		glowOpacity.onChange(function(value) {
			cgSceneGlow.material.opacity = value;
		});
		nightMode.onChange(function(value) {
			if (value == true) {
				cgSceneEarth.material.map = THREE.ImageUtils.loadTexture('materials/earthlights1k.jpg');
				cgSceneClouds.material.map = THREE.ImageUtils.loadTexture('materials/earthcloudmapdark.png');
				cgSceneSpotLight.position.set(-527, 131, 510);
				cgSceneEarth.material.specular = new THREE.Color(0x15172B);
			}
			if (value == false) {
				cgSceneEarth.material.map = THREE.ImageUtils.loadTexture('materials/earthmap1k.jpg');
				cgSceneClouds.material.map = THREE.ImageUtils.loadTexture('materials/earthcloudmap.png');
				cgSceneSpotLight.position.set(-40, 50, 450);
				cgSceneEarth.material.specular = new THREE.Color(0xA9A9A9);
			}
		});
	});
	cgSceneDiscover2Animate();
}

function cgSceneDiscover2Animate(){
	cloudsTweenRotation.start();
}