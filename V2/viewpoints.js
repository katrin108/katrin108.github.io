////////////////////////////////////////////////////////////////////
//    Sýnidæmi í Tölvugrafík
//    Byggt á sýnisforriti í C fyrir OpenGL, höfundur óþekktur.
//
//     Bíll sem keyrir í hringi í umhverfi með húsum.  Hægt að
//    breyta sjónarhorni áhorfanda með því að slá á 1, 2, ..., 8.
//    Einnig hægt að breyta hæð áhorfanda með upp/niður örvum.
//    Leiðrétt útgáfa fyrir réttan snúning í MV.js
//
//    Hjálmtýr Hafsteinsson, september 2025
////////////////////////////////////////////////////////////////////
var canvas;
var gl;

// position of the track
var TRACK_RADIUS = 100.0;
var TRACK_INNER = 90.0;
var TRACK_OUTER = 110.0;
var TRACK_PTS = 100;

var BLUE = vec4(0.0, 0.0, 1.0, 1.0);
var RED = vec4(1.0, 0.0, 0.0, 1.0);
var GRAY = vec4(0.4, 0.4, 0.4, 1.0);
var PlainYellow=vec4(1,0.9,0.1,1);
var PlainBlue = vec4(0.0,0.5,1,1);

var numCubeVertices  = 36;
var numTrackVertices  = 2*TRACK_PTS + 2;
var numRoofVerticals = 18


// variables for moving car
var car1Direction = 0.0;
var car1XPos = 100.0;
var car1YPos = 0.0;

var car2Direction = 0.0;
var car2XPos = 100.0;
var car2YPos = 0.0;

var plainDirection = 0.0;
var plainXPos = 100.0;
var plainYPos = 0.0;

var height = 0.0;

// current viewpoint
var view = 1;

var colorLoc;
var mvLoc;
var pLoc;
var proj;

var cubeBuffer;
var trackBuffer;
var roofBuffer;
var vPosition;


//for case 0
let x=80.0;
let y=10.0;

let mouseView=false;
let movement=false;
let mouseX=0.0;
let mouseY=0.0;




let pitch= 0.0;
let yaw=0.0;
let yawRad=radians(yaw);

let space=2;

// the 36 vertices of the cube
var cVertices = [
    // front side:
    vec3( -0.5,  0.5,  0.5 ), vec3( -0.5, -0.5,  0.5 ), vec3(  0.5, -0.5,  0.5 ),
    vec3(  0.5, -0.5,  0.5 ), vec3(  0.5,  0.5,  0.5 ), vec3( -0.5,  0.5,  0.5 ),
    // right side:
    vec3(  0.5,  0.5,  0.5 ), vec3(  0.5, -0.5,  0.5 ), vec3(  0.5, -0.5, -0.5 ),
    vec3(  0.5, -0.5, -0.5 ), vec3(  0.5,  0.5, -0.5 ), vec3(  0.5,  0.5,  0.5 ),
    // bottom side:
    vec3(  0.5, -0.5,  0.5 ), vec3( -0.5, -0.5,  0.5 ), vec3( -0.5, -0.5, -0.5 ),
    vec3( -0.5, -0.5, -0.5 ), vec3(  0.5, -0.5, -0.5 ), vec3(  0.5, -0.5,  0.5 ),
    // top side:
    vec3(  0.5,  0.5, -0.5 ), vec3( -0.5,  0.5, -0.5 ), vec3( -0.5,  0.5,  0.5 ),
    vec3( -0.5,  0.5,  0.5 ), vec3(  0.5,  0.5,  0.5 ), vec3(  0.5,  0.5, -0.5 ),
    // back side:
    vec3( -0.5, -0.5, -0.5 ), vec3( -0.5,  0.5, -0.5 ), vec3(  0.5,  0.5, -0.5 ),
    vec3(  0.5,  0.5, -0.5 ), vec3(  0.5, -0.5, -0.5 ), vec3( -0.5, -0.5, -0.5 ),
    // left side:
    vec3( -0.5,  0.5, -0.5 ), vec3( -0.5, -0.5, -0.5 ), vec3( -0.5, -0.5,  0.5 ),
    vec3( -0.5, -0.5,  0.5 ), vec3( -0.5,  0.5,  0.5 ), vec3( -0.5,  0.5, -0.5 )
];

