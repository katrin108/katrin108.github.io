
var frog_Points = [];
var frogSize=0.08

//original starting point
//chances location while moving
var frog_loc= vec2(0,(-1+frogSize));

var frogSpeed=0.05

var frogColor=[0.4,0.8,0.26,1.0];

function frog(side){
    //clear previus points for the frog
    frog_Points=[]
    //head
    
    let a=vec2((frog_loc[0]-frogSize),frog_loc[1]); //left
    let b=vec2((frog_loc[0]+frogSize),frog_loc[1]);//righ

    
    let c=vec2(frog_loc[0],(frog_loc[1]+frogSize));//top
    let d=vec2(frog_loc[0],(frog_loc[1]-frogSize));//down




     switch (side){
        case "f":
            
            frog_Points.push(a,b,c);
            break;
        case "r":
            frog_Points.push(c,b,d);
            break;

        case "b":
            frog_Points.push(d,a,b);
            break;

        case "l":
            frog_Points.push(a,c,d);
            break;

     }
     points()//lisen to points

    //update the buffer
     
    gl.bindBuffer(gl.ARRAY_BUFFER,frogBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,flatten(frog_Points),gl.DYNAMIC_DRAW);
 
}
function frog_movement(e){

    var newLoc=vec2(frog_loc[0],frog_loc[1]);
    
    switch(e.key){

        case "ArrowUp":
            newLoc[1]=frog_loc[1]+frogSpeed;
            frog("f"); 

            break;
                
        case "ArrowRight":
            newLoc[0]=frog_loc[0]+frogSpeed;
            frog("r"); 

            break;
    
        case "ArrowDown":
            newLoc[1]=newLoc[1]-frogSpeed;
            frog("b");
            break;   
            
        case "ArrowLeft":
            newLoc[0]=frog_loc[0]-frogSpeed;
            frog("l"); 
            break;

             
        }

        if((newLoc[0]+frogSize)>1||(newLoc[0]-frogSize)<-1){
            return;
        }
        if((newLoc[1]+frogSize>1)||(newLoc[1]-frogSize)<-1){
            return;
        }
        else{
            frog_loc=newLoc;
        }
         
}








