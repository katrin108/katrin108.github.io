

class Car{
    constructor(position,speed,direction,color){
        this.position=vec2(position[0],position[1]);
        this.speed = speed;
        this.direction=direction;
        this.color=color;
        
    }
    update(){
        if(crash()){
            
            //original starting point
            frog_loc=vec2(0,(-1+frogSize));


            //original color
            frogColor=[0.4,0.8,0.26,1.0];
            
        }
        if(this.direction===1){
            this.position[0]+=this.speed
        }
        else if(this.direction===-1){
            this.position[0]-=this.speed
        }

        

         if(this.position[0]>(1+carSize)){
            this.color=randomColor();
            this.position[0]=(-1-carSize);
            
            
        }
        else if(this.position[0]<(-1-carSize)){
            this.color=randomColor();
            this.position[0]=(1+carSize);
            
        
        }


       
        
    }

    

}
//used for the color of the cars
function randomColor(){
    return [Math.random(),(Math.random()+0.2),(Math.random()),1];
}

function createCars(){
    carPoints=[];

    for(let car of cars){
        car.update();
       
    }
    CarPoints(cars);
   
    //update the buffer cars
    gl.bindBuffer(gl.ARRAY_BUFFER,carBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,flatten(carPoints),gl.STATIC_DRAW);
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
    gl.bufferData(gl.ARRAY_BUFFER,flatten(carPoints),gl.STATIC_DRAW);

}