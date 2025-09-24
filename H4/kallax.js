/////////////////////////////////////////////////////////////////
//    Sýnidæmi í Tölvugrafík
//     Búum til bókstafinn H úr þremur teningum
//
//    Hjálmtýr Hafsteinsson, september 2025


//viðbætur fyrir verkefni 4 Katrín sep 2025
/////////////////////////////////////////////////////////////////
var canvas;
var gl;

var numVertices  = 36;

var points = [];
var colors = [];

var movement = false;     // Do we rotate?
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var matrixLoc;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorCube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    matrixLoc = gl.getUniformLocation( program, "transform" );

    //event listeners for mouse
    canvas.addEventListener("mousedown", function(e){
        movement = true;
        origX = e.offsetX;
        origY = e.offsetY;
        e.preventDefault();         // Disable drag and drop
    } );

    canvas.addEventListener("mouseup", function(e){
        movement = false;
    } );

    canvas.addEventListener("mousemove", function(e){
        if(movement) {
    	    spinY = ( spinY + (origX - e.offsetX) ) % 360;
            spinX = ( spinX + (origY - e.offsetY) ) % 360;
            origX = e.offsetX;
            origY = e.offsetY;
        }
    } );
    
    render();
}

function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function quad(a, b, c, d) 
{
    var vertices = [
        vec3( -0.5, -0.5,  0.5 ),
        vec3( -0.5,  0.5,  0.5 ),
        vec3(  0.5,  0.5,  0.5 ),
        vec3(  0.5, -0.5,  0.5 ),
        vec3( -0.5, -0.5, -0.5 ),
        vec3( -0.5,  0.5, -0.5 ),
        vec3(  0.5,  0.5, -0.5 ),
        vec3(  0.5, -0.5, -0.5 )
    ];

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
    ];

    //vertex color assigned by the index of the vertex
    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        colors.push(vertexColors[a]);
        
    }
}


function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var mv = mat4();
    mv = mult( mv, rotateX(spinX) );
    mv = mult( mv, rotateY(spinY) ) ;
    /*kallax mál (cm):
    ytri kassi x4:
    Þykkt ytri plötu
    4
    Þannig plöturnar eru:
    2x (72.5 x 38.8 x 4) hliða eru aðeins styttri á z giska stærð
    2x (76.5 x 39 x 4) uppi niðri

    innri kassar mál
    33.5x33.5 
    þykkt plötu að innan
    72.5x38.5x1,5   aðeins styttri á z giska stærð
    
    */
    

    //begin with the outside box
    var x_sides=0.765;
    var y_sides= 0.39;
    var z_sides=0.04;

    //make the kallax bigger
    var newSize=1.5;
    x_sides*=newSize;
    y_sides*=newSize;
    z_sides*=newSize;

    // left side 
    mv1 = mult( mv, translate( ((-x_sides+z_sides)/2), 0.0, 0.0 ) ); 
    mv1 = mult( mv1, scalem( z_sides, (x_sides-z_sides), y_sides-0.002 ) );
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv1));
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    // right side 
    mv1 = mult( mv, translate( ((x_sides-z_sides)/2), 0.0, 0.0 ) );
    mv1 = mult( mv1, scalem(  z_sides, (x_sides-z_sides), y_sides-0.002   ) );
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv1));
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    // top side
    mv1 = mult( mv, translate(0.0,  ((-x_sides+z_sides)/2), 0.0 ) ); 
    mv1 = mult( mv1, scalem( x_sides,z_sides , y_sides ) );
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv1));
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

   //bottom side
    mv1 = mult( mv, translate(0.0,   ((x_sides-z_sides)/2), 0.0 ) ); 
    mv1 = mult( mv1, scalem( x_sides,z_sides , y_sides ) );
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv1));
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    // Finally the inside
    mv1 = mult( mv, translate(0.0,  0.0, 0.0 ) ); 
    mv1 = mult( mv1, scalem( x_sides,0.015 , y_sides-0.005  ) );
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv1));
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    mv1 = mult( mv, translate(0.0,  0.0, 0.0 ) ); 
    mv1 = mult( mv1, scalem(  0.015, x_sides,  y_sides-0.005  ) );

    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv1));
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    requestAnimFrame( render );
}
