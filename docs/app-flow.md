Repetition = how much answer correct 

interval = day number to next review 

/(2.5) = old_ease + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))

 

 

//

simulate proccess : 

get all data id = [1,2,3,4,5,6,,7,8, .....]

get data length = 10,11,.....

previos data llike in storage = [3=good,4=week,5=week,6=good,] 

storage length = default 0 



if storage 0 :

get option -> 4 random number from array // for example [2,4,6,8]

get answer -> 1 random number from array // for example 6

show answer and options like ? { 6 } : [4,6,8,2]

add hundler on option to comparte it with answer // ? {6} : {6} "wright" 



if "wright" :







//





Question process

- [x] get data length like = 10
- [x] get question item 
- [x] data length = 9
- [x] get three random number from the data 
- [ ] data length = 6
- [ ] store three items in array
- [ ] add question item in random number of the array 
- [ ] show the array as buttons
- [ ] check the clicked button with question item 
 



 

---

# Spaced Repetition Flashcard App
## Description
A flashcard application implementing the SM-2 spaced repetition algorithm for effective learning and memory retention. The app presents users with multiple-choice questions, tracks their performance, and schedules reviews based on the SM-2 algorithm to optimize long-term retention.

## Core Concepts
- **Repetition**: Tracks how many times an answer was correct
- **Interval**: Number of days until the next review
- **Ease Factor**: Calculated using the SM-2 formula to adjust difficulty
### SM-2 Ease Factor Formula
```
new_ease = old_ease + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
```
## Application Logic
### Data Structure
- **Data Pool**: Array of item IDs (e.g., `[1, 2, 3, 4, 5, 6, 7, 8, ...]` )
- **Storage**: Tracks previous answers with performance ratings (e.g., `{3: "good", 4: "weak", 5: "weak", 6: "good"}` )
### Question Generation Process
1. Get total data length (e.g., 10 items)
2. Select one item as the correct answer (question item)
3. Decrement available data length
4. Select 3 random items from remaining data as distractors
5. Store the 3 distractors in an array
6. Insert the correct answer at a random position in the array
7. Display all 4 options as clickable buttons
8. Compare clicked button with correct answer
### Game Flow
#### Initial State (Storage Empty)
1. Generate 4 random options from the data pool
2. Select 1 item as the correct answer
3. Display question with shuffled options
4. Attach click handlers to compare selection with answer
#### On Correct Answer
- Update repetition count
- Calculate new ease factor using SM-2 formula
- Calculate next review interval
- Store result in storage
#### On Incorrect Answer
- Reset repetition count
- Adjust ease factor
- Schedule for sooner review
## Implementation Steps
### Step 1: Data Layer
- Create data structure for flashcard items
- Implement storage mechanism for tracking progress
### Step 2: SM-2 Algorithm
- Implement ease factor calculation
- Implement interval calculation
- Create function to update card statistics
### Step 3: Question Generator
- Function to select random items from pool
- Function to generate options array with correct answer
- Shuffle algorithm for randomizing option positions
### Step 4: UI Components
- Question display component
- Option buttons component
- Feedback display (correct/incorrect)
### Step 5: Game Loop
- Initialize game state
- Handle user input
- Update storage after each answer
- Load next question
## API Reference
### Core Functions (To Implement)
| Function | Parameters | Returns | Description |
| ----- | ----- | ----- | ----- |
| `calculateEase`  | `oldEase`, `grade`  | `number`  | Calculates new ease factor |
| `calculateInterval`  | `repetition`, `ease`  | `number`  | Calculates days until next review |
| `generateQuestion`  | `dataPool`, `count`  | `Question`  | Creates question with options |
| `checkAnswer`  | `selected`, `correct`  | `boolean`  | Validates user answer |
| `updateStorage`  | `itemId`, `result`  | `void`  | Persists learning progress |
### Data Types (To Define)
```typescript
interface FlashcardItem {
  id: number;
  // content fields TBD
}

interface StorageEntry {
  itemId: number;
  repetition: number;
  ease: number;
  interval: number;
  lastReview: Date;
  rating: "good" | "weak";
}

interface Question {
  answer: FlashcardItem;
  options: FlashcardItem[];
}
```
## Current Progress
- [x] Get data length
- [x] Get question item
- [x] Update data length after selection
- [x] Get three random items from remaining data
- [ ] Store three items in options array
- [ ] Insert question item at random position
- [ ] Display options as buttons
- [ ] Implement answer checking
## Contributing
This project is in early development. Follow the implementation steps sequentially, completing each step before moving to the next.





