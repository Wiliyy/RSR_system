import { filterByField , filterByFieldStartsWith } from '../shared/utils/filters.js'
import vocabulary from '../data/vocabulary.json'
import { getRandomNumberForSpecificLimit } from '../shared/utils/random.js'

let arr = [];
for(let i = 0; i < 10 ; i++){
  arr.push(i);
}

let first_launch = true ;
const user_limit = 10; 
const random_number =  Math.floor(Math.random(0,10) * 10);
const random_Q_index = (arr)=> Math.floor(Math.random() * 4);


const previos_vocabulary = 0; 
const visible = vocabulary.slice(0,user_limit);

test('get question from data ' , () => {
  const data = vocabulary.slice(0, user_limit);
  let Q_arr = [];
  console.log(random_Q_index(arr));
  console.log(data[random_number].translation)

  Q_arr.splice(random_Q_index(Q_arr) , 0 , data[random_number].word)
  Q_arr.splice(random_Q_index(Q_arr) , 0 , data[random_number - 1 > 0 ?random_number - 1 :random_number + 1 ].word)
  Q_arr.splice(random_Q_index(Q_arr) , 0 , data[random_number - 2 > 0 ?random_number - 2 :random_number+ 2 ].word)
  Q_arr.splice(random_Q_index(Q_arr) , 0 , data[random_number - 3 > 0 ?random_number - 3 :random_number + 3 ].word)

  Q_arr.map((x,y)=> {
    x==data[random_number].word ? console.log(x) : console.log("wrong")
    console.log(x) 
    console.log(x == data[random_number].word && "right")
  })

  expect(data.length).toBe(user_limit);
})


test('get 3 random number'  , () =>{
  let arr = [];

  while(arr.length <= 2) {
    let random_num = getRandomNumberForSpecificLimit(user_limit)
    if(!arr.includes(random_num)) { 
      arr.push(random_num)
    }
  }
  console.log("arr")
  console.log(arr)
})

/*
test('get data from the source ' , () => {
  const data = vocabulary.slice(0, user_limit);
  console.log(data)
  data.map((x,y)=>{
      console.log(x.word)
  })
  expect(data.length).toBe(user_limit);
})


test('test react test ' , () => {
  arr.splice(arr.indexOf(random_number) , 1);
  console.log(arr)
  expect(random_number).toBe(9);
})


test('test array length ' , () => {
  expect(arr.length).toBe(10);
})

test('test array filterByField' , () => {
  console.log(filterByFieldStartsWith(visible ,"tags", "e").length);
  expect(filterByFieldStartsWith(visible ,"tags", "e").length).toBe(2);
})

*/


