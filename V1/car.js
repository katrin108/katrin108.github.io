
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

/*
            const lose=document.createElement('h2');
            lose.textContent="Game Over!";
            document.body.appendChild(lose);

*/

            //original starting point
            frog_loc=vec2(0,(-1+frogSize));


            //points reset after death
            pointsCounter=0;
            
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
    return vec4(Math.random(),Math.random(),(Math.random()),1);
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