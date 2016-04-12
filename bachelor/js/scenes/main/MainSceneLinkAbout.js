var mainSceneLinkAboutTop, mainSceneLinkAboutBottom, mainSceneLinkAbout, mainSceneLinkAboutSphere, mainSceneLinkAboutText;
var hoveredAbout = false;

function initMainSceneLinkAbout() {
  var loader = new THREE.JSONLoader();
  mainSceneLinkAbout = new THREE.Object3D();
  loader.load("models/cv.json", function(geometry) {
    var material = new THREE.MeshLambertMaterial({
      color: 0xFC8E11,
      emissive: 0xFF470A,
      wireframe: true
    });
    mainSceneLinkAboutTop = new THREE.Mesh(geometry, material);
    mainSceneLinkAboutTop.scale.x = 20;
    mainSceneLinkAboutTop.scale.y = 20;
    mainSceneLinkAboutTop.scale.z = 20;
    mainSceneLinkAbout.add(mainSceneLinkAboutTop);
  })
  loader.load("models/cv2.json", function(geometry) {
    var material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      wireframe: true
    });
    mainSceneLinkAboutBottom = new THREE.Mesh(geometry, material);
    mainSceneLinkAboutBottom.scale.x = 20;
    mainSceneLinkAboutBottom.scale.y = 20;
    mainSceneLinkAboutBottom.scale.z = 20;
    mainSceneLinkAbout.add(mainSceneLinkAboutBottom);

  })

  mainSceneLinkAbout.position.x = -6;

  var textAbout = new THREE.TextGeometry("ABOUT THE STUDIES", {
    size: 8,
    height: 2,
    curveSegments: 4,
    font: "helvetiker",
    weight: "bold"
  });

  var material = mainSceneLinkTextMaterial;
  mainSceneLinkAboutText = new THREE.Mesh(textAbout, material);

  textAbout.computeBoundingBox();
  var centerOffset = -0.5 * (textAbout.boundingBox.max.x - textAbout.boundingBox.min.x);
  mainSceneLinkAboutText.position.x = centerOffset;
  mainSceneLinkAboutText.position.y = -5;
  var geometry = new THREE.BoxGeometry(
    textAbout.boundingBox.max.x,
    textAbout.boundingBox.max.y,
    textAbout.boundingBox.max.z
  );
  var material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0
  });
  mainSceneLinkAboutTextVolume = new THREE.Mesh(geometry, material);

  mainSceneLinkAboutTextVolume.position.set(-1.7 * centerOffset, 0, 0);
  mainSceneLinkAboutTextVolume.add(mainSceneLinkAboutText);



  var loader = new THREE.JSONLoader();
  loader.load("models/stripe.json", function(geometry) {
    var material = new THREE.MeshPhongMaterial({
      color: 0xED4F00,
      emissive: 0xFF470A,
      specular: 0x000000,
      shininess: 6
    });
    var mainSceneLinkAboutLine = new THREE.Mesh(geometry, material);
    mainSceneLinkAboutLine.position.set(-2, -10, -0);
    mainSceneLinkAboutLine.scale.set(1.9, 0.25, 0.05);
    mainSceneLinkAboutTextVolume.add(mainSceneLinkAboutLine);
  });

  var geometry = new THREE.SphereGeometry(30, 30, 30);
  var material = new THREE.MeshBasicMaterial({
    color: 0x073454,
    side: THREE.BackSide
  });
  mainSceneLinkAboutSphere = new THREE.Mesh(geometry, material);
  mainSceneLinkAboutSphere.add(mainSceneLinkAbout);
  mainSceneLinkAboutSphere.add(mainSceneLinkAboutTextVolume);
  mainSceneLinkAboutSphere.position.x = 200;
  mainSceneLinkAboutSphere.position.y = 80;
  mainSceneLinkAboutSphere.position.z = -10;
  mainSceneLinkAboutSphere.scale.set(0.8, 0.8, 0.8);
  mainSceneLinkAboutSphere.rotation.set(0, -0.1, 0);
  mainSceneLinks.add(mainSceneLinkAboutSphere);
}

function mainSceneLinkAboutAnimate() {
  if (hoveredAbout == false) {
    hoveredAbout = true;
    mainSceneLinkAboutSphere.material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.BackSide
    });
    mainSceneLinkAboutText.material = mainSceneLinkTextMaterialHovered;

    mainSceneLinkAboutTween = new TWEEN.Tween(mainSceneLinkAboutTop.rotation)
      .to({
        x: 0,
        y: Math.PI * 2 - 0.01 * Math.PI,
        z: 0
      }, 1000)
      .easing(TWEEN.Easing.Circular.Out).start();
    mainSceneLinkAboutTween = new TWEEN.Tween(mainSceneLinkAboutBottom.rotation)
      .to({
        x: -(Math.PI * 2),
        y: -0.01 * Math.PI,
        z: 0
      }, 1000)
      .easing(TWEEN.Easing.Circular.Out).start();
  }
}

function mainSceneLinkAboutAnimateBack() {
  if (hoveredAbout == true) {
    hoveredAbout = false;

    mainSceneLinkAboutText.material = mainSceneLinkTextMaterial;
    mainSceneLinkAboutSphere.material = new THREE.MeshBasicMaterial({
      color: 0x073454,
      side: THREE.BackSide
    });
    mainSceneLinkAboutTween = new TWEEN.Tween(mainSceneLinkAboutTop.rotation)
      .to({
        x: 0,
        y: 0,
        z: 0
      }, 1000)
      .easing(TWEEN.Easing.Quadratic.InOut).start();
    mainSceneLinkAboutTween = new TWEEN.Tween(mainSceneLinkAboutBottom.rotation)
      .to({
        x: 0,
        y: 0,
        z: 0
      }, 1000)
      .easing(TWEEN.Easing.Quadratic.InOut).start();
  }
}