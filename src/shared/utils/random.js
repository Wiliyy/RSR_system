export function getRandomNumberForSpecificLimit(length = 4) {
  let num = Math.floor(Math.random() * length)
  return num;
}

export function getSpecificLengthOfRandomNumbers(random_length = 3 , data = []) {
  let arr = [];

  while(arr.length <= 2) {
    let random_num = getRandomNumberForSpecificLimit(data.length)
    if(!arr.includes(random_num)) { 
      arr.push(random_num)
    }
  }
  return arr;
}
