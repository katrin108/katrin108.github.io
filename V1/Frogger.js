

var uColor;

 var vPosition;

 var sidewalkBuffer,frogBuffer;
 var program;


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.95, 1.0, 1.0, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    uColor = gl.getUniformLocation(program,"uColor");
    vPosition = gl.getAttribLocation(program, "vPosition");






    //make the sidewalk

    sidewalkBuffer=gl.createBuffer();
    map()
    
    //make the frog   
    frogBuffer=gl.createBuffer();


    frog("f");



    document.addEventListener("keydown", function(e) {
        frog_movement(e);
    });

    render();
}


function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

    // draw sidewalk
    gl.bindBuffer(gl.ARRAY_BUFFER, sidewalkBuffer);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    //color
    gl.uniform4fv(uColor, [0.7, 0.70, 0.7, 1.0]);  // light gray
    gl.drawArrays(gl.TRIANGLES, 0, sidewalkPoints.length);


    gl.bindBuffer(gl.ARRAY_BUFFER, frogBuffer);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);



    //color for the frog:
    gl.uniform4fv(uColor,[0.1,0.60,0.30,1.0]); //dark green
    //this is the frog
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, frog_Points.length );


    window.requestAnimFrame(render);
}