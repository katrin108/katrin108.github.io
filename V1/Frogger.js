

var uColor;

 var vPosition;

 var sidewalkBuffer,frogBuffer,roadBuffer,carBuffer,pointsBuffer;
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
    roadBuffer=gl.createBuffer();
    carBuffer=gl.createBuffer();
    pointsBuffer=gl.createBuffer();



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

    //carmovement
    
     for (let i=0;i<cars.length;i++){
        cars[i].update();
        CarPoints(cars);
      
     }

    // draw sidewalk
    gl.bindBuffer(gl.ARRAY_BUFFER, sidewalkBuffer);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    //color
    gl.uniform4fv(uColor, [0.60, 0.10, 0.90, 1.0]);  // sidewalk color
    gl.drawArrays(gl.TRIANGLES, 0, sidewalkPoints.length);


    //roads
    gl.bindBuffer(gl.ARRAY_BUFFER, roadBuffer);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.uniform4fv(uColor, [0, 0, 0, 1.0]);  // road color black
    gl.drawArrays(gl.TRIANGLES, 0, roadPoints.length);


    //cars
    gl.bindBuffer(gl.ARRAY_BUFFER, carBuffer);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    for(let i=0;i< cars.length;i++){
     
        gl.uniform4fv(uColor,cars[i].color);
        //6 is the points in the 2 cars 
        //need too be chanced if the number of cars chance
        gl.drawArrays(gl.TRIANGLES, i*6, 6);
    }
    




    gl.bindBuffer(gl.ARRAY_BUFFER, frogBuffer);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);



    //color for the frog:
    gl.uniform4fv(uColor,frogColor); //dark green
    //this is the frog
    gl.drawArrays(gl.TRIANGLES, 0, frog_Points.length );


    //Points
    if(pointsPoints!=0){
        gl.bindBuffer(gl.ARRAY_BUFFER, pointsBuffer);
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        gl.uniform4fv(uColor, [1.0, 1.0, 0.0, 1.0]);  //  yellow
        gl.drawArrays(gl.TRIANGLES, 0, pointsPoints.length);
    }
    


    window.requestAnimFrame(render);
}