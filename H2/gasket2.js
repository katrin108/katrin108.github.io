"use strict";

var canvas;
var gl;

var points = [];

var NumTimesToSubdivide = 5;
;




// First, initialize the corners of our gasket with four points.
var a =vec2( -1, 1 );
var b =vec2( 1, 1 );
var c =vec2( 1, -1 );
var d =vec2( -1, -1 );


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    divideSquare( a, b, c,d,NumTimesToSubdivide);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

function square( a, b, c,d)
{
    points.push( a, b,c);
    points.push( a,d,c);

}

function divideSquare( a, b, c, d, count )
{

    // check for end of recursion

    if ( count === 0 ) {
        square( a, b, c ,d);
    }
    else {

        let min=1/3
        let max=2/3

        //bisect the sides


        var ab = mix( a, b, min ); //[-0.5, 1]
        var ba = mix( a, b, max ); //[0.5, 1]

        var bc = mix( b, c, min ); //[1, 0.5]
        var cb = mix( b, c, max ); //[1, -0.5]

        var cd = mix( c, d, min ); //[0.5, -1]
        var dc = mix( c, d, max); //[-0.5, -1]

        var ad = mix( a, d, min ); // [-1, 0.5]
        var da = mix( a, d, max ); //[-1, -0.5]

        
        

        var ac = mix(a,c,min); //[-0.5, 0.5]
        var ca = mix(a,c,max); //[0.5, -0.5]

        var bd = mix(b,d,min); //[0.5, 0.5]
        var db = mix(b,d,max);  //[-0.5, -0.5]
 

        --count;

        //  new Square

        //Top
        divideSquare( a, ab,ac,ad, count ); //Right
        divideSquare(ab,ba,bd,ac,count);     //center
        divideSquare(ba,b,bc,bd,count);     //Left
        
        //Center

        divideSquare(ad,ac,db,da,count);     //Left

        divideSquare(bd,bc,cb,ca,count);     //Right


        //Bottom
        divideSquare( da,db,dc,d, count ); //Right
        divideSquare(db,ca,cd,dc,count);     //center
        divideSquare(ca,cb,c,cd,count);     //left
        




        
;
    }
}


function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}