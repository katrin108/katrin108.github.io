
var sidewalkPoints=[];
var streetPoints = [];



//number of streets
var street= 3;



var sidewalkHeigth=0.5;

var sidewalkPoints=[];



function map(){
    sidewalk(sidewalkHeigth)
    
 
    //update the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER,sidewalkBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,flatten(sidewalkPoints),gl.STATIC_DRAW);
}

function sidewalk(Heigth){

    var a1= vec2(-1,1);
    var b1=vec2(1,1);
    var c1 = vec2(1,(1-Heigth));
    var d1 = vec2(-1,(1-Heigth));
    sidewalkPoints.push(a1,b1,c1);
    sidewalkPoints.push(a1,c1,d1);

    var a2= vec2(-1,-1);
    var b2=vec2(1,-1);
    var c2 = vec2(1,(-1+Heigth));
    var d2 = vec2(-1,(-1+Heigth));
    sidewalkPoints.push(a2,b2,c2);
    sidewalkPoints.push(a2,c2,d2);
        

    

}