// vertices of the track
var tVertices = [];

//vertices of the roof
var rVertices = [  
    
    // back side:
    vec3(  0, 0,  0.5 ),vec3( -0.5,  0.5, -0.5 ), vec3(  0.5,  0.5, -0.5 ),

    //front side
    vec3(  0, 0,  0.5 ), vec3(  0.5, -0.5, -0.5 ), vec3( -0.5, -0.5, -0.5 ),

    // left side:
    vec3(  0, 0,  0.5 ),vec3( -0.5, -0.5, -0.5 ),vec3( -0.5,  0.5, -0.5 ),

    // right side:
    vec3(  0, 0,  0.5 ), vec3(  0.5, 0.5, -0.5 ), vec3( 0.5, -0.5, -0.5 ),

    // bottom side:
    vec3( -0.5, -0.5, -0.5 ), vec3( -0.5,  0.5, -0.5 ), vec3(  0.5,  0.5, -0.5 ),
    vec3(  0.5,  0.5, -0.5 ), vec3(  0.5, -0.5, -0.5 ), vec3( -0.5, -0.5, -0.5 )


];



window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.7, 1.0, 0.7, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    createTrack();
    
    // VBO for the track
    trackBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, trackBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(tVertices), gl.STATIC_DRAW );

    // VBO for the cube
    cubeBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cVertices), gl.STATIC_DRAW );

    // VBO for the roof
    roofBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, roofBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(rVertices), gl.STATIC_DRAW );


    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    colorLoc = gl.getUniformLocation( program, "fColor" );
    
    mvLoc = gl.getUniformLocation( program, "modelview" );

    // set projection
    pLoc = gl.getUniformLocation( program, "projection" );
    proj = perspective( 50.0, 1.0, 1.0, 500.0 );
    gl.uniformMatrix4fv(pLoc, false, flatten(proj));

    document.getElementById("Viewpoint").innerHTML = "1: Fjarlægt sjónarhorn";
    document.getElementById("Height").innerHTML = "Viðbótarhæð: "+ height;

    // Event listener for keyboard
    window.addEventListener("keydown", function(e){
        switch( e.keyCode ) {
            case 48: //0: walk around
                view = 0;
                document.getElementById("Viewpoint").innerHTML = "0: labba sjónarhorn";
                break;
            case 49:	// 1: distant and stationary viewpoint
                view = 1;
                document.getElementById("Viewpoint").innerHTML = "1: Fjarlægt sjónarhorn";
                break;
            case 50:	// 2: panning camera inside the track
                view = 2;
                document.getElementById("Viewpoint").innerHTML = "2: Horfa á bílinn innan úr hringnum";
                break;
            case 51:	// 3: panning camera inside the track
                view = 3;
                document.getElementById("Viewpoint").innerHTML = "3: Horfa á bílinn fyrir utan hringinn";
                break;
            case 52:	// 4: driver's point of view
                view = 4;
                document.getElementById("Viewpoint").innerHTML = "4: Sjónarhorn ökumanns";
                break;
            case 53:	// 5: drive around while looking at a house
                view = 5;
                document.getElementById("Viewpoint").innerHTML = "5: Horfa alltaf á eitt hús innan úr bílnum";
                break;
            case 54:	// 6: Above and behind the car
                view = 6;
                document.getElementById("Viewpoint").innerHTML = "6: Fyrir aftan og ofan bílinn";
                break;
            case 55:	// 7: from another car in front
                view = 7;
                document.getElementById("Viewpoint").innerHTML = "7: Horft aftur úr bíl fyrir framan";
                break;
            case 56:	// 8: from beside the car
                view = 8;
                document.getElementById("Viewpoint").innerHTML = "8: Til hliðar við bílinn";
                break;
            
            case 38:    // up arrow
                height += 2.0;
                document.getElementById("Height").innerHTML = "Viðbótarhæð: "+ height;
                break;
            case 40:    // down arrow
                height -= 2.0;
                document.getElementById("Height").innerHTML = "Viðbótarhæð: "+ height;
                break;
            case 32:    // space
                height += 2.0;
                document.getElementById("Height").innerHTML = "Viðbótarhæð: "+ height;
                break;
            case 16:    // shift
                height -= 2.0;
                document.getElementById("Height").innerHTML = "Viðbótarhæð: "+ height;
                break;
            
        }
    } ); 
    window.addEventListener("mouseup",function(e){
        movement=false;
    })
    window.addEventListener("mousedown",function(e){
        movement=true;
        
     });
    window.addEventListener("mousemove",function(e){
            
            if(mouseView&&movement){
                    dx=e.movementX;
                    dy=e.movementY;


                    yaw -= dx*0.2;

                    yaw = (yaw+360)%360;
                        
                    pitch -= dy*0.2;
                    pitch=Math.max(-89,Math.min(89,pitch)); //prevents fipping over when looking up

            }
        
        } );

    render();
}


