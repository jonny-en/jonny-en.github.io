var cgScene, cgSceneStars, cgSceneStars2, cgSteneStars3, cgSceneEarth, cgSceneClouds, cgSceneMoon, cgSceneMoonCenter, axisHelper, cgSceneGlow;
var cgScenePositionX = 0,
	cgScenePositionY = 3000;

var cgSceneDiscover0Gui;
var cgSceneDiscover1Gui;
var cgSceneDiscover2Gui;
var cgSceneDiscover3Gui;

var cloudsTweenRotation, earthTweenRotation, moonTweenRotation, moonTweenOrbitRotation;

var parameters0 = {
	radius: 90,
	segmentsX: 22,
	segmentsY: 22,
	reset: function() {
		resetSphere();
	}
};
var parameters1 = {
	color: 0xc5c5c5,
	x: -40,
	y: 50,
	z: 250,
	intensity: 1,
	reset: function() {
		resetLight();
	}
};

var parameters2 = {
	bumpScale: 2,
	shininess: 14,
	nightMode: false,
	cloudsOpacity: 1,
	glowOpacity: 1,
	reset: function() {
		resetMaterial();
	}
};


var parameters3 = {
	earthRotation: 1,
	moonRotation: 1,
	orbitSpeed: 1,
	reset: function() {
		//resetSpeed();
	}
};


var cgSceneLight, cgSceneSpotLight, cgSceneLight2, cgSceneLightSphere;


function initCGScene() {
	renderer.setClearColor(0x000000);
	$('#description').text("Prof. Dr. Stefan Müller");
	$('#pageTitle').text("COMPUTER GRAPHICS");
	$('#content').load("content/cg/cgSceneStart.html");

	cgScene = new THREE.Scene();
	cgScene.position = (cgScenePositionX, cgScenePositionY, 0);
	scene.add(cgScene);
	camera.position.set(cgScenePositionX, cgScenePositionY, 450);
	camera.target = cgScene.position;
	cameraFixed = true;

	//Light
	cgSceneLight = new THREE.PointLight();
	cgSceneLight.position.set(-40, 50, 250);
	cgSceneLight.intensity = 1;
	cgSceneLight.color = new THREE.Color(0xc5c5c5);
	cgScene.add(cgSceneLight);
	cgSceneLight2 = new THREE.AmbientLight(0x111111);
	cgSceneLight2.intensity = 0.5;
	cgScene.add(cgSceneLight2);

	//init LightSphere
	var material = new THREE.MeshBasicMaterial({
		color: 0xc5c5c5,
		opacity: 0,
		transparent: true
	});
	var geometry = new THREE.SphereGeometry(2, 10, 10);
	cgSceneLightSphere = new THREE.Mesh(geometry, material);
	cgSceneLight.add(cgSceneLightSphere);

	//init SpotLight
	cgSceneSpotLight = new THREE.SpotLight(0xffffff);
	cgSceneSpotLight.position.set(-40, 50, 450);
	cgSceneSpotLight.intensity = 1;
	cgScene.add(cgSceneSpotLight);
	cgSceneSpotLight.castShadow = true;
	cgSceneSpotLight.shadow.camera.near = 0.01;
	cgSceneSpotLight.shadow.camera.far = 1000;
	cgSceneSpotLight.shadow.camera.fov = 100;
	cgSceneSpotLight.shadow.bias = 0.000001;
	cgSceneSpotLight.shadow.mapSize.width = 2048;
	cgSceneSpotLight.shadow.mapSize.height = 2048;

	//Stars
	var loader = new THREE.TextureLoader();
	loader.load(
		'materials/starmap4ktrans.png',
		function(texture) {
			var material = new THREE.MeshBasicMaterial({
				map: texture,
				transparent: true,
				side: THREE.BackSide
			});
			var geometry = new THREE.SphereGeometry(3000, 6, 6);
			cgSceneStars = new THREE.Mesh(geometry, material);
			cgSceneStars.rotation.x = Math.PI * 0.7
			cgSceneStars.material.opacity = 0.5;
			cgScene.add(cgSceneStars);

			var geometry = new THREE.SphereGeometry(1500, 6, 6);
			cgSceneStars2 = new THREE.Mesh(geometry, material);
			cgSceneStars2.rotation.x = Math.PI * 1;
			cgScene.add(cgSceneStars2);

			var geometry = new THREE.SphereGeometry(1000, 6, 6);
			cgSceneStars3 = new THREE.Mesh(geometry, material);
			cgSceneStars3.rotation.x = Math.PI * 0.2;
			cgScene.add(cgSceneStars3);
		});

	//init Earth
	var geometry = new THREE.SphereGeometry(90, 22, 22);
	var material = new THREE.MeshBasicMaterial({
		color: 0xffffff,
		transparent: true,
		opacity: 0,
		wireframe: true
	});
	cgSceneEarth = new THREE.Mesh(geometry, material);
	cgSceneEarth.position.set(-150, -20, 0);


	//init Clouds

	var geometry = new THREE.SphereGeometry(91.5, 32, 32);
	var material = new THREE.MeshBasicMaterial({
		transparent: true,
		opacity: 0,
	});
	cgSceneClouds = new THREE.Mesh(geometry, material);

	//init Atmosphere
	var material = new THREE.SpriteMaterial({
		map: new THREE.ImageUtils.loadTexture('materials/glow.png'),
		color: 0xB9D2FF,
		transparent: true,
		opacity: 0,
		blending: THREE.AdditiveBlending
	});

	cgSceneGlow = new THREE.Sprite(material);
	cgSceneGlow.scale.set(240, 240, 1.0);
	cgSceneClouds.add(cgSceneGlow);

	//init MoonCenter
	var material = new THREE.MeshBasicMaterial({
		color: 0xffffff,
		transparent: true,
		opacity: 0,
		wireframe: true
	});
	var geometry = new THREE.SphereGeometry(1, 5, 5);
	cgSceneMoonCenter = new THREE.Mesh(geometry, material);
	cgSceneMoonCenter.position.set(-150, -20, 0);
	cgSceneMoonCenter.rotation.set(Math.PI / 4 + 0.7, Math.PI / 4 - 0.3,0);

	//init Moon
	var geometry = new THREE.SphereGeometry(20, 22, 22);
	var material = new THREE.MeshBasicMaterial({
		transparent: true,
		opacity: 0
	});

	cgSceneMoon = new THREE.Mesh(geometry, material);
	cgSceneMoon.position.set(170, 0, 0);
	cgSceneMoon.rotation.z = Math.PI/2;

	initCGSceneAnimations();
}

