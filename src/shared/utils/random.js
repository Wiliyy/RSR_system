// it should return value from 0 to 3 
export function getRandomNumberForSpecificLimit(length = 4) {
  let num = Math.floor(Math.random() * length)
  return num;
}

export function getSpecificLengthOfRandomNumbers(random_length = 2 , data = []) {
  let arr = [];

  while(arr.length <= random_length) {
    let random_num = getRandomNumberForSpecificLimit(data.length)
    if(!arr.includes(random_num)) { 
      arr.push(random_num)
    }
  }
  return arr;
}
