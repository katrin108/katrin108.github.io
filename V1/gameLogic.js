function crash(){
    for (let i=0;i<cars.length;i++){
        const car=cars[i];
        const dx=Math.abs(car.position[0]-frog_loc[0]);
        const dy=Math.abs(car.position[1]-frog_loc[1]);
        const xCrash=dx<(carSize+frogSize);
        const yCrash=dy<(carSize+frogSize);
        if(xCrash&&yCrash){
           
            return true;
        }
    }
    return false;

        
}