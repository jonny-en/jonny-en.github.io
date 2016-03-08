var mainSceneLinkCL, mainSceneLinkCLSphere, mainSceneLinkCLText;

var hoveredCL = false;

function initMainSceneLinkCL() {
  mainSceneLinkCL = new THREE.Object3D();

  //Text
  var textCL = new THREE.TextGeometry("COMPUTATIONAL LINGUISTICS", {
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
  mainSceneLinkCLText = new THREE.Mesh(textCL, material);

  textCL.computeBoundingBox();
  var centerOffset = -0.5 * (textCL.boundingBox.max.x - textCL.boundingBox.min.x);
  mainSceneLinkCLText.position.x = centerOffset;
  mainSceneLinkCLText.position.y = -5;
  var geometry = new THREE.BoxGeometry(
    textCL.boundingBox.max.x,
    textCL.boundingBox.max.y,
    textCL.boundingBox.max.z
  );
  var material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0
  });
  mainSceneLinkCLTextVolume = new THREE.Mesh(geometry, material);
  mainSceneLinkCLTextVolume.position.set(-1.525 * centerOffset, 0, 0);
  mainSceneLinkCLTextVolume.add(mainSceneLinkCLText);

  //Stripe
  var loader = new THREE.JSONLoader();
  loader.load("models/stripe.json", function(geometry) {
    var material = new THREE.MeshPhongMaterial({
      color: 0xED4F00,
      emissive: 0xFF470A,
      specular: 0x000000,
      shininess: 6
    });
    var mainSceneLinkCLLine = new THREE.Mesh(geometry, material);
    mainSceneLinkCLLine.position.set(-2, -10, -0);
    mainSceneLinkCLLine.scale.set(2.85, 0.25, 0.05);
    mainSceneLinkCLTextVolume.add(mainSceneLinkCLLine);
  });

  //Sphere
  var geometry = new THREE.SphereGeometry(30, 30, 30);
  var material = new THREE.MeshBasicMaterial({
    color: 0x073454,
    side: THREE.BackSide
  });
  mainSceneLinkCLSphere = new THREE.Mesh(geometry, material);

  mainSceneLinkCLSphere.position.set(-310,-100,-10);
  mainSceneLinkCLSphere.scale.set(0.8, 0.8, 0.8);
  mainSceneLinkCLSphere.rotation.set(0, 0.1, 0);

  mainSceneLinkCLSphere.add(mainSceneLinkCL);
  mainSceneLinkCLSphere.add(mainSceneLinkCLTextVolume);
  mainSceneLinks.add(mainSceneLinkCLSphere);
}

function mainSceneLinkCLAnimate() {
  if (hoveredCL == false) {
    hoveredCL = true;
    mainSceneLinkCLText.material = mainSceneLinkTextMaterialHovered;
    mainSceneLinkCLSphere.material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.BackSide
    });

    earthTween = new TWEEN.Tween(mainSceneLinkCLEarth.position)
      .to({
        x: 0,
        y: 0,
        z: 0
      }, 100)
      .easing(TWEEN.Easing.Circular.Out).start();

    moonTween = new TWEEN.Tween(mainSceneLinkCLMoon.position)
      .to({
        x: 20,
        y: 0,
        z: 0
      }, 100)
      .easing(TWEEN.Easing.Circular.Out).start();

    earthTweenRotation = new TWEEN.Tween(mainSceneLinkCLEarth.rotation)
      .to({
        y: Math.PI / 2
      }, 1000)
      .onComplete(function() {
        mainSceneLinkCLEarth.rotation.y = 0;
      });

    earthTweenRotation.chain(earthTweenRotation);
    earthTweenRotation.start();

    moonTweenRotation = new TWEEN.Tween(mainSceneLinkCLMoonCenter.rotation)
      .to({
        z: 2 * Math.PI
      }, 1000)
      .onComplete(function() {
        mainSceneLinkCLMoonCenter.rotation.z = 0;
      });
    moonTweenRotation.chain(moonTweenRotation);
    moonTweenRotation.start();
  }
}


function mainSceneLinkCLAnimateBack() {
  if (hoveredCL == true) {
    hoveredCL = false;

    mainSceneLinkCLText.material = mainSceneLinkTextMaterial;

    mainSceneLinkCLSphere.material = new THREE.MeshBasicMaterial({
      color: 0x073454,
      side: THREE.BackSide
    });

    earthTweenBack = new TWEEN.Tween(mainSceneLinkCLEarth.position)
      .to({
        x: -3,
        y: -2,
        z: 0
      }, 100)
      .easing(TWEEN.Easing.Circular.Out).start();

    earthTweenRotation.stop();
    moonTweenRotation.stop();
    mainSceneLinkCLEarth.rotation.y = 0;

    moonTweenRotationBack = new TWEEN.Tween(mainSceneLinkCLMoonCenter.rotation)
      .to({
        x: Math.PI / 4 + 0.7,
        y: Math.PI / 4 - 0.3,
        z: 0
      }, 200).start();

    moonTweenBack = new TWEEN.Tween(mainSceneLinkCLMoon.position)
      .to({
        x: 17,
        y: 0,
        z: 0
      }, 100)
      .easing(TWEEN.Easing.Circular.Out).start();

  }
}