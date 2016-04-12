var mainSceneLinkMV, mainSceneLinkMVSphere, mainSceneLinkMVText;
var hoveredMV = false;

function initMainSceneLinkMV() {
  mainSceneLinkMV = new THREE.Object3D();

  //Text
  var textMV = new THREE.TextGeometry("MEDICAL VISUALIZATION", {
    size: 8,
    height: 2,
    curveSegments: 4,
    font: "helvetiker",
    weight: "bold"
  });

  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    emissive: 0x074271,
    specular: 0x074271,
    shininess: 1
  });
  mainSceneLinkMVText = new THREE.Mesh(textMV, material);

  textMV.computeBoundingBox();
  var centerOffset = -0.5 * (textMV.boundingBox.max.x - textMV.boundingBox.min.x);
  mainSceneLinkMVText.position.x = centerOffset;
  mainSceneLinkMVText.position.y = -5;
  var geometry = new THREE.BoxGeometry(
    textMV.boundingBox.max.x,
    textMV.boundingBox.max.y,
    textMV.boundingBox.max.z
  );
  var material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0
  });
  mainSceneLinkMVTextVolume = new THREE.Mesh(geometry, material);
  mainSceneLinkMVTextVolume.position.set(-1.65 * centerOffset, 0, 0);
  mainSceneLinkMVTextVolume.add(mainSceneLinkMVText);

  //Stripe
  var loader = new THREE.JSONLoader();
  loader.load("models/stripe.json", function(geometry) {
    var material = new THREE.MeshPhongMaterial({
      color: 0xED4F00,
      emissive: 0xFF470A,
      specular: 0x000000,
      shininess: 6
    });
    var mainSceneLinkMVLine = new THREE.Mesh(geometry, material);
    mainSceneLinkMVLine.position.set(-2, -10, -0);
    mainSceneLinkMVLine.scale.set(2.4, 0.25, 0.05);
    mainSceneLinkMVTextVolume.add(mainSceneLinkMVLine);
  });

  //Sphere
  var geometry = new THREE.SphereGeometry(30, 30, 30);
  var material = new THREE.MeshBasicMaterial({
    color: 0x073454,
    side: THREE.BackSide
  });
  mainSceneLinkMVSphere = new THREE.Mesh(geometry, material);

  mainSceneLinkMVSphere.position.set(-290,-40,-10);
  mainSceneLinkMVSphere.scale.set(0.8, 0.8, 0.8);
  mainSceneLinkMVSphere.rotation.set(0, 0.1, 0);

  mainSceneLinkMVSphere.add(mainSceneLinkMV);
  mainSceneLinkMVSphere.add(mainSceneLinkMVTextVolume);
  mainSceneLinks.add(mainSceneLinkMVSphere);
}

function mainSceneLinkMVAnimate() {
  if (hoveredMV == false) {
    hoveredMV = true;
    mainSceneLinkMVText.material = mainSceneLinkTextMaterialHovered;
    mainSceneLinkMVSphere.material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.BackSide
    });

    earthTween = new TWEEN.Tween(mainSceneLinkMVEarth.position)
      .to({
        x: 0,
        y: 0,
        z: 0
      }, 100)
      .easing(TWEEN.Easing.Circular.Out).start();

    moonTween = new TWEEN.Tween(mainSceneLinkMVMoon.position)
      .to({
        x: 20,
        y: 0,
        z: 0
      }, 100)
      .easing(TWEEN.Easing.Circular.Out).start();

    earthTweenRotation = new TWEEN.Tween(mainSceneLinkMVEarth.rotation)
      .to({
        y: Math.PI / 2
      }, 1000)
      .onComplete(function() {
        mainSceneLinkMVEarth.rotation.y = 0;
      });

    earthTweenRotation.chain(earthTweenRotation);
    earthTweenRotation.start();

    moonTweenRotation = new TWEEN.Tween(mainSceneLinkMVMoonCenter.rotation)
      .to({
        z: 2 * Math.PI
      }, 1000)
      .onComplete(function() {
        mainSceneLinkMVMoonCenter.rotation.z = 0;
      });
    moonTweenRotation.chain(moonTweenRotation);
    moonTweenRotation.start();
  }
}


function mainSceneLinkMVAnimateBack() {
  if (hoveredMV == true) {
    hoveredMV = false;

    mainSceneLinkMVText.material = mainSceneLinkTextMaterial;

    mainSceneLinkMVSphere.material = new THREE.MeshBasicMaterial({
      color: 0x073454,
      side: THREE.BackSide
    });

    earthTweenBack = new TWEEN.Tween(mainSceneLinkMVEarth.position)
      .to({
        x: -3,
        y: -2,
        z: 0
      }, 100)
      .easing(TWEEN.Easing.Circular.Out).start();

    earthTweenRotation.stop();
    moonTweenRotation.stop();
    mainSceneLinkMVEarth.rotation.y = 0;

    moonTweenRotationBack = new TWEEN.Tween(mainSceneLinkMVMoonCenter.rotation)
      .to({
        x: Math.PI / 4 + 0.7,
        y: Math.PI / 4 - 0.3,
        z: 0
      }, 200).start();

    moonTweenBack = new TWEEN.Tween(mainSceneLinkMVMoon.position)
      .to({
        x: 17,
        y: 0,
        z: 0
      }, 100)
      .easing(TWEEN.Easing.Circular.Out).start();

  }
}