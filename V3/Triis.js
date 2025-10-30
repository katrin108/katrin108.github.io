

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';


let scene,camera,renderer;



var movement = false;     
var spinX = 0;
var spinY = 0;
var origX;
var origY;

const sensitivity_movement=0.005;

var zDist = 30.0;

const textureLoader = new THREE.TextureLoader();

let texture=null;
let fallingObject=null;

let fallingspeed=0.01;



//Grid Colors
const GREEN = new THREE.LineBasicMaterial({color: 0x0000ff});
const BLUE = new THREE.LineBasicMaterial({color: 0x009900});
const RED = new THREE.LineBasicMaterial({color: 0xff0000});


//object colors
const object_Yellow= new THREE.MeshBasicMaterial( { color: 0xffff00} );
const object_Red= new THREE.MeshBasicMaterial( { color: 0xff0000} );
const object_Green= new THREE.MeshBasicMaterial( { color: 0x00ff00} );
const object_Blue= new THREE.MeshBasicMaterial( { color: 0x00ffff} );
const object_Purple= new THREE.MeshBasicMaterial( { color: 0x6600ff} );
const object_Pink= new THREE.MeshBasicMaterial( { color: 0xff00ff} );
const object_Orange = new THREE.MeshBasicMaterial( {color: 0xff8000} );



//Better movement controlls
var keyGrup;




//Tetris logic
const WIDTH=6;      //x
const HEIGHT=20;    //y
const DEPTH =6;     //z 

//3D array
let grid= 
Array.from({length:WIDTH},() =>
Array.from({length:HEIGHT},() =>
Array.from({length:DEPTH},() =>0
)));



//walls of the playing area

const containerBounds= new THREE.Box3(
    new THREE.Vector3(-3,-10,-3),
    new THREE.Vector3(3,14,3)

)


function main(){

    //add custom looks
    customWindow();

    scene = new THREE.Scene();

    scene.background =new THREE.Color(0x000000);
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight ); 
    document.body.appendChild( renderer.domElement );



    fallingObject = tetromino();


    const [x,z] =getFallingObjectLoc();
    fallingObject.position.set(x,11,z);

    KeybordControlls(fallingObject);

    background()
   
    addMouseControls(renderer.domElement);



    renderer.setAnimationLoop( animate );
  
}
function animate() {
    

    movingObject();

    
    const radius = zDist; // distance from object
    camera.position.x = -(radius * Math.sin(spinY) * Math.cos(spinX));
    camera.position.y = -(radius * Math.sin(spinX));
    camera.position.z = radius * Math.cos(spinY) * Math.cos(spinX);

    camera.lookAt(0,0,0);
    

     
    renderer.render( scene, camera );

}

function canMoveFallingObject(object){
    for(const cube of object.children){

        const pos=new THREE.Vector3();
        cube.getWorldPosition(pos);


        //round er ekki 100% eða floor þarf að skoða
        const x=Math.round(pos.x+WIDTH/2);
        const y=Math.round(pos.y+HEIGHT/2);
        const z=Math.round(pos.z+DEPTH/2);
        
        
        
        if(y>=HEIGHT){
            //console.log("y>");
            return true;
        }
        if(y<HEIGHT){
            if(y<1){          
                console.log("y<");

                return false;
            }
        

       
            if(grid[x-1][y-1][z-1] !== 0){   
                console.log("grid<");
                //d.log(x,y,z);

                return false;
            } 
        }
            
    }
    return true;

}

function movingObject(){

    if(canMoveFallingObject(fallingObject)){
        fallingObject.position.y -= fallingspeed;

    }else{ 
        
        for(const cube of fallingObject.children){
            const pos=new THREE.Vector3();
            cube.getWorldPosition(pos);
            const x=Math.floor(pos.x+WIDTH/2);
            const y=Math.floor(pos.y+HEIGHT/2);
            const z=Math.floor(pos.z+DEPTH/2);
                console.log(x,y,z);
            
            grid[x][y][z] = 1;
        }
        console.log(grid);

        //TODO IS there full layer in the grid?
        //TODO Lose if above 20 hight;
        
        fallingObject=tetromino(); //Chance in to random object
        const [x,z] =getFallingObjectLoc();
        fallingObject.position.set(x,11,z);
        scene.add( fallingObject );

    }

}



