
function cgSceneDiscover3() {
	cgSceneStopAnimations();
	resetMaterial();
	setMaterial();
	//Gui
	$('#content').load("content/cg/cgSceneDiscover3.html", function() {
		cgSceneDiscover3Gui = new dat.GUI({
			autoPlace: false,
			width: 400
		});

		var customContainer = document.getElementById('cgDiscover3Gui');
		customContainer.appendChild(cgSceneDiscover3Gui.domElement);
		var earthRotation = cgSceneDiscover3Gui.add(parameters3,'earthRotation',0.1,20).listen().name('Earth Rotation Speed');
		var moonRotation = cgSceneDiscover3Gui.add(parameters3,'moonRotation',0.1,10).listen().name('Moon Rotation Speed');
		var orbitSpeed = cgSceneDiscover3Gui.add(parameters3,'orbitSpeed',0.1,5).listen().name('Moon Orbit Speed');

		earthRotation.onChange(function(value){
			cgSceneRotateEarth(value);
		});
		moonRotation.onChange(function(value){
			cgSceneRotateMoon(value);
		});
		orbitSpeed.onChange(function(value){
			cgSceneRotateOrbit(value);
		});
		cgSceneDiscover3Animate();

	});
}

function cgSceneDiscover3Animate() {
	cloudsTweenRotation.start();
	cgSceneRotateEarth(1);
	cgSceneRotateMoon(1);
	cgSceneRotateOrbit(1);
}