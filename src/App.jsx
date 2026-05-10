import { useState , useEffect } from 'react'
import './App.css'
import { Card, Badge, Button } from './shared/components'
import {PopQustionFromArray , PopOptionsFromArray } from './shared/utils/Qustion'
import { getRandomNumberForSpecificLimit , getSpecificLengthOfRandomNumbers } from "../src/shared/utils/random"
import vocabulary from './data/vocabulary.json'

const LIMIT = 10

function App() {
  const [limit, setLimit] = useState(LIMIT)
  const visible = vocabulary.slice(0, limit)
  // limit = 10 < 30
  const hasMore = limit < vocabulary.length
  let Q_id = PopQustionFromArray(visible) 
  let item = visible[Q_id] ?? {};

  
  return (
    <div style={{ padding: '32px 24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '640px', margin: '0 auto' }}>

        <h1>
          {getRandomNumberForSpecificLimit()}
        </h1>
            <Card.Body>
              <p style={{ margin: '0 0 8px', fontSize: '14px', color: 'var(--accent)', fontWeight: 500 }}>
                {visible[Q_id].word + "-" +Q_id}
              </p>
            </Card.Body>
        {
          PopOptionsFromArray(visible , Q_id).map((item , index) => ( 
          <Card
              onClick={()=>{
                //console.log(item)
                //console.log(visible[item].id)
                console.log(
                visible[item].id == Q_id ? "wright" : "wrong"
              )
                Q_id = PopOptionsFromArray(visible);
                item = visible[Q_id] ?? {};
              }}
              key={visible[item].id} elevated>
            <Card.Body>
              <p style={{ margin: '0 0 12px', fontSize: '14px', color: 'var(--text)' }}>
                {visible[item].translation + "-" +visible[item].id}
              </p>
            </Card.Body>
            {/*

            <Card.Header>
              <span style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-h)' }}>
                {visible[item].word}
              </span>
              <Badge variant={item.level === 'beginner' ? 'success' : item.level === 'intermediate' ? 'accent' : 'warning'}>
                {visible[item].level}
              </Badge>
            </Card.Header>
            <Card.Body>
              <p style={{ margin: '0 0 8px', fontSize: '14px', color: 'var(--accent)', fontWeight: 500 }}>
                {visible[item].translation}
              </p>
              <p style={{ margin: '0 0 12px', fontSize: '14px', color: 'var(--text)' }}>
                {visible[item].meaning}
              </p>
              <p style={{ margin: 0, fontSize: '13px', fontStyle: 'italic', color: 'var(--text)', borderLeft: '3px solid var(--accent-border)', paddingLeft: '10px' }}>
                "{visible[item].example}"
              </p>
            </Card.Body>
            <Card.Footer style={{ justifyContent: 'flex-start', gap: '6px' }}>
              {visible[item].tags.map((tag) => (
                <Badge key={tag} variant="default">{tag}</Badge>
              ))}
            </Card.Footer>
                */
              }  
          </Card>
        ))
        }
      </div>
      {
        /* 
        hasMore && (
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Button variant="secondary" onClick={() => setLimit((l) => l + LIMIT)}>
            Load more ({vocabulary.length - limit} remaining)
          </Button>
        </div>
      )
          */
      }
    </div>
  )
}

export default App
