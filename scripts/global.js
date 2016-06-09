var settings = {
	cameraAngle: 45,
	cameraDistanceNear: 10,
	cameraDistanceFar: 10000,
	cameraX: 0,
	cameraY: 0,
	cameraZ: 650,
	cameraLookX: 0,
	cameraLookY: 0,
	cameraLookZ: 0,

	lightX: 80,
	lightY: 80,
	lightZ: 80,

	lightShadowCameraSideWidth: 512,
	lightShadowCameraDistanceFar: 400,
	lightShadowDarkness: 0.4,
	lightShadowBias:.0001,
	lightShadowCameraVisible: false,

	minutesNumber: 60,
	radius: 100,
	radiusSmall: 3,
	radiusSmallest: 2,
	radiusSun: 50,
	radiusMoon: 10,
	depthWrapper: 10,
	depthFace: 20,
	bigRadius: 110,
	lineLengthShortest: 10,
	lineLengthShort: 20,
	lineWidthShortest: 1,
	lineWidthShort: 5,
	lineWidthHandHour: 5,
	lineWidthHandMinute: 5,
	lineWidthHandSecond: 1,
	spacing: 5,
	spacingHand: 15,
	handHourLength: 1,
	handMinuteLength: 1,
	handSecondLength: 1,
	floorSideWidth: 300,
	floorZ: -11,
};

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
	settings.cameraAngle,
	window.innerWidth / window.innerHeight,
	settings.cameraDistanceNear,
	settings.cameraDistanceFar
);
camera.position.x = settings.cameraX;
camera.position.y = settings.cameraY;
camera.position.z = settings.cameraZ;

camera.lookAt({
	x: settings.cameraLookX,
	y: settings.cameraLookY,
	z: settings.cameraLookZ
});

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;

document.body.appendChild( renderer.domElement );

var sunTexture = THREE.ImageUtils.loadTexture('img/g2.jpg', {}, function () {
	renderer.render(scene, camera);
});

var moonTexture = THREE.ImageUtils.loadTexture('img/ground1.jpg', {}, function () {
	renderer.render(scene, camera);
});

var group = new THREE.Group();
group.position.y = 50;

var subGroup = new THREE.Group();
group.add(subGroup);

scene.add( group );

var light;

light = new THREE.DirectionalLight(0xAAAAFF);
light.position.set(
	settings.lightX,
	settings.lightY,
	settings.lightZ
);

light.castShadow = true;
light.shadowCameraVisible = settings.lightShadowCameraVisible;

light.shadowMapWidth = 2048;
light.shadowMapHeight = 2048;

light.shadowCameraLeft = -settings.lightShadowCameraSideWidth;
light.shadowCameraRight = settings.lightShadowCameraSideWidth;
light.shadowCameraTop = settings.lightShadowCameraSideWidth;
light.shadowCameraBottom = -settings.lightShadowCameraSideWidth;

light.shadowCameraFar = settings.lightShadowCameraDistanceFar;
light.shadowDarkness = settings.lightShadowDarkness;
light.shadowBias = settings.lightShadowBias;

scene.add(light);

settings.handHourLength = settings.radius - 40;
settings.handMinuteLength = settings.radius - 20;
settings.handSecondLength = settings.radius - 10;

