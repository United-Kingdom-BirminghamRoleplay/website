// Functions for staff note actions

// Delete staff note
function deleteStaffNote(noteId) {
    try {
        const data = getStaffNotes();
        const noteIndex = data.notes.findIndex(note => note.id === noteId);
        
        if (noteIndex === -1) {
            throw new Error('Note not found');
        }
        
        // Remove the note
        data.notes.splice(noteIndex, 1);
        
        localStorage.setItem('ukbrum_staff_notes', JSON.stringify(data));
        return { success: true };
    } catch (error) {
        console.error('Error deleting note:', error);
        throw error;
    }
}

// Edit staff note
function editStaffNote(noteId, updatedNote) {
    try {
        const data = getStaffNotes();
        let noteFound = false;
        
        for (let i = 0; i < data.notes.length; i++) {
            if (data.notes[i].id === noteId) {
                // Update note properties but preserve id, author, and creation timestamp
                const originalNote = data.notes[i];
                data.notes[i] = {
                    ...originalNote,
                    title: updatedNote.title || originalNote.title,
                    content: updatedNote.content || originalNote.content,
                    visibility: updatedNote.visibility || originalNote.visibility,
                    editedAt: new Date().toISOString()
                };
                noteFound = true;
                break;
            }
        }
        
        if (!noteFound) {
            throw new Error('Note not found');
        }
        
        localStorage.setItem('ukbrum_staff_notes', JSON.stringify(data));
        return { success: true };
    } catch (error) {
        console.error('Error editing note:', error);
        throw error;
    }
}