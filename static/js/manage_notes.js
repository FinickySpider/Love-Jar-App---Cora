document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
    loadPulledNotes();
});

function loadNotes() {
    fetch('/api/get_notes')
        .then(response => response.json())
        .then(data => {
            const notesList = document.getElementById('notes-list');
            notesList.innerHTML = '';
            data.forEach(note => {
                const noteItem = document.createElement('div');
                noteItem.classList.add('note-item');

                const noteContent = document.createElement('p');
                noteContent.innerText = note.content;
                noteContent.style.fontFamily = note.font;
                noteItem.appendChild(noteContent);

                const editButton = document.createElement('button');
                editButton.innerText = 'Edit';
                editButton.onclick = () => editNote(note.id, noteContent);
                noteItem.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Delete';
                deleteButton.onclick = () => deleteNote(note.id);
                noteItem.appendChild(deleteButton);

                notesList.appendChild(noteItem);
            });
        })
        .catch(error => console.error('Error loading notes:', error));
}

function loadPulledNotes() {
    fetch('/api/get_pulled_notes')
        .then(response => response.json())
        .then(data => {
            const pulledNotesList = document.getElementById('pulled-notes-list');
            pulledNotesList.innerHTML = '';
            data.forEach(note => {
                const noteItem = document.createElement('div');
                noteItem.classList.add('pulled-note-item');

                const noteContent = document.createElement('p');
                noteContent.innerText = note.content;
                noteContent.style.fontFamily = note.font;
                noteItem.appendChild(noteContent);

                const editButton = document.createElement('button');
                editButton.innerText = 'Edit';
                editButton.onclick = () => editPulledNote(note.id, noteContent);
                noteItem.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Delete';
                deleteButton.onclick = () => deletePulledNote(note.id);
                noteItem.appendChild(deleteButton);

                pulledNotesList.appendChild(noteItem);
            });
        })
        .catch(error => console.error('Error loading pulled notes:', error));
}

function editNote(noteId, noteContent) {
    const newContent = prompt('Edit your note:', noteContent.innerText);
    const newFont = prompt('Edit the font:', noteContent.style.fontFamily);

    if (newContent !== null && newFont !== null) {
        fetch(`/api/edit_note/${noteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: newContent, font: newFont })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                noteContent.innerText = newContent;
                noteContent.style.fontFamily = newFont;
            } else {
                alert('Error editing note.');
            }
        })
        .catch(error => console.error('Error editing note:', error));
    }
}

function editPulledNote(noteId, noteContent) {
    const newContent = prompt('Edit your note:', noteContent.innerText);
    const newFont = prompt('Edit the font:', noteContent.style.fontFamily);

    if (newContent !== null && newFont !== null) {
        fetch(`/api/edit_pulled_note/${noteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: newContent, font: newFont })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                noteContent.innerText = newContent;
                noteContent.style.fontFamily = newFont;
            } else {
                alert('Error editing pulled note.');
            }
        })
        .catch(error => console.error('Error editing pulled note:', error));
    }
}

function deleteNote(noteId) {
    if (confirm('Are you sure you want to delete this note?')) {
        fetch(`/api/delete_note/${noteId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                loadNotes();
            } else {
                alert('Error deleting note.');
            }
        })
        .catch(error => console.error('Error deleting note:', error));
    }
}

function deletePulledNote(noteId) {
    if (confirm('Are you sure you want to delete this pulled note?')) {
        fetch(`/api/delete_pulled_note/${noteId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                loadPulledNotes();
            } else {
                alert('Error deleting pulled note.');
            }
        })
        .catch(error => console.error('Error deleting pulled note:', error));
    }
}

function purgeNotes() {
    if (confirm('Are you sure you want to purge all notes?')) {
        fetch('/api/purge_notes', {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                loadNotes();
            } else {
                alert('Error purging notes.');
            }
        })
        .catch(error => console.error('Error purging notes:', error));
    }
}

function purgePulledNotes() {
    if (confirm('Are you sure you want to purge all pulled notes?')) {
        fetch('/api/purge_pulled_notes', {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                loadPulledNotes();
            } else {
                alert('Error purging pulled notes.');
            }
        })
        .catch(error => console.error('Error purging pulled notes:', error));
    }
}