// create the vertices that form the car track
function createTrack() {

    var theta = 0.0;
    for( var i=0; i<=TRACK_PTS; i++ ) {
        var p1 = vec3(TRACK_OUTER*Math.cos(radians(theta)), TRACK_OUTER*Math.sin(radians(theta)), 0.0);
        var p2 = vec3(TRACK_INNER*Math.cos(radians(theta)), TRACK_INNER*Math.sin(radians(theta)), 0.0) 
        tVertices.push( p1 );
        tVertices.push( p2 );
        theta += 360.0/TRACK_PTS;
    }
}


// draw a house in location (x, y) of size size
function house( x, y, mv ,color,rotation=0,xSize=6,ySize=6,zSize=6) {

    gl.uniform4fv( colorLoc, color );

    
    
   
    // draw the base
    let base = mult( mv, translate( x, y, zSize/2 ) );
    //not all houses face same direction
    base=mult(base,rotateZ(rotation));

    base = mult( base, scalem( xSize, ySize, zSize ) );



    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    gl.uniformMatrix4fv(mvLoc, false, flatten(base));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );

    //draw the roof
    let [r,g,b,w]=color;
    let roof_color=vec4(b,r,g,w);
    


    gl.uniform4fv( colorLoc, roof_color );


    //not all houses face the same direction
    let roof = mult( mv, translate( x, y, (zSize*1.5) ) );
    roof=mult(roof,rotateZ(rotation));
    roof = mult( roof, scalem( xSize, ySize, zSize ) );
   

    gl.bindBuffer( gl.ARRAY_BUFFER, roofBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    gl.uniformMatrix4fv(mvLoc, false, flatten(roof));
    gl.drawArrays( gl.TRIANGLES, 0, numRoofVerticals );
}

function bridge(mv){

    gl.uniform4fv( colorLoc, vec4(0.4,0.2,0,1) );

   
    // draw the base
    let base = mult( mv, translate( 100, 0,6) );
    

    base = mult( base, scalem( 20, 10, 2 ) );



    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    gl.uniformMatrix4fv(mvLoc, false, flatten(base));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );

    
    // draw the right side
    let rfoot = mult( mv, translate( 89, 0,4) );
     rfoot = mult( rfoot, rotateY(40) );

    rfoot = mult( rfoot, scalem( 2, 10, 6 ) );



    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    gl.uniformMatrix4fv(mvLoc, false, flatten(rfoot));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );

    let f1=mult( mv, translate( 86.5, 0,1.5) );
    f1 = mult( f1, scalem( 3, 10, 2 ) );


    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    gl.uniformMatrix4fv(mvLoc, false, flatten(f1));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );

    //left side
    let lfoot = mult( mv, translate( 111, 0,4) );
     lfoot = mult( lfoot, rotateY(-40) );
    

    lfoot = mult( lfoot, scalem( 2, 10, 6 ) );



    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    gl.uniformMatrix4fv(mvLoc, false, flatten(lfoot));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );
    
    let f2=mult( mv, translate( 113.5, 0,1.5) );
    f2 = mult( f2, scalem( 3, 10, 2 ) );


    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    gl.uniformMatrix4fv(mvLoc, false, flatten(f2));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );

}

    

