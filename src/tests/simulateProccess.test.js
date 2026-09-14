import { describe, expect, test } from 'vitest'
import {getRandomNumberForSpecificLimit } from '../shared/utils/random'

const dataLength = 4
const tested_id = getRandomNumberForSpecificLimit(dataLength) + 1

describe('simulate test ' , () => {

/* 
 logic for 
 get data from storage or the source or both   
*/

// get answer -> 1 random number from array // for example 6
test("get answer or tested item id " , ()=> {
    expect(tested_id).toBeGreaterThan(-1)
  } 
 )

// get option -> 3 random number from array and not include the answer ! // for example [2,4,8]

// merge the answer and options in one object // [2,4.8.6:'true']

// show answer and options like ? { 6 } : [4,6,8,2]

// add hundler on option to comparte it with answer // ? {6} : {6} "wright" or ? {4} : {6} "false"

/* 
 logic for 
 update data in storage or database  
*/

})
