import { getRandomNumberForSpecificLimit , getSpecificLengthOfRandomNumbers } from "./random"
// get Qustions item and remove it from the copy data
export function PopQustionFromArray(data) {
      let Qustion_id = getRandomNumberForSpecificLimit(data.length)
      data.splice(Qustion_id,1);
      return Qustion_id;
}



//get 3 unique random number'
export function PopOptionsFromArray(data , Q_id) {
      let Qustions = [];
      let arr3 = getSpecificLengthOfRandomNumbers(3 , data)
      Qustions = [...arr3] ;
      // +1 to include the last position (index 3) as a valid insert point
      Qustions.splice( getRandomNumberForSpecificLimit(Qustions.length+1) , 0 ,Q_id);
      return Qustions
}