var materials = {
	floor: new THREE.MeshPhongMaterial(
		{
			color: 0xEEEEEE,
			shininess: 10,
			specular: 0xfff8d9,
			shading: THREE.FlatShading,
			side: THREE.DoubleSide
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
	),
	sun: new THREE.MeshLambertMaterial({map: sunTexture}),
	moon: new THREE.MeshLambertMaterial({map: moonTexture})
};

/* Floor  */
var geometry = new THREE.PlaneGeometry( settings.floorSideWidth, settings.floorSideWidth, 1, 1 );
var floor = new THREE.Mesh( geometry, materials.floor );
floor.translateZ(settings.floorZ);
floor.receiveShadow = true;
group.add( floor );

var circleGeometry1 = new THREE.CylinderGeometry(settings.bigRadius, settings.bigRadius, settings.depthWrapper, 360)
var circle1 = new THREE.Mesh( circleGeometry1, materials.clock );
circle1.translateZ(0);
circle1.rotateX(Math.PI / 2);
circle1.castShadow = true;
group.add( circle1 );

var circleGeometry2 = new THREE.CylinderGeometry(settings.radius, settings.radius, settings.depthFace, 360)
var material2 = new THREE.MeshBasicMaterial( { color: 0xffffff } );
var circle2 = new THREE.Mesh( circleGeometry2, material2 );
circle2.translateZ(0);
circle2.rotateX(Math.PI / 2);
circle2.castShadow = true;
circle2.receiveShadow = true;
group.add( circle2 );

for (var i = 0; i < settings.minutesNumber; i++) {
	var lineGeometry = null;
	var line = null;
	var lineAngle = (6 * Math.PI * i) / 180;

	if(i % 5 === 0) {
		lineGeometry = new THREE.BoxGeometry( settings.lineWidthShort, settings.lineLengthShort, 1);
		line = new THREE.Mesh( lineGeometry, materials.line );
		line.rotateZ(lineAngle);
		line.translateOnAxis(new THREE.Vector3( 0, 1, 0 ), settings.radius - settings.lineLengthShort / 2 - settings.spacing );
		line.translateOnAxis(new THREE.Vector3( 0, 0, 1 ), settings.depthFace / 2 );
	} else {
		lineGeometry = new THREE.BoxGeometry( settings.lineWidthShortest, settings.lineLengthShortest, 1);
		line = new THREE.Mesh( lineGeometry, materials.line );
		line.rotateZ(lineAngle);
		line.translateOnAxis(new THREE.Vector3( 0, 1, 0 ), settings.radius - settings.lineLengthShortest / 2 - settings.spacing );
		line.translateOnAxis(new THREE.Vector3( 0, 0, 1 ), settings.depthFace / 2 );
	}

	line.castShadow = true;
	line.receiveShadow = true;

	group.add( line );

}

var boxGeometry3 = new THREE.BoxGeometry( settings.lineWidthHandHour, settings.handHourLength, 1);
var boxGeometry4 = new THREE.BoxGeometry( settings.lineWidthHandMinute, settings.handMinuteLength, 1);
var boxGeometry5 = new THREE.BoxGeometry( settings.lineWidthHandSecond, settings.handSecondLength, 1);

var handHourParent = new THREE.Object3D();
var handMinuteParent = new THREE.Object3D();
var handSecondParent = new THREE.Object3D();

var handHour = new THREE.Mesh( boxGeometry3, materials.handHour );
handHour.castShadow = true;
handHour.receiveShadow = true;

var handMinute = new THREE.Mesh( boxGeometry4, materials.handMinute );
handMinute.castShadow = true;
handMinute.receiveShadow = true;

var handSecond = new THREE.Mesh( boxGeometry5, materials.handSecond );
handSecond.castShadow = true;
handSecond.receiveShadow = true;

handHourParent.add(handHour);
handMinuteParent.add(handMinute);
handSecondParent.add(handSecond);

handHour.translateOnAxis(new THREE.Vector3( 0, 1, 0 ), settings.handHourLength / 2 - settings.spacingHand );
handMinute.translateOnAxis(new THREE.Vector3( 0, 1, 0 ), settings.handMinuteLength / 2 - settings.spacingHand );
handSecond.translateOnAxis(new THREE.Vector3( 0, 1, 0 ), settings.handSecondLength / 2 - settings.spacingHand );

handHour.translateOnAxis(new THREE.Vector3( 0, 0, 1 ), settings.depthFace / 2 + 2 );
handMinute.translateOnAxis(new THREE.Vector3( 0, 0, 1 ), settings.depthFace / 2 + 3 );
handSecond.translateOnAxis(new THREE.Vector3( 0, 0, 1 ), settings.depthFace / 2 + 4 );

group.add( handHourParent );
group.add( handMinuteParent );
group.add( handSecondParent );

var circleGeometry3 = new THREE.CircleGeometry(settings.radiusSmall, 360 );
var material3 = new THREE.MeshBasicMaterial( { color: 0xFF0000 } );
var circle3 = new THREE.Mesh( circleGeometry3, material3 );
circle3.translateOnAxis(new THREE.Vector3( 0, 0, 1 ), settings.depthFace / 2 + 5 );
group.add( circle3 );

var circleGeometry4 = new THREE.CircleGeometry(settings.radiusSmallest, 360 );
var material4 = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
var circle4 = new THREE.Mesh( circleGeometry4, material4 );
circle4.translateOnAxis(new THREE.Vector3( 0, 0, 1 ), settings.depthFace / 2 + 5 );
group.add( circle4 );

var sunGeometry = new THREE.SphereGeometry(settings.radiusSun, 64, 64 );
var sun = new THREE.Mesh( sunGeometry, materials.sun );
sun.translateOnAxis(new THREE.Vector3( 0, 1, 0 ), + settings.floorSideWidth / 2 + settings.radiusSun * 2 );
sun.receiveShadow = true;
sun.castShadow = true;
subGroup.add( sun );

var moonGeometry = new THREE.SphereGeometry(settings.radiusMoon, 64, 64 );
var moon = new THREE.Mesh( moonGeometry, materials.moon );
moon.translateOnAxis(new THREE.Vector3( 0, 1, 0 ), - settings.floorSideWidth / 2 - settings.radiusMoon );
moon.receiveShadow = true;
moon.castShadow = true;
subGroup.add( moon );

var mouseX = 0;
var mouseXOnMouseDown = 0;

var targetRotation = 0;
var targetRotationOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

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

	group.rotation.y += ( targetRotation - group.rotation.y ) * 0.05;

	sun.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 180);
	moon.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 180);
	subGroup.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 180);

	renderer.render( scene, camera );
}

render();

document.addEventListener( 'mousedown', onDocumentMouseDown, false );

function onDocumentMouseDown( event ) {
	event.preventDefault();
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.addEventListener( 'mouseout', onDocumentMouseOut, false );
	mouseXOnMouseDown = event.clientX - windowHalfX;
	targetRotationOnMouseDown = targetRotation;
}
function onDocumentMouseMove( event ) {
	mouseX = event.clientX - windowHalfX;
	targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
}
function onDocumentMouseUp( event ) {
	document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}
function onDocumentMouseOut( event ) {
	document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}