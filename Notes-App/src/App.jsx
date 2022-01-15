import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import {nanoid} from "nanoid"

export default function App() {
    
    // Lazily initialize our `notes` state so it doesn't
    // reach into localStorage on every single re-render
    // of the App component (Although the localStorage is 
    // accessed when the poage is reloaded)
    const [notes, setNotes] = React.useState( () => {
        // console.log("initialized notes array");
        return JSON.parse(localStorage.getItem('notes')) || []});
        
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    )
    
    // Whenver there's any changes made to the notes object, 
    // we want to save the changes to the localStorage. So use 
    // useEffect hook to do the same, as useEffect runs
    // whenever the 'notes' object changes
    React.useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes));
    }, [notes])
    
    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes]);
        setCurrentNoteId(newNote.id);
        
        //save the notes to localStorage
        localStorage.setItem('notes', JSON.stringify(notes));
    }
    
    function updateNote(text) {
        
        // rearrange the most recently-modified note to be at the top
        // store the contents of the oldNote array into a new 
        // array 
        // if the id matches put the updated note at the  
        // beginning of the new array
        // else, push the old note to the end of the new array
        
        setNotes(oldNotes => {
            const newArray = []
            for(let i = 0; i < oldNotes.length; i++) {
                const oldNote = oldNotes[i]
                if(oldNote.id === currentNoteId) {
                    newArray.unshift({ ...oldNote, body: text })
                } else {
                    newArray.push(oldNote)
                }
            }
            return newArray
        })
    }
    
    function deleteNote(event,noteId) {
        event.stopPropagation()
        setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
    }
    
    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
