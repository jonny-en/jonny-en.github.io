function cgSceneDiscover0() {
	cgScene.add(cgSceneEarth);
	cgScene.add(cgSceneLight);
	cgScene.remove(cgSceneSpotLight);
	cgScene.remove(cgSceneMoonCenter);
	cgSceneStopAnimations();
	cgSceneLightSphere.material.opacity = 0;
	cgSceneClouds.material = new THREE.MeshBasicMaterial({
		transparent: true,
		opacity: 0,
	});

	cgSceneGlow.material.opacity = 0;
	$('#content').load("content/cg/cgSceneDiscover0.html", function() {
		cgSceneEarth.material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			wireframe: true
		});
		cgSceneEarth.geometry = new THREE.SphereGeometry(90, 22, 22);
		axisHelper = new THREE.AxisHelper(120);
		axisHelper.position.set(-150, -20, 0);
		cgScene.add(axisHelper);

		//GUI Discover0
		cgSceneDiscover0Gui = new dat.GUI({
			autoPlace: false,
			width: 400
		});
		var customContainer = document.getElementById('cgDiscover0Gui');
		customContainer.appendChild(cgSceneDiscover0Gui.domElement);

		var cgSceneDiscoverRadius = cgSceneDiscover0Gui.add(parameters0, 'radius').min(30).max(150).step(1).listen();
		var cgSceneDiscoverSegmentsX = cgSceneDiscover0Gui.add(parameters0, 'segmentsX').min(2).max(42).step(1).listen();
		var cgSceneDiscoverSegmentsY = cgSceneDiscover0Gui.add(parameters0, 'segmentsY').min(2).max(42).step(1).listen();
		cgSceneDiscover0Gui.add(cgSceneEarth.material, 'wireframe');
		cgSceneDiscover0Gui.add(parameters0, 'reset').name("Reset Cube Parameters");

		cgSceneDiscoverRadius.onChange(function(value) {
			cgSceneEarth.geometry = new THREE.SphereGeometry(value, parameters0.segmentsX, parameters0.segmentsY);
		});

		cgSceneDiscoverSegmentsX.onChange(function(value) {
			cgSceneEarth.geometry = new THREE.SphereGeometry(parameters0.radius, value, parameters0.segmentsY);
		});

		cgSceneDiscoverSegmentsY.onChange(function(value) {
			cgSceneEarth.geometry = new THREE.SphereGeometry(parameters0.radius, parameters0.segmentsX, value);
		});


	});

}