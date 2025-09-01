
var frog_Points = [];
size=0.05

//original starting point
//chances location while moving
var frog_loc= vec2(0,0)

var frogSpeed=0.05



function frog(side){
    //clear previus points for the frog
    frog_Points=[]

    let a=vec2(frog_loc[0]-size,frog_loc[1]+size);
    let b=vec2(frog_loc[0]+size,frog_loc[1]+size);
    let c=vec2(frog_loc[0]+size,frog_loc[1]-size);
    let d=vec2(frog_loc[0]-size,frog_loc[1]-size);
    let e;

     switch (side){
        case "f":
            e=vec2(frog_loc[0],frog_loc[1]+(size*2));
            frog_Points.push(e,a,b,d,c);            
            break;
        case "r":
            e=vec2(frog_loc[0]+(size*2),frog_loc[1]);
            frog_Points.push(e,b,c,a,d);
            break;

        case "b":
            e=vec2(frog_loc[0],frog_loc[1]-(size*2));
            frog_Points.push(e,c,d,b,a);
            break;

        case "l":
            e=vec2(frog_loc[0]-(size*2),frog_loc[1]);
            frog_Points.push(e,a,d,b,c);
            break;

     }
    //update the buffer

    gl.bindBuffer(gl.ARRAY_BUFFER,frogBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,flatten(frog_Points),gl.STATIC_DRAW);
 
}
function frog_movement(e){

    var newLoc=vec2(frog_loc[0],frog_loc[1]);
    
    switch(e.key){

        case "ArrowUp":
            newLoc[1]=frog_loc[1]+frogSpeed
            frog("f"); 

            break;
                
        case "ArrowRight":
            newLoc[0]=frog_loc[0]+frogSpeed
            frog("r"); 

            break;
    
        case "ArrowDown":
            newLoc[1]=newLoc[1]-frogSpeed
            frog("b");
            break;   
            
        case "ArrowLeft":
            newLoc[0]=frog_loc[0]-frogSpeed
            frog("l"); 
            break;

             
        }

        if(newLoc[0]>(1-size)||newLoc[0]<(-1+size)){
            return;
        }
        if(newLoc[1]>(1-size)||newLoc[1]<(-1+size)){
            return;
        }
        else{
            frog_loc=newLoc;
        }
         
}








