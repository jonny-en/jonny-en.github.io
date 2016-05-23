function cgSceneDiscover1() {
	cgSceneStopAnimations();
	cgScene.add(cgSceneLight);
	cgSceneMoonCenter.add(cgSceneMoon);
	cgScene.add(cgSceneMoonCenter);
	cgScene.remove(cgSceneSpotLight);
	resetSphere();
	resetLight();
	cgScene.remove(axisHelper);
	cgSceneClouds.material = new THREE.MeshBasicMaterial({
		transparent: true,
		opacity: 0,
	});
	cgSceneEarth.geometry = new THREE.SphereGeometry(90, 22, 22);
	cgSceneEarth.material = new THREE.MeshPhongMaterial({
		metal: true,
		color: 0xbbbbbb,
		emissive: 0x000000,
		specular: 0xffffff,
		shininess: 0.5
	});
	cgSceneGlow.material.opacity = 0;

	//Moon
	cgSceneMoon.material = new THREE.MeshPhongMaterial({
		color: 0xFC8E11,
		transparent: true,
		opacity: 1
	});
	cgSceneLightSphere.material.opacity = 0.5;

	$('#content').load("content/cg/cgSceneDiscover1.html", function() {
		//GUI Discover1
		cgSceneDiscover1Gui = new dat.GUI({
			autoPlace: false,
			width: 450
		});

		var customContainer = document.getElementById('cgDiscover1Gui');
		customContainer.appendChild(cgSceneDiscover1Gui.domElement);

		var lightColor = cgSceneDiscover1Gui.addColor(parameters1, 'color');
		lightColor.onChange(function(value) {
			cgSceneLight.color = new THREE.Color(value);
			cgSceneLightSphere.material.color = new THREE.Color(value);
		});

		var intensity = cgSceneDiscover1Gui.add(parameters1, 'intensity', 0, 2).listen();
		var x = cgSceneDiscover1Gui.add(parameters1, 'x', -250, 250).listen();
		var y = cgSceneDiscover1Gui.add(parameters1, 'y', -250, 250).listen();
		var z = cgSceneDiscover1Gui.add(parameters1, 'z', -250, 250).listen();
		cgSceneDiscover1Gui.add(parameters1, 'reset').name("Reset Light Parameters");

		intensity.onChange(function(value) {
			cgSceneLight.intensity = value;
			cgSceneLightSphere.material.opacity = value / 2;
		});
		x.onChange(function(value) {
			cgSceneLight.position.x = value;
		});
		y.onChange(function(value) {
			cgSceneLight.position.y = value;

		});
		z.onChange(function(value) {
			cgSceneLight.position.z = value;
		});

	});



}