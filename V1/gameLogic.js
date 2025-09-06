var pointsCounter=0;
var pointsPoints=[];



function crash(){
    for (let i=0;i<cars.length;i++){
        const car=cars[i];
        const dx=Math.abs(car.position[0]-frog_loc[0]);
        const dy=Math.abs(car.position[1]-frog_loc[1]);


        const xCrash=dx<(carSize+(frogSize/2));
        const yCrash=dy<(carSize+(frogSize/2));
        if(xCrash&&yCrash){
            
            pointsPoints=[];
         
            return true;
        }
    }
    return false;

        
}

function points(){
    if(frog_loc[1]>(1-sidewalkHeigth)&&(pointsCounter%2)==0){
        ++pointsCounter
        pointsLoc()

        console.log(pointsCounter);
    }
    else if(frog_loc[1]<(sidewalkHeigth-1)&&(pointsCounter%2)!=0){
        ++pointsCounter
        pointsLoc()


    }

    //add winnig the game.... TODO
    
}

function pointsLoc(){

   
    if(pointsCounter%5==0){
        var a= vec2(0.95-((pointsCounter-1)*0.04),0.95);
        var b= vec2(0.95-((pointsCounter-4)*0.04),0.85);

        var c= vec2(0.96-((pointsCounter-1)*0.04),0.95);
        var d= vec2(0.96-((pointsCounter-4)*0.04),0.85);
        pointsPoints.push(a,b,c);
        pointsPoints.push(b,c,d);


    }
    else{
        var a= vec2(0.95-(pointsCounter*0.04),0.95);
        var b= vec2(0.95-(pointsCounter*0.04),0.85);
        var c= vec2(0.96-(pointsCounter*0.04),0.95);
        var d= vec2(0.96-(pointsCounter*0.04),0.85);
        pointsPoints.push(a,b,c);
        pointsPoints.push(b,c,d);

    }



    gl.bindBuffer(gl.ARRAY_BUFFER,pointsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,flatten(pointsPoints),gl.DYNAMIC_DRAW);
    
        //TODO 
        //laga þegar það á að núllast út
}
