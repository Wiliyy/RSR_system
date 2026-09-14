import { describe, expect, test } from 'vitest'
import vocabulary from '../data/vocabulary.json'
import { getSpecificLengthOfRandomNumbers , getRandomNumberForSpecificLimit } from '../shared/utils/random.js'
import { PopOptionsFromArray } from '../shared/utils/Qustion'

let local_storaage_simulate = [
   { id: 7, Repetition: 0, interval: 0, ease_factor: 2.5 },
   { id: 32, Repetition: 0, interval: 0, ease_factor: 2.5 }
]

let default_SRS_system_props = { "Repetition" : 0 , "interval" : 0 , "ease_factor" : 2.5 }

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
    expect(PopOptionsFromArray(data , Qustion_id)).toContain(Qustion_id)
     let arr3 = getSpecificLengthOfRandomNumbers(3 , data)
     Qustions = [...arr3] ;
     expect(new Set(Qustions).size).toBe(3)
  })

  test('4- use quistion number to get vocabulary by id ' , () =>{
    expect(Qustions.every((questionIndex) => vocabulary[questionIndex])).toBe(true)
  })
 
  test('5- sumulate option chose', () => {
    const answer = getRandomNumberForSpecificLimit(Qustions.length)
    expect(answer).toBeLessThan(Qustions.length)
  })

  test('6- after the answer selected'  , () => {
    let obj1 = { "id" : Qustion_id , ...default_SRS_system_props }
    local_storaage_simulate.push(obj1);
    expect(local_storaage_simulate).toContain(obj1)
  })

})
