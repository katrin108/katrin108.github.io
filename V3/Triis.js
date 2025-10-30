

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

let scene,camera,renderer;

let container;


var movement = false;     
var spinX = 0;
var spinY = 0;
var origX;
var origY;

const sensitivity_movement=0.005;

var zDist = 10.0;

const textureLoader = new THREE.TextureLoader();

let texture=null;
let fallingObject=null;

const containerBounds= new THREE.Box3(
    new THREE.Vector3(-3,-10,-3),
    new THREE.Vector3(3,10,3)

)

//Grid Colors
const GREEN = new THREE.LineBasicMaterial({color: 0x0000ff});
const BLUE = new THREE.LineBasicMaterial({color: 0x009900});
const RED = new THREE.LineBasicMaterial({color: 0xff0000});


//object colors
const object_Yellow= new THREE.MeshBasicMaterial( { color: 0xffff00} );
const object_Red= new THREE.MeshBasicMaterial( { color: 0xff0000} );
const object_Green= new THREE.MeshBasicMaterial( { color: 0x00ff00} );
const object_Blue= new THREE.MeshBasicMaterial( { color: 0x0000ff} );
const object_Purple= new THREE.MeshBasicMaterial( { color: 0x6600ff} );
const object_Pink= new THREE.MeshBasicMaterial( { color: 0xff00ff} );
const object_Orange = new THREE.MeshBasicMaterial( {color: 0xff8000} );



//Better movement controlls
var keyGrup=false;


function main(){

    //add custom looks
    customWindow();





    scene = new THREE.Scene();

    scene.background =new THREE.Color(0x000000);
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight ); 
    document.body.appendChild( renderer.domElement );

    fallingObject = polyomino();
    KeybordControlls(fallingObject);

    background()
   
    addMouseControls(renderer.domElement);



    renderer.setAnimationLoop( animate );
  
}
function animate() {
    
      //cube.rotation.x += 0.01;
      //cube.rotation.y += 0.01;

      //triomino.rotation.x += 0.01;
      //triomino.rotation.y += 0.01;

    
    const radius = zDist; // distance from object
    camera.position.x = -(radius * Math.sin(spinY) * Math.cos(spinX));
    camera.position.y = -(radius * Math.sin(spinX));
    camera.position.z = radius * Math.cos(spinY) * Math.cos(spinX);

    camera.lookAt(0,0,0);
    

     
    renderer.render( scene, camera );

}

function background(){


    container = new THREE.Group();

    container.add(fallingObject);


    scene.add( container );

    for( let i = -4;i<=24; i+=4){

        const gridXZ= new THREE.GridHelper( 6, 6 );
        gridXZ.material=BLUE;

        gridXZ.rotation.z=Math.PI/2;
        
        gridXZ.position.set(6/2,(-10+i)/2,0);
        scene.add( gridXZ );

        const gridZX= new THREE.GridHelper( 6, 6 );
        gridZX.material=BLUE;

        gridZX.rotation.z=Math.PI/2;
        gridZX.position.set(-6/2,(-10+i)/2,0);
        scene.add( gridZX );

        

        const gridXY= new THREE.GridHelper( 6, 6);
        gridXY.material=GREEN;

        gridXY.rotation.x=Math.PI/2;
        gridXY.position.set(0,(-10+i)/2,6/2);
        scene.add( gridXY );

        const gridYX= new THREE.GridHelper( 6, 6);
        gridYX.material=GREEN;

        gridYX.rotation.x=Math.PI/2;
        gridYX.position.set(0,(-10+i)/2,-6/2);
        scene.add( gridYX );
    }


    const gridYZ= new THREE.GridHelper( 6, 6);
    gridYZ.material=RED;
    gridYZ.position.set(0,-10,0);
    scene.add( gridYZ );
   
}
function addMouseControls(canvas) {
        //event listeners for mouse
    canvas.addEventListener("mousedown", function(e){
        movement = true;
        origX = e.clientX;
        origY = e.clientY;
        e.preventDefault();         // Disable drag and drop
    } );

    canvas.addEventListener("mouseup", function(e){
        movement = false;
    } );

    canvas.addEventListener("mousemove", function(e){
        if(movement) {
    	   // spinY = ( (spinY*0.01) + (e.clientX - origX) ) % 360;
    	    spinY += (  e.clientX-origX ) *sensitivity_movement;

    	    spinX += (  origY-e.clientY) *sensitivity_movement;


            spinX = Math.max(-Math.PI/2,Math.min(Math.PI/2,spinX)) ;
           

            origX = e.clientX;
            origY = e.clientY;
        

        }
    } );
        
    // Event listener for mousewheel
     window.addEventListener("wheel", function(e){
         if( e.deltaY > 0.0 ) {
             zDist += 2.0;
         } else {
             zDist -= 2.0;
         }
     }  );  
}
function KeybordControlls(object){
    
    if(keyGrup){
            window.addEventListener('keypress',function (e){
            const clone=object.clone(true);
            switch (e.key){
                //movement
                case 'w': 
                    clone.position.z-=1;
                    break;

                case 's': 
                    clone.position.z+=1;
                    break;

                case 'a':
                    clone.position.x -= 1;
                    break;

                case 'd': 
                    clone.position.x+=1;
                    break;

                //rotation

                case 'W':  
                    clone.rotation.x-=(90*Math.PI/180);
                    break;

                case 'S': 
                    clone.rotation.x+=(90*Math.PI/180);
                    break;

                case 'A':
                    clone.rotation.y-=(90*Math.PI/180);
                    break;

                case 'D': 
                    clone.rotation.y+=(90*Math.PI/180);
                    break;

                case 'Q':   
                    clone.rotation.z+=(90*Math.PI/180);
                    break;

                case 'E':    
                    clone.rotation.z-=(90*Math.PI/180);
                    break;


            }

            const box=new THREE.Box3().setFromObject(clone);
            if(containerBounds.containsBox(box)){
                object.position.copy(clone.position);
                object.rotation.copy(clone.rotation);
            }

        });
    }
    else{
            window.addEventListener('keypress',function (e){

            const clone=object.clone(true);
            console.log(e.key,e.code);
            switch (e.code){
                //movement
                //


                case 'ArrowUp': 
                    clone.position.z-=1;
                    
                    break;

                case 'ArrowDown': 
                    clone.position.z+=1;
                    break;

                case 'ArrowLeft':
                    clone.position.x -= 1;
                    break;

                case 'ArrowRight': 
                    clone.position.x+=1;
                    break;

                //rotation

                case 'a':  
                    clone.rotation.x-=(90*Math.PI/180);
                    break;

                case 'z': 
                    clone.rotation.x+=(90*Math.PI/180);
                    break;

                case 's':
                    clone.rotation.y-=(90*Math.PI/180);
                    break;

                case 'x': 
                    clone.rotation.y+=(90*Math.PI/180);
                    break;

                case 'd':   
                    clone.rotation.z+=(90*Math.PI/180);
                    break;

                case 'c':    
                    clone.rotation.z-=(90*Math.PI/180);
                    break;


            }

            const box=new THREE.Box3().setFromObject(clone);
            if(containerBounds.containsBox(box)){
                object.position.copy(clone.position);
                object.rotation.copy(clone.rotation);
            }

        });
    }
    
}

