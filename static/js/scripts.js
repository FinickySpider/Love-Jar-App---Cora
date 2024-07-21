document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/get_note_count')
        .then(response => response.json())
        .then(data => {
            document.getElementById('notes-left').innerText = data.count;
        })
        .catch(error => console.error('Error fetching note count:', error));
});

function pullNote() {
    fetch('/api/get_note')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                return;
            }
            const noteContent = document.getElementById('note-content');
            noteContent.innerText = data.content;
            noteContent.style.fontFamily = data.font;
            document.getElementById('note').style.display = 'block';
            document.getElementById('jar').style.display = 'none';
            document.getElementById('gallery-button-container').style.display = 'none';
            document.getElementById('gallery').style.display = 'none';
            document.getElementById('notes-left').innerText = parseInt(document.getElementById('notes-left').innerText) - 1;
        })
        .catch(error => console.error('Error fetching note:', error));
}

function putAwayNote() {
    document.getElementById('note').style.display = 'none';
    document.getElementById('jar').style.display = 'block';
    document.getElementById('gallery-button-container').style.display = 'flex';
}

function showGallery() {
    fetch('/api/get_pulled_notes')
        .then(response => response.json())
        .then(data => {
            const gallery = document.getElementById('gallery');
            gallery.innerHTML = '';
            data.forEach(note => {
                const noteElement = document.createElement('div');
                noteElement.classList.add('note');
                noteElement.innerText = note.content;
                noteElement.style.fontFamily = note.font;
                gallery.appendChild(noteElement);
            });
            gallery.style.display = 'flex';
        })
        .catch(error => console.error('Error fetching pulled notes:', error));
}

function submitNote() {
    const content = document.getElementById('note-content-input').value;
    const font = document.getElementById('note-font-input').value;

    if (!content) {
        alert('Content is required');
        return;
    }

    if (!confirm('Are you sure you want to submit this note?')) {
        return;
    }

    fetch('/api/submit_note', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content, font })
    })
    .then(response => response.json())
    .then(data => {
        const statusMessage = document.getElementById('status-message');
        statusMessage.innerText = data.message;

        if (!data.error) {
            document.getElementById('note-content-input').value = '';
            document.getElementById('note-preview').style.display = 'none';
        }

        setTimeout(() => {
            statusMessage.innerText = '';
        }, 3000);
    })
    .catch(error => {
        console.error('Error submitting note:', error);
    });
}

window.addEventListener('beforeunload', (event) => {
    const content = document.getElementById('note-content-input').value;
    if (content) {
        event.preventDefault();
        event.returnValue = '';
    }
});
