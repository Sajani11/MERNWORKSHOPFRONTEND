import { useState, useEffect } from 'react'
import NoteForm from './components/NoteForm'
import NoteList from './components/NoteList'
import './App.css'

const API_URL = `${import.meta.env.VITE_API_URL}/notes`

function App() {
  const [notes, setNotes] = useState([])
  const [editingNote, setEditingNote] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotes()
  }, [])

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      setNotes(data)
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setLoading(false)
    }
  }

 const addNote = async (note) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    })

    const data = await response.json()
    setNotes(prevNotes => [data, ...prevNotes])  // ← use prevNotes here
  } catch (error) {
    console.error('Error adding note:', error)
  }
}

  // // Add note
  // const addNote = async (note) => {
  //   try {
  //     const response = await fetch(API_URL, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(note),
  //     })

  //     const data = await response.json()
  //     setNotes([data, ...notes])
  //   } catch (error) {
  //     console.error('Error adding note:', error)
  //   }
  // }

  // Update note
const updateNote = async (id, updatedNote) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedNote),
    })

    const data = await response.json()

    setNotes(prevNotes =>
      prevNotes.map(note => (note._id === id ? data : note))
    )

    setEditingNote(null)
  } catch (error) {
    console.error('Error updating note:', error)
  }
}


//Delete note 
  const deleteNote = async (id) => {
  try {
      await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    })

    setNotes(notes.filter(note => note._id !== id))
    
  } catch (error) {
    console.error('Error deleting note:', error)
  }
}


  return (
    <div className="app">
      <header className="header">
        <h1>Notes App</h1>
      </header>

      <main className="main">
      <NoteForm
  key={editingNote?._id || 'new'}
  onSubmit={
    editingNote
      ? (note) => updateNote(editingNote._id, note)
      : addNote
  }
  editingNote={editingNote}
  onCancel={() => setEditingNote(null)}
/>


        {loading ? (
          <p>Loading notes...</p>
        ) : (
          <NoteList
            notes={notes}
            onEdit={setEditingNote}
            onDelete={deleteNote}
          />
        )}
      </main>

      <footer className="footer">
        <p>Notes App - Powered by API</p>
      </footer>
    </div>
  )
}

export default App
