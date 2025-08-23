/////////////////////////////////////////////////////////////////
//    Sýnidæmi í Tölvugrafík
//     Teikna nálgun á hring sem TRIANGLE_FAN
//
//    Hjálmtýr Hafsteinsson, ágúst 2025


//      Heimadæmi 2
//      Dæmi 2 
//      Þið eigið að breyta circlefan þannig að hægt sé að nota sleða til að velja fjölda
//      punkta sem notaður er til að nálga hringinn. Leyfið notanda að velja gildi frá 3 til 50. Skilið
//      skjámynd og hlekk á forritið.

//          Katrín Sig.
/////////////////////////////////////////////////////////////////
var canvas;
var gl;


// numCirclePoints er fjöldi punkta á hringnum
// Heildarfjöldi punkta er tveimur meiri (miðpunktur + fyrsti punktur kemur tvisvar)
var numCirclePoints = 3;       

var radius = 0.5;
var center = vec2(0, 0);

var points = [];

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // First, initialize
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

  

    
	// Create the circle
    createCirclePoints( center, radius, numCirclePoints );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);


    //Þessi lína var færð í render fyrir sleðan: 
    //gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    
    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);


    // Kóðabúti frá gasket5 sem nær í töluna í sleðanum
    document.getElementById("slider").onchange = function(event) {
        numCirclePoints = Number(event.target.value);
        render();
    };    
    render();
}



// Create the points of the circle
function createCirclePoints( cent, rad, k )
{
    points = [];
    points.push( center );
    
    var dAngle = 2*Math.PI/k;
    for( i=k; i>=0; i-- ) {
    	a = i*dAngle;
    	var p = vec2( rad*Math.sin(a) + cent[0], rad*Math.cos(a) + cent[1] );
    	points.push(p);
    }
}



function render() {

    // Create the points of the circle

    createCirclePoints(center, radius, numCirclePoints);

    // Reallocate and load the new set of points into the GPU buffer
    // Var færð frá init() svo að hringurinnn breytist ef sleðinn hreyfist 
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    
    gl.clear( gl.COLOR_BUFFER_BIT );


    
    // Draw circle using Triangle Fan
    gl.drawArrays( gl.TRIANGLE_FAN, 0, numCirclePoints+2 );


}