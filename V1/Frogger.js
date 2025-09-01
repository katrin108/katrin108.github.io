var canvas;
var gl;

// Þarf hámarksfjölda punkta til að taka frá pláss í grafíkminni
var maxNumPoints = 200;  
var index = 0;

var uColor;

//Stærð þríhyrninga
var size=0.05


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.95, 1.0, 1.0, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    uColor = gl.getUniformLocation(program,"uColor");
    
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8*maxNumPoints, gl.DYNAMIC_DRAW);
    
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    //make the frog 
    frog("f");


    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(frog_Points));
    document.addEventListener("keydown", function(e) {
        frog_movement(e);
    });

    render();
}


function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

    //color for the frog:
    gl.uniform4fv(uColor,[0.1,0.60,0.30,1.0]);
    //this is the frog
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, frog_Points.length );
    window.requestAnimFrame(render);
}