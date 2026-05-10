
import { filterByField , filterByFieldStartsWith } from '../shared/utils/filters.js'
import vocabulary from '../data/vocabulary.json'
import { getSpecificLengthOfRandomNumbers , getRandomNumberForSpecificLimit } from '../shared/utils/random.js'
import { PopOptionsFromArray } from '../shared/utils/Qustion'

let local_storaage_simulate = [
   { id: 7, Repetition: 0, interval: 0, ease_factor: 2.5 },
   { id: 32, Repetition: 0, interval: 0, ease_factor: 2.5 }
]

let default_SRS_system_props = { "Repetition" : 0 , "interval" : 0 , "ease_factor" : 2.5 }

const user_limit = 10; 
const data = [...vocabulary];
let Qustions = [];
let Qustion_id = 0;

describe(' after get filterd data ' , () => {

  test('1- get data length'  , () =>{
    expect(data.length).toBeGreaterThan(0)
  })

  test('2- get Qustions item and remove it from the copy data'  , () =>{
    Qustion_id = getRandomNumberForSpecificLimit(data.length)
    data.splice(Qustion_id,1);
    expect(vocabulary.length).toBeGreaterThan(data.length)
    // expect(Qustion_id)
  })

  test('3- get 3 unique random number', () =>{
    PopOptionsFromArray(data , Qustion_id).map((Q)=>{
       // console.log(Q) 
    })
    // console.log(Qustion_id)
     let arr3 = getSpecificLengthOfRandomNumbers(3 , data)
     Qustions = [...arr3] ;
  })

  test('4- use quistion number to get vocabulary by id ' , () =>{
    Qustions.map((Q , index)=>{
      
        // console.log(vocabulary[Q].word)
    })
  })
 
  test('5- sumulate option chose', () => {
    //Qustions.map(Q => console.log(vocabulary[Q].word) + "-" + console.log(vocabulary[Q].translation.split('').reverse().join('')) )
      let answer = getRandomNumberForSpecificLimit(Qustions.length) 
  })

  test('6- after the answer selected'  , () => {
    let obj1 = { "id" : Qustion_id , ...default_SRS_system_props }
    local_storaage_simulate.push(obj1);
    // expect(local_storaage_simulate.length).toBeGreaterThan(0)
  })

})
