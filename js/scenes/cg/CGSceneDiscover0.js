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
            width: 450
        });
        var customContainer = document.getElementById('cgDiscover0Gui');
        customContainer.appendChild(cgSceneDiscover0Gui.domElement);
        cgSceneDiscover0Gui.add(cgSceneEarth.scale, 'x').min(0).max(2).step(0.01).name('Skalierung x');
        cgSceneDiscover0Gui.add(cgSceneEarth.scale, 'y').min(0).max(2).step(0.01).name('Skalierung y');
        cgSceneDiscover0Gui.add(cgSceneEarth.scale, 'z').min(0).max(2).step(0.01).name('Skalierung z');
        var cgSceneDiscoverSegmentsX = cgSceneDiscover0Gui.add(parameters0, 'segmentsX').min(2).max(42).step(1).listen().name('Anzahl Segmente x');
        var cgSceneDiscoverSegmentsY = cgSceneDiscover0Gui.add(parameters0, 'segmentsY').min(2).max(42).step(1).listen().name('Anzahl Segmente y');
        cgSceneDiscover0Gui.add(parameters0, 'reset').name("Parameter zur&uuml;cksetzen");

        cgSceneDiscoverSegmentsX.onChange(function(value) {
            cgSceneEarth.geometry = new THREE.SphereGeometry(parameters0.radius, value, parameters0.segmentsY);
        });

        cgSceneDiscoverSegmentsY.onChange(function(value) {
            cgSceneEarth.geometry = new THREE.SphereGeometry(parameters0.radius, parameters0.segmentsX, value);
        });


    });

}
