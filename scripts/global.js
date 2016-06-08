var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 1000);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 100;
camera.lookAt({
	x: 0,
	y: 0,
	z: 0
});

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;

document.body.appendChild( renderer.domElement );
/*
scene.add(new THREE.AmbientLight(0xFFFFFF));*/

var light;

light = new THREE.DirectionalLight(0xFFFFFF, 1.2);
light.position.set(40, 40, 30);
light.position.multiplyScalar(1.3);

light.castShadow = true;
light.shadowCameraVisible = true;

light.shadowMapWidth = 512;
light.shadowMapHeight = 512;

var d = 100;

light.shadowCameraLeft = -d;
light.shadowCameraRight = d;
light.shadowCameraTop = d;
light.shadowCameraBottom = -d;

light.shadowCameraFar = 400;
light.shadowDarkness = 0.5;

scene.add(light);

var minutesNumber = 60;

var radius = 20;
var shortLineLength = 2;
var shortestLineLength = 1;
var shortLinesSpacing = 1;

var handHourLength = radius - 4;
var handMinuteLength = radius - 2;
var handSecondLength = radius - 1;

var materials = {
	floor: new THREE.MeshPhongMaterial(
		{
			color: 0xEEEEEE,
			shininess: 10,
			specular: 0xfff8d9,
			shading: THREE.FlatShading
		}
	),
	clock: new THREE.MeshPhongMaterial(
		{
			color: 0x8F8F8F,
			shininess: 10,
			specular: 0xfff8d9,
			shading: THREE.FlatShading
		}
	),
	line: new THREE.MeshPhongMaterial(
		{
			color: 0x000000,
			shininess: 10,
			specular: 0xfff8d9,
			shading: THREE.FlatShading
		}
	),
	handHour: new THREE.MeshPhongMaterial(
		{
			color: 0x000000,
			shininess: 10,
			specular: 0xfff8d9,
			shading: THREE.FlatShading
		}
	),
	handMinute: new THREE.MeshPhongMaterial(
		{
			color: 0x000000,
			shininess: 10,
			specular: 0xfff8d9,
			shading: THREE.FlatShading
		}
	),
	handSecond: new THREE.MeshPhongMaterial(
		{
			color: 0xff0000,
			shininess: 10,
			specular: 0xfff8d9,
			shading: THREE.FlatShading
		}
	)
};

/* Floor  */
var geometry = new THREE.PlaneGeometry( 80, 80, 1, 1 );
var floor = new THREE.Mesh( geometry, materials.floor );
floor.translateZ(-6);
floor.receiveShadow = true;
scene.add( floor );

var circleGeometry1 = new THREE.CylinderGeometry(radius + .5, radius + .5, 1, 360)
var circle1 = new THREE.Mesh( circleGeometry1, materials.clock );
circle1.translateZ(-1);
circle1.rotateX(Math.PI / 2);
circle1.castShadow = true;
scene.add( circle1 );

var circleGeometry2 = new THREE.CylinderGeometry(radius, radius, 2, 360)
var material2 = new THREE.MeshBasicMaterial( { color: 0xffffff } );
var circle2 = new THREE.Mesh( circleGeometry2, material2 );
circle2.translateZ(-1);
circle2.rotateX(Math.PI / 2);
circle2.castShadow = true;
circle2.receiveShadow = true;
scene.add( circle2 );

for (var i = 0; i < minutesNumber; i++) {

	var lineAngle = (6 * Math.PI * i) / 180;

	var vector1 = new THREE.Vector3( 0, radius, 0 );
	var vector2 = new THREE.Vector3( 0, radius + 1, 0 );

	var lineGeometry1 = new THREE.Geometry();
	lineGeometry1.vertices.push(
		vector1,
		vector2
	);

	var lineGeometry2 = new THREE.BoxGeometry( 1, shortLineLength, 1);

	var lineGeometry3 = new THREE.BoxGeometry( 0.2, shortestLineLength, 1);

	var line2 = new THREE.Mesh( lineGeometry2, materials.line );
	//line2.castShadow = true;

	var line3 = new THREE.Mesh( lineGeometry3, materials.line );
	//line3.castShadow = true;

	if(i % 5 === 0) {
		scene.add( line2 );

		line2.rotateZ(lineAngle);
		line2.translateOnAxis(new THREE.Vector3( 0, 1, 0 ), radius - shortLineLength / 2 - shortLinesSpacing );

	} else {
		scene.add( line3 );

		line3.rotateZ(lineAngle);
		line3.translateOnAxis(new THREE.Vector3( 0, 1, 0 ), radius - shortestLineLength / 2 - shortLinesSpacing );
	}

}

var boxGeometry3 = new THREE.BoxGeometry( 1, handHourLength, 1);
var boxGeometry4 = new THREE.BoxGeometry( 1, handMinuteLength, 1);
var boxGeometry5 = new THREE.BoxGeometry(.5, handSecondLength, 1);

var handHourParent = new THREE.Object3D();
var handMinuteParent = new THREE.Object3D();
var handSecondParent = new THREE.Object3D();

var handHour = new THREE.Mesh( boxGeometry3, materials.handHour );
var handMinute = new THREE.Mesh( boxGeometry4, materials.handMinute );
var handSecond = new THREE.Mesh( boxGeometry5, materials.handSecond );

handHourParent.add(handHour);
handMinuteParent.add(handMinute);
handSecondParent.add(handSecond);

handHour.translateOnAxis(new THREE.Vector3( 0, 1, 0 ), handHourLength / 2 - 2 );
handMinute.translateOnAxis(new THREE.Vector3( 0, 1, 0 ), handMinuteLength / 2 - 2 );
handSecond.translateOnAxis(new THREE.Vector3( 0, 1, 0 ), handSecondLength / 2 - 2 );

scene.add( handHourParent );
scene.add( handMinuteParent );
scene.add( handSecondParent );

var circleGeometry3 = new THREE.CircleGeometry(.5, 360 );
var material3 = new THREE.MeshBasicMaterial( { color: 0xFF0000 } );
var circle3 = new THREE.Mesh( circleGeometry3, material3 );
circle3.position.z = 1;
scene.add( circle3 );

var circleGeometry4 = new THREE.CircleGeometry(.2, 360 );
var material4 = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
var circle4 = new THREE.Mesh( circleGeometry4, material4 );
circle4.position.z = 1;
scene.add( circle4 );

var timePassed = 0;

function render(time) {
	requestAnimationFrame( render );

	if (time - timePassed > 1000) {
		timePassed = time;

		var date = new Date();

		var hrs = date.getHours();
		var min = date.getMinutes();
		var sec = date.getSeconds();

		var handHourR = (30 * (hrs > 12 ? hrs - 12 : hrs) * Math.PI) / 180;
		var handMinuteR = (6 * min * Math.PI) / 180;
		var handSecondR = (6 * sec * Math.PI) / 180;

		handHourParent.rotation.z = -handHourR;
		handMinuteParent.rotation.z = -handMinuteR;
		handSecondParent.rotation.z = -handSecondR;

	}

	renderer.render( scene, camera );
}

render();