function background(){



    fallingObject=polyomino();
    const [x,z] =getFallingObjectLoc();
    fallingObject.position.set(x,11,z);
  



    scene.add( fallingObject );

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
        
        if( e.deltaY > 0.0 && zDist< 40) {
            zDist += 2.0;
        } if(e.deltaY < 0.0 && zDist> 2) {
            zDist -= 2.0;
        }
        

     }  );
     
     
    window.addEventListener("keydown",function(e){
        if(e.key===' '){
            fallingspeed=0.1;
        }
     })
     window.addEventListener("keyup",function(e){
        if(e.key===' '){
            fallingspeed=0.01;
        }
     })


    
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function KeybordControlls(object){

    window.addEventListener('keypress',function (e){

        if(!keyGrup)return; 

        const clone=fallingObject.clone(true);

        switch (e.key){
            //movement
            case 'w': 
                clone.position.z-=1;
                break
            case 's': 
                clone.position.z+=1;
                break
            case 'a':
                clone.position.x -= 1;
                break
            case 'd': 
                clone.position.x+=1;
                break
            //rotatio
            case 'W':  
                clone.rotation.x-=(90*Math.PI/180);
                break
            case 'S': 
                clone.rotation.x+=(90*Math.PI/180);
                break
            case 'A':
                clone.rotation.y-=(90*Math.PI/180);
                break
            case 'D': 
                clone.rotation.y+=(90*Math.PI/180);
                break
            case 'Q':   
                clone.rotation.z+=(90*Math.PI/180);
                break
            case 'E':    
                clone.rotation.z-=(90*Math.PI/180);
                break
        }
   
        const box=new THREE.Box3().setFromObject(clone);
    
        if(containerBounds.containsBox(box)&&canMoveFallingObject(clone)){
            
            fallingObject.position.copy(clone.position);
            fallingObject.rotation.copy(clone.rotation);
        }
   
    });
    
    window.addEventListener('keydown',function (e){

        if(keyGrup)return; 

        const clone=object.clone(true);
        switch (e.key){
            //movement

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
        if(containerBounds.containsBox(box)&&canMoveFallingObject(clone)){
            object.position.copy(clone.position);
            object.rotation.copy(clone.rotation);
        }

    });
    
    
}
function getFallingObjectLoc(){
    let randIntX=getRandomInt(2)-1.5;
    let randIntZ=getRandomInt(2)-1.5;

    return [randIntX,randIntZ];
}
function polyomino(){

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



    return L_triomino(object_Orange);
}
function tetromino(){
    
    function straight_tetromino(material){
        const geometry=new THREE.BoxGeometry( 1, 1, 1 );

        const cube1=new THREE.Mesh( geometry,material );
        cube1.position.set(0,0,0);
        const cube2=new THREE.Mesh( geometry,material );
        cube2.position.set(0,1,0);
        const cube3=new THREE.Mesh( geometry,material );
        cube3.position.set(0,2,0);
        const cube4=new THREE.Mesh( geometry,material );
        cube4.position.set(0,3,0);

        const straight_tetromino=new THREE.Group();
        straight_tetromino.add(cube1);
        straight_tetromino.add(cube2);
        straight_tetromino.add(cube3);
        straight_tetromino.add(cube4);


        return straight_tetromino;
        
    }

    function square_tetromino(material){
        const geometry=new THREE.BoxGeometry( 1, 1, 1 );

        const cube1=new THREE.Mesh( geometry,material );
        cube1.position.set(0,0,0);
        const cube2=new THREE.Mesh( geometry,material );
        cube2.position.set(0,1,0);
        const cube3=new THREE.Mesh( geometry,material );
        cube3.position.set(1,0,0);
        const cube4=new THREE.Mesh( geometry,material );
        cube4.position.set(1,1,0);

        const square_tetromino=new THREE.Group();
        square_tetromino.add(cube1);
        square_tetromino.add(cube2);
        square_tetromino.add(cube3);
        square_tetromino.add(cube4);


        return square_tetromino;
        
    }


    function T_tetromino(material){
        const geometry=new THREE.BoxGeometry( 1, 1, 1 );

        const cube1=new THREE.Mesh( geometry,material );
        cube1.position.set(0,0,0);
        const cube2=new THREE.Mesh( geometry,material );
        cube2.position.set(0,1,0);
        const cube3=new THREE.Mesh( geometry,material );
        cube3.position.set(1,1,0);
        const cube4=new THREE.Mesh( geometry,material );
        cube4.position.set(-1,1,0);

        const T_tetromino=new THREE.Group();
        T_tetromino.add(cube1);
        T_tetromino.add(cube2);
        T_tetromino.add(cube3);
        T_tetromino.add(cube4);


        return T_tetromino;
        
    }


    function L_tetromino(material){
        const geometry=new THREE.BoxGeometry( 1, 1, 1 );

        const cube1=new THREE.Mesh( geometry,material );
        cube1.position.set(0,0,0);
        const cube2=new THREE.Mesh( geometry,material );
        cube2.position.set(1,0,0);
        const cube3=new THREE.Mesh( geometry,material );
        cube3.position.set(0,1,0);
        const cube4=new THREE.Mesh( geometry,material );
        cube4.position.set(0,2,0);

        const L_tetromino=new THREE.Group();
        L_tetromino.add(cube1);
        L_tetromino.add(cube2);
        L_tetromino.add(cube3);
        L_tetromino.add(cube4);


        return L_tetromino;
        
    }

    function skew_tetromino(material){
        const geometry=new THREE.BoxGeometry( 1, 1, 1 );

        const cube1=new THREE.Mesh( geometry,material );
        cube1.position.set(0,0,0);
        const cube2=new THREE.Mesh( geometry,material );
        cube2.position.set(-1,0,0);
        const cube3=new THREE.Mesh( geometry,material );
        cube3.position.set(0,1,0);
        const cube4=new THREE.Mesh( geometry,material );
        cube4.position.set(1,1,0);

        const skew_tetromino=new THREE.Group();
        skew_tetromino.add(cube1);
        skew_tetromino.add(cube2);
        skew_tetromino.add(cube3);
        skew_tetromino.add(cube4);


        return skew_tetromino;
        
    }

    return skew_tetromino(object_Blue);
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
    keyGrup=true;
    updateColorMaterial();

    const body=document.body;
    body.style.backgroundColor ='#0d0d0d';

    const footer=document.createElement("footer");


    //light and dark mode

    const light_dark_mode=document.createElement("div");


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



    light_dark_mode.appendChild(DarkMode);
    light_dark_mode.appendChild(label);
    light_dark_mode.appendChild(LightMode);

    footer.appendChild(light_dark_mode);

    //keybord controll

    const keybord_controll=document.createElement("div");

    var mouse= document.createElement("H2"); 
    var no_mouse= document.createElement("H2"); 
    mouse.textContent="Using 2 hands";  
    no_mouse.textContent="Using 3 hands";


    const label2= document.createElement("label"); 
    label2.className ="switch";


    const input2 =  document.createElement("input"); 
    input2.type="checkbox";


    const span2 =  document.createElement("span"); 
    span2.className = "slider round";

    label2.appendChild(input2);
    label2.appendChild(span2);



    keybord_controll.appendChild(mouse);
    keybord_controll.appendChild(label2);
    keybord_controll.appendChild(no_mouse);

    footer.appendChild(keybord_controll);









    addEventListener("change", function (e){
        
    
        if(input.checked){
            texture = textureLoader.load('textures/box1.jpg')
            scene.background =new THREE.Color(0xe6e6e6);
            body.style.backgroundColor =' #e6e6e6';

            updateColorMaterial();


        }
        if(!input.checked){
            texture = textureLoader.load('textures/box3.jpg')
            scene.background =new THREE.Color(0x0d0d0d);
            body.style.backgroundColor ='#0d0d0d';


            updateColorMaterial();
        }
        if(input2.checked){
            keyGrup=false;

        }
        if(!input2.checked){
            keyGrup=true;


        }
    })



    body.appendChild(footer);








}
main();

