import { getRandomNumberForSpecificLimit , getSpecificLengthOfRandomNumbers } from "./random"
// pick a random index for the question item, without mutating the pool
export function PopQustionFromArray(data) {
      return getRandomNumberForSpecificLimit(data.length)
}



// get 3 unique distractor indices (excluding Q_id) and insert Q_id at a random position
export function PopOptionsFromArray(data , Q_id) {
      const distractorCount = Math.min(3, Math.max(0, data.length - 1))
      let Qustions = getSpecificLengthOfRandomNumbers(distractorCount , data , [Q_id])
      // +1 to include the last position (index 3) as a valid insert point
      Qustions.splice( getRandomNumberForSpecificLimit(Qustions.length+1) , 0 ,Q_id);
      return Qustions
}