function polyomino(){



    const Red= new THREE.MeshBasicMaterial( { color: 0xcc0000} );

    function L_triomino(material){
        const geometry=new THREE.BoxGeometry( 1, 1, 1 );

        const cube1=new THREE.Mesh( geometry,material );
        cube1.position.set(0,0,0);
        const cube2=new THREE.Mesh( geometry,material );
        cube2.position.set(0,1,0);
        const cube3=new THREE.Mesh( geometry,material );
        cube3.position.set(1,0,0);

        const L_triomino=new THREE.Group();
        L_triomino.add(cube1);
        L_triomino.add(cube2);
        L_triomino.add(cube3);

        L_triomino.position.set(0.5,0.5,0.5)
        return L_triomino;
    }

    function straight_triomino(material){
        const geometry=new THREE.BoxGeometry( 1, 1, 1 );

        const cube1=new THREE.Mesh( geometry,material );
        cube1.position.set(0,0,0);
        const cube2=new THREE.Mesh( geometry,material );
        cube2.position.set(0,1,0);
        const cube3=new THREE.Mesh( geometry,material );
        cube3.position.set(0,2,0);

        const straight_triomino=new THREE.Group();
        straight_triomino.add(cube1);
        straight_triomino.add(cube2);
        straight_triomino.add(cube3);

        return straight_triomino;
    }



    return L_triomino(object_Red);
}
function updateColorMaterial(){
    object_Yellow.map = texture;
    object_Yellow.needsUpdate = true; 

    object_Red.map = texture;
    object_Red.needsUpdate = true; 

    object_Green.map = texture;
    object_Green.needsUpdate = true; 

    object_Blue.map = texture;
    object_Blue.needsUpdate = true; 

    object_Purple.map = texture;
    object_Purple.needsUpdate = true; 

    object_Pink.map = texture;
    object_Pink.needsUpdate = true; 

    object_Orange.map = texture;
    object_Orange.needsUpdate = true;
}

function customWindow(){

   

    texture = textureLoader.load('textures/box3.jpg')
    updateColorMaterial();

    const body=document.body;
    body.style.backgroundColor ='#0d0d0d';

    const footer=document.createElement("footer");

    var DarkMode= document.createElement("H2"); 
    var LightMode= document.createElement("H2"); 
    DarkMode.textContent="Dark mode";  
    LightMode.textContent="Light mode";


    const label= document.createElement("label"); 
    label.className ="switch";


    const input =  document.createElement("input"); 
    input.type="checkbox";


    const span =  document.createElement("span"); 
    span.className = "slider round";






    label.appendChild(input);
    label.appendChild(span);



    footer.appendChild(DarkMode);
    footer.appendChild(label);
    footer.appendChild(LightMode);

    addEventListener("change", function (e){
        
        console.log(input.checked);
        if(input.checked){
            texture = textureLoader.load('textures/box2.jpg')
            scene.background =new THREE.Color(0xe6e6e6);
            body.style.backgroundColor =' #e6e6e6';

            updateColorMaterial();


        }else{
            texture = textureLoader.load('textures/box3.jpg')
            scene.background =new THREE.Color(0x0d0d0d);
            body.style.backgroundColor ='#0d0d0d';


            updateColorMaterial();
        }
    })



    body.appendChild(footer);








}
main();

