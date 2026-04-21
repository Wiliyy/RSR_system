
import { filterByField , filterByFieldStartsWith } from '../shared/utils/filters.js'
import vocabulary from '../data/vocabulary.json'
import { getSpecificLengthOfRandomNumbers , getRandomNumberForSpecificLimit } from '../shared/utils/random.js'

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

  test('get data length'  , () =>{
    console.log(data.length)
    expect(data.length).toBeGreaterThan(0)
  })

  test('get Qustions item and remove it from the copy data'  , () =>{
    Qustion_id = getRandomNumberForSpecificLimit(data.length)
    console.log(vocabulary[Qustion_id].word)
    data.splice(Qustion_id,1);
    console.log(data.length);
    expect(vocabulary.length).toBeGreaterThan(data.length)
  })

  test('get 3 unique random number', () =>{
    let arr3 = getSpecificLengthOfRandomNumbers(3 , data)
    Qustions = [...arr3] ;
    // +1 to include the last position (index 3) as a valid insert point
    Qustions.splice( getRandomNumberForSpecificLimit(Qustions.length+1) , 0 ,Qustion_id);
    // console.log(arr3)
    //console.log(Qustions)
    arr3.map((x,y)=>{
      console.log(vocabulary[x].word) 
    })
    expect(arr3.length).toBe(3)
  })

  test('use quistion number to get vocabulary by id ' , () =>{
    Qustions.map((Q , index)=>{
        console.log(vocabulary[Q].word)
    })
  })
 
  test('sumulate option chose', () => {
      //console.log(Qustions)
    Qustions.map(Q => console.log(vocabulary[Q].word) + "-" + console.log(vocabulary[Q].translation.split('').reverse().join('')) )
      let answer = getRandomNumberForSpecificLimit(Qustions.length) 
      console.log("----")
      console.log(vocabulary[Qustion_id].word)
      //console.log(answer)
      console.log(vocabulary[Qustions[answer]].word)
      console.log("----")
      console.log(Qustions[answer] == Qustion_id ? "this is the wright answer !" : "wrong try again")

  })

  test('after the answer selected'  , () => {
    // add question id to local storage with srs_system props
    let obj1 = { "id" : Qustion_id , ...default_SRS_system_props }
    local_storaage_simulate.push(obj1);
    console.log(local_storaage_simulate) 
    expect(local_storaage_simulate.length).toBeGreaterThan(0)
  })

})
