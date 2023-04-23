/**
 * CrearFigura Construye 2 paralepides y los retorna
 * ENTRADAS: lado = Variable num, tamaño del lado del paralepipedo que se crearán en la escena.
 *           base = Variable num, tamaño de la base y ancho del paralepipedo que se crearán en la escena.
 * SALIDAS: paralepipedo = Array con los objetos Mesh de Three.js correspondientes a cada figura.
*/
function CrearFigura(lado, base) {

    const Dim = [ [base, lado, base], [base, lado, base] ];
    const material = [ new THREE.MeshMatcapMaterial({ color: 'skyblue' }), new THREE.MeshMatcapMaterial({ color: 'pink' })];
  
    //Dimensiones para cada figura
    const Geometria = [];
    for (let i = 0; i < 2; i++) {
        Geometria.push(new THREE.BoxGeometry(...Dim[i]));
    }

    const paralepipedo = [];
    for (let i = 0; i < 2; i++) {
        paralepipedo.push(new THREE.Mesh(Geometria[i], material[i]));
    }

    //Graficar y retornar las figuras
    for (let i = 0; i < 2; i++) {        
        scene.add (paralepipedo[i]);
    }
  
    return paralepipedo;

}
/**
  Rotacion: Aplica rotacion a un objeto THREE.js en un eje y angulo determinado.  
  ENTRADAS: objeto = Objeto THREE.js que se desea rotar.
            eje = Eje en el cual se realizara la rotacion.
            angulo = El ángulo de rotación en radianes.
*/
function Rotacion( obj, eje, ang) {
    
    const quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(eje, ang);
  
    obj.quaternion.multiply(quaternion);
    
}
/**
  Traslacion: Aplica traslacion a un objeto THREE.js.  
  ENTRADAS: Objeto = Objeto THREE.js que se va a trasladar.
           (x,y,z)= Coordenadas en las que se va a trasladar la figura
*/
function Traslacion( objeto, X, Y, Z) {

    objeto.position.set(X, Y, Z)

}

function animate() {

    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);   
  
}

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0xDDDDDD, 1);
document.body.appendChild(renderer.domElement);

var size = 30;
var arrowSize = 10;
var divisions = 100;
var origin = new THREE.Vector3( 0, 0, 0 );
var x = new THREE.Vector3( 1, 0, 0 );
var y = new THREE.Vector3( 0, 1, 0 );
var z = new THREE.Vector3( 0, 0, 1 );
var color2 = new THREE.Color( 0x333333 );
var colorR = new THREE.Color( 0xAA0000 );
var colorG = new THREE.Color( 0x00AA00 );
var colorB = new THREE.Color( 0x0000AA );

//Creacion del plano
var gridHelperXZ = new THREE.GridHelper( size, divisions, color2, color2);

//Creacion de los  ejes y camara
var arrowX = new THREE.ArrowHelper( x, origin, arrowSize, colorR );
var arrowY = new THREE.ArrowHelper( y, origin, arrowSize, colorG );
var arrowZ = new THREE.ArrowHelper( z, origin, arrowSize, colorB );

var camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT);
camera.position.z = 4.5;
camera.position.y = 4;
camera.position.x = 4;
const light = new THREE.AmbientLight(0x404040, 5);

//Parametrizacion de los valores
var lado = 3;
var base = 0.1 * lado;

var beta = (25*Math.PI)/180;  
var alfa = (225*Math.PI)/180; 
var gamma = (180*Math.PI)/180;

const paralepipedo = CrearFigura(lado, base);

//Agrupar las figuras
var brazo = new THREE.Object3D();

brazo.add(paralepipedo[0]);
brazo.add(paralepipedo[1]);

//Traslaciones objetos
Traslacion(paralepipedo[0], 0, lado/2, 0);
Traslacion(paralepipedo[1], 0, 3*lado/2, 0);
Traslacion(paralepipedo[1], -0.368*lado, 1.389*lado, 0);

//Rotacion de las figuras
Rotacion(brazo, z, beta);
/*
 Usamos el metodo "rotation.y" ya que este nos permite rotar el brazo alrederdor del eje universal Y, y no 
 respecto a los ejes individuales del grupo de figuras, como lo hace la funcion RotarObjeto. 
*/
brazo.rotation.y = gamma 
Rotacion(paralepipedo[1], z, alfa);

//Escena
scene.add(arrowX, arrowY, arrowZ, gridHelperXZ, camera, light);
scene.add(brazo);
const controls = new THREE.OrbitControls(camera, renderer.domElement);  
animate();
