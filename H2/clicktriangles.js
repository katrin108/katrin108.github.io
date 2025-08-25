/////////////////////////////////////////////////////////////////
//    Kóði byggður á Sýnidæmi í Tölvugrafík
//      Þar sem
//     Teiknar punkt á strigann þar sem notandinn smellir
//     með músinni
//
//    Hjálmtýr Hafsteinsson, ágúst 2025

//    Viðbætur til að vinna dæmi 4 í heimadæmi 2 Katrín Sig. 
/////////////////////////////////////////////////////////////////
var canvas;
var gl;

// Þarf hámarksfjölda punkta til að taka frá pláss í grafíkminni
var maxNumPoints = 200;  
var index = 0;

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
    
    
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8*maxNumPoints, gl.DYNAMIC_DRAW);
    
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    canvas.addEventListener("mousedown", function(e){

        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
        
        // Calculate coordinates of new point
        var t = vec2(2*e.offsetX/canvas.width-1, 2*(canvas.height-e.offsetY)/canvas.height-1);
         
        //Punktarnir sem eru fyrir Þríhyrninginn
        let a = vec2(t[0], t[1] + size);
        let b = vec2(t[0]- size, t[1] - size);
        let c = vec2(t[0]+ size, t[1] - size);
        // Add new point behind the others
        //Þeir eru settir í fylki og svo notar 
        // gl.TRIANGLES seinustu 3 punkta sem verða þá a,b og c
        gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(a));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+1), flatten(b));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+2), flatten(c));

    
        index+=3;
    } );

    render();
}


function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, index );
    window.requestAnimFrame(render);
}