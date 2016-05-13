function add3PointLight(centerX,centerY,sceneToAdd){
var lightambient = new THREE.AmbientLight( 0x4c4c4c );
  var light1 = new THREE.PointLight(0xffffff);
  light1.position.set(-3000,1000,3000);
  light1.intensity = 0.7;
  var light2 = new THREE.PointLight(0xffffff);
  light2.position.set(3000,-500,3000);
  light2.intensity = 0.3;
  var light3 = new THREE.PointLight(0xffffff);
  light3.position.set(1500,500,-3000);
  light3.intensity = 0.3;
  var light4 = new THREE.PointLight(0xffffff);
  light4.position.set(-1500,500,-3000);
  light4.intensity = 0.3;

  sceneToAdd.add(lightambient);
  sceneToAdd.add(light1);
  sceneToAdd.add(light2); 
  sceneToAdd.add(light3); 
  sceneToAdd.add(light4); 
}