// draw the circular track and a few houses (i.e. red cubes)
function drawScenery( mv ) {

    // draw track
    gl.uniform4fv( colorLoc, GRAY );
    gl.bindBuffer( gl.ARRAY_BUFFER, trackBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, numTrackVertices );


    // draw houses
    color1=vec4(1,0.4,0.4,1);    
    house(-20.0, 50.0, mv,color1,25,8,10,10);
    house(20.0, -10.0, mv,color1);
    house(-200.0, 0.0,  mv,color1);

    color2=vec4(1,0.6,0,1);
    house(40.0, 120.0, mv,color2,45,7,7,25);
    house(-30.0, -50.0, mv,color2);
    house(20.0, -60.0, mv,color2,45,15,13);

    color3=vec4(1,1,0.4,1);
    house(0.0, 0.0, mv,color3,0,9,9,30);
    

    color4=vec4(0,1,0.5,1);
    house(5, 30.0, mv,color4,0,25);
    house(5,-30.0,  mv,color4,6,6,25);
    house(-50,-130.0, mv,color4,9,8,9,5);

    color5=vec4(0.2,0.6,1,1);
    house(10.0, -75.0,  mv,color5,-45,15,10,10);
    house(100.0, -115.0, mv,color5,0,5);
    house(90.0, 140.0, mv,color5,15,10,10,10);
    
    bridge(mv);
            
}


// draw car as two blue cubes
function drawCar( mv ,y=2,color=BLUE) {
  
    // set color to blue
    gl.uniform4fv( colorLoc, color );
    
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    var mv1 = mv;
    // lower body of the car
    mv = mult( mv, scalem( 10.0, 3.0, 2.0 ) );
    mv = mult( mv, translate( 0.0, y, 0.5 ) );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );

    // upper part of the car
    mv1 = mult( mv1, scalem( 4.0, 3.0, 2.0 ) );
    mv1 = mult( mv1, translate( -0.2, y, 1.5 ) );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );
}

