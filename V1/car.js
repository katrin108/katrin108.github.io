
var carSize=0.08;

class Car{
    constructor(position,speed,direction,color){
        this.position=vec2(position[0],position[1]);
        this.speed = speed;
        this.direction=direction;
        this.color=color;
        
    }
    update(){
        if(crash()){

            restart();

            
        }
        if(this.direction===0){
            this.position[0]+=this.speed
         
        }
        else {
           this.position[0]-=this.speed
          

        }

        

         if(this.position[0]>(1+carSize)){
            this.color=randomCarColor();
            this.position[0]=(-1-carSize);
            
            
        }
        else if(this.position[0]<(-1-carSize)){
            this.color=randomCarColor();
            this.position[0]=(1+carSize);
            
        
        }


       
        
    }

    

}

//used for the color of the cars
function randomCarColor(){
    var r=Math.random();
    var g=Math.random();
    var b=Math.random();
    if(r + g + b >1){//make sure the car is not too dark
        return vec4(r,g,b,1);
    }
    else{
        return randomCarColor();
    }

    
}

function createCars(){
    carPoints=[];

    for(let car of cars){
        car.update();
       
    }
    CarPoints(cars);
   
}
function CarPoints(cars){
    carPoints=[];
     for (let i=0;i<cars.length;i++){
    
        var x = cars[i].position[0];
        var y= cars[i].position[1];
        
        a=vec2(x-carSize,y+carSize);
        b=vec2(x+carSize,y+carSize);
        c=vec2(x+carSize,y-carSize);
        d=vec2(x-carSize,y-carSize);

        carPoints.push(a,b,c);
        carPoints.push(a,c,d);
     }

    //update the buffer cars
    gl.bindBuffer(gl.ARRAY_BUFFER,carBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,flatten(carPoints),gl.DYNAMIC_DRAW);
  

}