// Function to load staff notes
function loadStaffNotes() {
    // Fetch staff notes from the API
    fetch('../api/get-staff-notes.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: sessionStorage.getItem('staffUser'),
            role: sessionStorage.getItem('staffRole')
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load notes');
        }
        return response.json();
    })
    .then(data => {
        const notesList = document.getElementById('staffNotesList');
        if (!notesList) return;
        
        // Clear existing notes
        notesList.innerHTML = '';
        
        if (data.notes.length === 0) {
            notesList.innerHTML = '<div class="no-notes">No notes found</div>';
            return;
        }
        
        // Add notes to the list
        data.notes.forEach(note => {
            const noteDate = new Date(note.timestamp);
            const formattedDate = noteDate.toLocaleDateString();
            
            const noteCard = document.createElement('div');
            noteCard.className = 'note-card';
            noteCard.innerHTML = `
                <div class="note-header">
                    <h4 class="note-title">${note.title}</h4>
                    <span class="note-date">${formattedDate}</span>
                </div>
                <div class="note-body">
                    <p>${note.content}</p>
                </div>
                <div class="note-footer">
                    <span class="note-visibility">
                        <i class="fas fa-eye"></i> ${capitalizeFirstLetter(note.visibility)}
                    </span>
                    <div class="note-actions">
                        ${note.author === sessionStorage.getItem('staffUser') ? `
                            <button class="edit-note" data-id="${note.id}"><i class="fas fa-edit"></i></button>
                            <button class="delete-note" data-id="${note.id}"><i class="fas fa-trash"></i></button>
                        ` : ''}
                    </div>
                </div>
            `;
            
            notesList.appendChild(noteCard);
        });
        
        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-note').forEach(btn => {
            btn.addEventListener('click', () => {
                const noteId = btn.getAttribute('data-id');
                alert(`Edit note: ${noteId}\nIn a real implementation, this would open a note edit form.`);
            });
        });
        
        document.querySelectorAll('.delete-note').forEach(btn => {
            btn.addEventListener('click', () => {
                const noteId = btn.getAttribute('data-id');
                if (confirm(`Are you sure you want to delete this note?`)) {
                    deleteStaffNote(noteId)
                        .then(() => {
                            // Remove note from the list
                            btn.closest('.note-card').remove();
                            
                            // Log activity
                            logActivity('note', 'Deleted staff note');
                        })
                        .catch(error => {
                            console.error('Error deleting note:', error);
                            alert('Error deleting note. Please try again.');
                        });
                }
            });
        });
    })
    .catch(error => {
        console.error('Error loading notes:', error);
        const notesList = document.getElementById('staffNotesList');
        if (notesList) {
            notesList.innerHTML = '<div class="error-message">Error loading notes</div>';
        }
    });
}

// Function to delete staff note
async function deleteStaffNote(noteId) {
    try {
        const response = await fetch('../api/delete-staff-note.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                noteId: noteId,
                user: sessionStorage.getItem('staffUser')
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete note');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting note:', error);
        throw error;
    }
}