function drawBiplain(mv){
    var height=60;
    var x=9.0/2;
    var y=30.0/2;
    var z=6.0/2;
        // set color 
    gl.uniform4fv( colorLoc,PlainBlue  );
    
    mv = mult( plain, rotateZ( 90) ) ;
    var body=mv;


    body = mult( body, translate( 0.0, 0.0, height) );
    body = mult( body, scalem( x, y, z) );

    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    gl.uniformMatrix4fv(mvLoc, false, flatten(body));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );

    
    var nose=mv;
    nose = mult( nose, translate(0, x*2, height) );
    nose=mult(nose,rotateX(-90));
    nose = mult( nose, scalem( x, z, z ) );

    gl.bindBuffer( gl.ARRAY_BUFFER, roofBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    gl.uniformMatrix4fv(mvLoc, false, flatten(nose));
    gl.drawArrays( gl.TRIANGLES, 0, numRoofVerticals );

   
    gl.uniform4fv( colorLoc, vec4(0,0,0,1) );

    var propeller=mv;
    propeller= mult( propeller, translate(0, (x*2)+z/3, height) );
    propeller=mult(propeller,rotateX(-90));
    propeller=mult(propeller,rotateZ(car1Direction*6));
    propeller = mult( propeller, scalem( x/15, y/4, z/15 ) );


    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    gl.uniformMatrix4fv(mvLoc, false, flatten(propeller));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );

    gl.uniform4fv( colorLoc, PlainYellow );
    var wing1=mv;
    wing1 = mult( wing1, translate( 0, 0, height-(z/2)) );
    wing1 = mult( wing1, scalem( y*2, x, z/4) );

    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    gl.uniformMatrix4fv(mvLoc, false, flatten(wing1));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );

    var wing2=mv;
    wing2 = mult( wing2, translate( 0, 0, height+(z/2)) );
    wing2 = mult( wing2, scalem( y*2, x, z/4) );

    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    gl.uniformMatrix4fv(mvLoc, false, flatten(wing2));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );

    var tail=mv;
    tail = mult( tail, translate(0, (-x*2)+(z/2), height+(z/2)) );
    tail=mult(tail,rotateX(45));

    tail = mult( tail, scalem( x/2, z, z*2 ) );

    gl.bindBuffer( gl.ARRAY_BUFFER, roofBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    gl.uniformMatrix4fv(mvLoc, false, flatten(tail));
    gl.drawArrays( gl.TRIANGLES, 0, numRoofVerticals );


  
    var tailR=mv;
    tailR = mult( tailR, translate(x/3, (-x*2)+(z/2.5), height+(z/2)+0.8) );
    tailR=mult(tailR,rotateY(90));

    tailR = mult( tailR, scalem( z/8, (z/2), (z) ) );

    gl.bindBuffer( gl.ARRAY_BUFFER, roofBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    gl.uniformMatrix4fv(mvLoc, false, flatten(tailR));
    gl.drawArrays( gl.TRIANGLES, 0, numRoofVerticals );

    var tailL=mv;
    tailL = mult( tailL, translate(-x/3, (-x*2)+(z/2.5), height+(z/2)+0.8) );
    tailL=mult(tailL,rotateY(-90));

    tailL = mult( tailL, scalem( z/8, (z/2), (z) ) );

    gl.bindBuffer( gl.ARRAY_BUFFER, roofBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    gl.uniformMatrix4fv(mvLoc, false, flatten(tailL));
    gl.drawArrays( gl.TRIANGLES, 0, numRoofVerticals );
    
    



}

function trackMovement(){
    speed=0.002;
    max=250
    //direction you are looking at
 

    forwardX=Math.cos(yawRad);

    forwardY=Math.sin(yawRad);

    rightX=-Math.sin(yawRad);

    rightY=Math.cos(yawRad);

            
    // Event listener for keyboard
    window.addEventListener("keydown", function(e){
        switch( e.keyCode ) {
            case 87: //w
                if(x<max){
                    x+=forwardX*speed;
                    y+=forwardY*speed;
                           
                }
                else{
                    x=max;
                }                       
                break;
            case 83://s
                if(x>(-max)){
                    x-=forwardX*speed;
                    y-=forwardY*speed;
            
                }
                else{
                    x=-max;
                }
                break;
            case 65://A left
                if(y<(max)){
                   x+=rightX*speed;
                    y+=rightY*speed;
            
                }
                else{
                    y=max;
                }
                break;
             
            case 68: //D right
                if(y>(-max)){
                    x-=rightX*speed;
                    y-=rightY*speed;
              
                }
                else{
                    y=-max;
                }   
                break;
        }
    } );

}



function cars(mv){
    car1Direction += 3.0;
    if ( car1Direction > 360.0 ) car1Direction = 0.0;

    car1XPos = TRACK_RADIUS * Math.sin( radians(car1Direction) );
    car1YPos = TRACK_RADIUS * Math.cos( radians(car1Direction) );
    car1=mv;
    car1 = mult( mv, translate( car1XPos, car1YPos, 0.0 ) );
    car1 = mult( car1, rotateZ( -car1Direction ) ) ;
    drawCar( car1,-space );

    car2Direction -= 3.0;
    if ( car2Direction > 360.0 ) car2Direction = 0.0;

    car2XPos = TRACK_RADIUS * Math.sin( radians(car2Direction) );
    car2YPos = TRACK_RADIUS * Math.cos( radians(car2Direction) );

    car2=mv;
    car2 = mult( mv, translate( car2XPos, car2YPos, 0.0 ) );
    car2 = mult( car2, rotateZ( -car2Direction ) ) ;
    drawCar( car2 ,space,vec4(1,0.1,0.6,1));

  
 
    plainDirection-=1;
    if ( plainDirection > 360.0 ) plainDirection = 0.0;

    plainXPos = TRACK_RADIUS * Math.sin( radians(plainDirection) );
    plainYPos = TRACK_RADIUS *Math.sin( radians(plainDirection))* Math.cos( radians(plainDirection) );

    let nextX=TRACK_RADIUS * Math.sin( radians(plainDirection+0.1) );
    let nextY=TRACK_RADIUS *Math.sin( radians(plainDirection+0.1))* Math.cos( radians(plainDirection+0.1) )
    
    let dx=nextX-plainXPos;
    let dy=nextY-plainYPos;
  
    let angle =(Math.atan2(dy,dx)*180)/Math.PI;//convert direction in to °
    plain=mv;

    plain = mult( mv, translate( plainXPos, plainYPos, 0.0 ) );
    
    
    plain = mult( plain, rotateZ( angle ) ) ;
     drawBiplain(plain);
  

}
    

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

   

    var mv = mat4();
    switch( view ) {
        case 0:

            let eye=vec3(x,y,height+5);

            yawRad=radians(yaw);
            pitchRad=radians(pitch);

            dirY=Math.cos(pitchRad)*Math.sin(yawRad);
            dirX=Math.cos(pitchRad)*Math.cos(yawRad);
            dirZ=Math.sin(pitchRad);

            let center=vec3(eye[0]+dirX,eye[1]+dirY,eye[2]+dirZ);



            
            let up=vec3(0.0, 0.0, 1.0) ;

            mv = lookAt( eye,center ,up );
            drawScenery( mv );
            trackMovement()
     
            cars(mv);
            mouseView=true;
               
            break;
        
        case 1:
            // Distant and stationary viewpoint
            mv = lookAt( vec3(250.0, 0.0, 100.0+height), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0) );
            drawScenery( mv );
            cars(mv);
            mouseView=false;
	        break;
	    case 2:
	        // Static viewpoint inside the track; camera follows car
	        mv = lookAt( vec3(75.0, 0.0, 5.0+height), vec3(car1XPos, car1YPos, 0.0), vec3(0.0, 0.0, 1.0 ) );
	        drawScenery( mv );
	  
	        cars(mv);
	        break;
	    case 3:
	        // Static viewpoint outside the track; camera follows car
	        mv = lookAt( vec3(125.0, 0.0, 5.0+height), vec3(car1XPos, car1YPos, 0.0), vec3(0.0, 0.0, 1.0 ) );
	        drawScenery( mv );
            mouseView=false;
	       
	        cars(mv);
	        break;
        case 4:
            // Driver's point of view.
	        mv = lookAt( vec3(3.0, -4-space, 5.0+height), vec3(12.0, -4-space, 2.0+height), vec3(0.0, 0.0, 1.0 ) );
            
            mv = mult( mv, rotateZ( car1Direction ) );
            mv = mult( mv, translate(-car1XPos, -car1YPos, 0.0) );
            cars(mv);
            mouseView=false;

            drawScenery( mv );
            break;
	    case 5:
            // Drive around while looking at a house at (40, 120)
            mv = rotateY( -car1Direction );
            mv = mult( mv, lookAt( vec3(3.0, -space, 5.0+height), vec3(40.0-car1XPos, space+120.0-car1YPos, 0.0), vec3(0.0, 0.0, 1.0 ) ) );	    
            mv = mult( mv, rotateZ( car1Direction ) );
            mv = mult( mv, translate(-car1XPos, -car1YPos, 0.0) );
            cars(mv);
            mouseView=false;

            drawScenery( mv );
	    break;
	    case 6:
            // Behind and above the car
            mv = lookAt( vec3(-10.0, -space*3, 6.0+height), vec3(15.0, -space*3, 4.0), vec3(0.0, 0.0, 1.0 ) );
       
            mv = mult( mv, rotateZ( car1Direction ) );
            mv = mult( mv, translate(-car1XPos, -car1YPos, 0.0) );
            cars(mv);
            mouseView=false;

            drawScenery( mv );
            break;
	    case 7:
            // View backwards looking from another car
            mv = lookAt( vec3(25.0,-space*2, 5.0+height), vec3(0.0, -3-space*2, 2.0), vec3(0.0, 0.0, 1.0 ) );
           
            mv = mult( mv, rotateZ( car1Direction ) );
            mv = mult( mv, translate(-car1XPos, -car1YPos, 0.0) );
             cars(mv);
            mouseView=false;

            drawScenery( mv );
            break;
	    case 8:
            // View from beside the car
	        mv = lookAt( vec3(-5.0, 20.0+space*2, 5.0+height), vec3(-5, space*4, 2.0), vec3(0.0, 0.0, 1.0 ) );
               
            mv = mult( mv, rotateZ( car2Direction ) );
            mv = mult( mv, translate(-car2XPos, -car2YPos, 0.0) );
            cars(mv);
            mouseView=false;

            drawScenery( mv );
            break;
        
        }
    
    
    requestAnimFrame( render );
}