function resetLight() {
	cgSceneLight.position.set(-40, 50, 250);
	cgSceneLight.intensity = 1;
	cgSceneLightSphere.material.opacity = 0.5;
	cgSceneLightSphere.material.color = new THREE.Color(0xc5c5c5);
	cgSceneLight.color = new THREE.Color(0xc5c5c5);
	parameters1.color = 0xc5c5c5;
	parameters1.x = -40;
	parameters1.y = 50;
	parameters1.z = 250;
}

function resetSphere() {
	cgSceneEarth.geometry = new THREE.SphereGeometry(90, 22, 22);
	parameters0.radius = 90;
	parameters0.segmentsX = 22;
	parameters0.segmentsY = 22;
}


function resetMaterial() {
	cgSceneEarth.material.bumpScale = 2;
	cgSceneEarth.material.shininess = 14;
	cgSceneClouds.material.opacity = 1;
	cgSceneGlow.material.opacity = 1;
	parameters2.nightMode = false;
	parameters2.cloudsOpacity = 1;
	parameters2.glowOpacity = 1;
	parameters2.bumpScale = 2;
	parameters2.shininess = 14;
}

function setMaterial() {
	resetSphere();
	resetLight();
	resetMaterial();
	
	cgSceneSpotLight.position.set(-40, 50, 450);

	cgSceneEarth.add(cgSceneClouds);
	cgScene.add(cgSceneMoonCenter);
	cgSceneMoonCenter.add(cgSceneMoon);

	cgScene.remove(cgSceneLight);
	cgScene.add(cgSceneSpotLight);
	cgSceneSpotLight.target = cgSceneEarth;

	cgSceneEarth.receiveShadow = true;
	cgSceneEarth.castShadow = true;

	cgSceneMoon.castShadow = true;
	cgSceneMoon.receiveShadow = true;

	cgSceneClouds.receiveShadow = true;
	cgSceneGlow.material.opacity = 1;
	cgSceneEarth.rotation.x = -6.2;
	cgSceneEarth.rotation.y = -2.1;

	cgScene.remove(axisHelper);
	cgSceneLightSphere.material.opacity = 0;

	//clouds
	cgSceneClouds.material = new THREE.MeshPhongMaterial({
		transparent: true,
		opacity: 1,
		shininess: 0,
		map: THREE.ImageUtils.loadTexture("materials/earthcloudmap.png")
	});

	//Moon
	var cgLoader = new THREE.TextureLoader();
	cgLoader.load(
		'materials/moonmap2k.jpg',
		function(texture) {
			cgSceneMoon.material = new THREE.MeshPhongMaterial({
				map: texture,
				shininess: 0,
				bumpMap: THREE.ImageUtils.loadTexture("materials/moonbump2k.jpg"),
				bumpScale: 2
			});
		});

	//Earth
	cgLoader.load('materials/earthmap1k.jpg',
		function(texture) {
			cgSceneEarth.material = new THREE.MeshPhongMaterial({
				map: texture,
				shininess: 14,
				bumpMap: THREE.ImageUtils.loadTexture("materials/earthbump1k.jpg"),
				specularMap: THREE.ImageUtils.loadTexture("materials/earthspec1k.jpg"),
				specular: new THREE.Color('grey'),
				bumpScale: 1
			});


		});
}



