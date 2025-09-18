/////////////////////////////////////////////////////////////////
//    Sýnidæmi í Tölvugrafík
//     Teikna nálgun á hring sem TRIANGLE_FAN
//
//    Hjálmtýr Hafsteinsson, ágúst 2025



//Breytið sýnisforritinu circlefan þannig að hringurinn sé teygður uppá við á reglubundinn
//hátt. Gerið það með því að nota uniform-breytuna time, svipað og gert er í
//sýnisforritinu waveTriangle (þið þurfið að breyta formúlunni sem er í hnútalitaranum
//þar). Skilið kóða hnútalitarans og hlekk á forritið
/////////////////////////////////////////////////////////////////
var canvas;
var gl;


// numCirclePoints er fjöldi punkta á hringnum
// Heildarfjöldi punkta er tveimur meiri (miðpunktur + fyrsti punktur kemur tvisvar)
var numCirclePoints = 20;       

var radius = 0.5;
var center = vec2(0, 0);

var points = [];


var color = vec4( 1.0, 0.0, 0.0, 1.0 );
var locColor;
var locTime;
var iniTime;

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
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
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    locColor = gl.getUniformLocation( program, "rcolor" );
    gl.uniform4fv( locColor, flatten(color) );
    locTime = gl.getUniformLocation( program, "time" );

    iniTime = Date.now();


    canvas.addEventListener("mousedown", function(e){
        var col = vec4( Math.random(), Math.random(), Math.random(), 1.0 );
        gl.uniform4fv( locColor, flatten(col) );
        
    } );
    
    render();
}


// Create the points of the circle
function createCirclePoints( cent, rad, k ) //center, radius, numCirclePoints
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
    //Set the color
    gl.clear( gl.COLOR_BUFFER_BIT );
    var msek = Date.now() - iniTime;
    gl.uniform1f( locTime, msek );
    
    // Draw circle using Triangle Fan
    gl.drawArrays( gl.TRIANGLE_FAN, 0, numCirclePoints+2 );

    window.requestAnimFrame(render);
}