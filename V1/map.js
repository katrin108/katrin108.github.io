
var sidewalkPoints=[];
var streetPoints = [];



//number of roads
var lanes= 3;



var sidewalkHeigth=0.2;

var sidewalkPoints=[];

var roadPoints=[];

var carPoints=[];

var cars=[]

var carSize=0.08;

function map(){
    sidewalk(sidewalkHeigth);
    road();
 
    //update the buffer sidewalk
    gl.bindBuffer(gl.ARRAY_BUFFER,sidewalkBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,flatten(sidewalkPoints),gl.STATIC_DRAW);

    

    //update the buffer road
    gl.bindBuffer(gl.ARRAY_BUFFER,roadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,flatten(roadPoints),gl.STATIC_DRAW);


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
function road(){
    
    var h=(2-(sidewalkHeigth*2))/lanes;
    
    var laneBottom=-1 + sidewalkHeigth; 
    for(var i=1; i <= lanes;++i){
        laneTopp=laneBottom+h;
        a=vec2(-1,laneBottom);
        b=vec2(1,laneBottom);
        c=vec2(1,laneTopp);
        d=vec2(-1,laneTopp);

        roadPoints.push(a,b,c);
        roadPoints.push(a,c,d);
        

        let y = (laneTopp+laneBottom)/2

        let r=Math.random();


        let car1=new Car(vec2(r,y),(0.005*i),1,randomColor());
        let car2=new Car(vec2(-r,y),(0.005*i),1,randomColor());
        cars.push(car1);
        cars.push(car2);
        console.log(car1.position);
        laneBottom+=h;

        
    }
    createCars();

}




