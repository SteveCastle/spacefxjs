'use strict';

var scene, camera, renderer,
windowHalfX =  window.innerWidth / 2,
windowHalfY = window.innerHeight / 2,
mouseX  = 0,
mouseY = 0,
worldWidth = 256,
worldDepth = 256;
var loader, geometry, material, mesh, torus;

init();

function init() {
//SETUP THE SCENE
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0xefd1b5, 0.15 );
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;

    //LOAD SHIP GEOMETRY
    loader = new THREE.JSONLoader();
    loader.load('/models/arwing.js', function(object){
var color = new THREE.Color( 0, .8, .7 );
        material = new THREE.MeshBasicMaterial( { color: color, wireframe: true } );
        mesh = new THREE.Mesh( object, material );
        scene.add( mesh );
        mesh.position.z = 500;
        mesh.scale.x = 100;
        mesh.scale.y = 100;
        mesh.scale.z = 100;
        animate();
    });
createTorus();

    renderer = new THREE.CanvasRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );
}

//ANIMATION LOOP
function animate() {

    requestAnimationFrame( animate );

    mesh.rotation.z = (-mesh.position.x) * .0015;
    mesh.rotation.x = (mesh.position.y) * .005;
    mesh.position.y += ( + mouseY - mesh.position.y ) * 0.855;
    mesh.position.x += ( + mouseX - mesh.position.x ) * 0.855;
    renderer.render( scene, camera );
    if (torus.position.z < 1000){
         torus.position.z += 50;
    }
    else{
         createTorus();
    }


}




// Event Handlers
function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function createTorus() {
var geometry = new THREE.TorusGeometry( 200, 70, 16, 40 );
var color = new THREE.Color( Math.random(), 0, 1 );
var material = new THREE.MeshBasicMaterial( { color: color , wireframe: true} );
torus = new THREE.Mesh( geometry, material );
torus.position.z = -5000;
scene.add( torus );
}


function onDocumentMouseMove( e ) {
  mouseX = ( e.clientX - windowHalfX ) / 4;
  mouseY = ( e.clientY - windowHalfY ) / 4;
}

function onDocumentClick( e ) {
  console.log('shooting my lazers');
  $('div').fadeIn().css({ top: e.clientY, left: e.clientX}).delay(100).fadeOut();
}


function generateHeight( width, height ) {

    var size = width * height, data = new Uint8Array( size ),
    perlin = new ImprovedNoise(), quality = 1, z = Math.random() * 100;

    for ( var j = 0; j < 4; j ++ ) {

        for ( var i = 0; i < size; i ++ ) {

            var x = i % width, y = ~~ ( i / width );
            data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );

        }

        quality *= 5;

    }

    return data;

}

function generateTexture( data, width, height ) {

    var canvas, canvasScaled, context, image, imageData,
    level, diff, vector3, sun, shade;

    vector3 = new THREE.Vector3( 0, 0, 0 );

    sun = new THREE.Vector3( 1, 1, 1 );
    sun.normalize();

    canvas = document.createElement( 'canvas' );
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext( '2d' );
    context.fillStyle = '#000';
    context.fillRect( 0, 0, width, height );

    image = context.getImageData( 0, 0, canvas.width, canvas.height );
    imageData = image.data;

    for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {

        vector3.x = data[ j - 2 ] - data[ j + 2 ];
        vector3.y = 2;
        vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
        vector3.normalize();

        shade = vector3.dot( sun );

        imageData[ i ] = ( 96 + shade * 128 ) * ( 0.5 + data[ j ] * 0.007 );
        imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
        imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );

    }
}

document.addEventListener( 'mousemove', onDocumentMouseMove, false );
document.addEventListener( 'click', onDocumentClick, false );
window.addEventListener( 'resize', onWindowResize, false );