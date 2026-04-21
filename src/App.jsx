import { useState } from 'react'
import './App.css'
import { Card, Badge, Button } from './shared/components'
import vocabulary from './data/vocabulary.json'

const LIMIT = 10

function App() {
  const [limit, setLimit] = useState(LIMIT)
  const visible = vocabulary.slice(0, limit)
  // limit = 10 < 30
  const hasMore = limit < vocabulary.length

  return (
    <div style={{ padding: '32px 24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '640px', margin: '0 auto' }}>
        {visible.map((item , index) => (
          <Card key={item.id} elevated>
            <Card.Header>
              <span style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-h)' }}>
                {item.word}
              </span>
              <Badge variant={item.level === 'beginner' ? 'success' : item.level === 'intermediate' ? 'accent' : 'warning'}>
                {item.level}
              </Badge>
            </Card.Header>
            <Card.Body>
              <p style={{ margin: '0 0 8px', fontSize: '14px', color: 'var(--accent)', fontWeight: 500 }}>
                {item.translation}
              </p>
              <p style={{ margin: '0 0 12px', fontSize: '14px', color: 'var(--text)' }}>
                {item.meaning}
              </p>
              <p style={{ margin: 0, fontSize: '13px', fontStyle: 'italic', color: 'var(--text)', borderLeft: '3px solid var(--accent-border)', paddingLeft: '10px' }}>
                "{item.example}"
              </p>
            </Card.Body>
            <Card.Footer style={{ justifyContent: 'flex-start', gap: '6px' }}>
              {item.tags.map((tag) => (
                <Badge key={tag} variant="default">{tag}</Badge>
              ))}
            </Card.Footer>
          </Card>
        ))}
      </div>
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Button variant="secondary" onClick={() => setLimit((l) => l + LIMIT)}>
            Load more ({vocabulary.length - limit} remaining)
          </Button>
        </div>
      )}
    </div>
  )
}

export default App
