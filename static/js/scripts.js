document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/get_note_count')
        .then(response => response.json())
        .then(data => {
            document.getElementById('notes-left').innerText = data.count;
        })
        .catch(error => console.error('Error fetching note count:', error));
});

function pullNote() {
    const jarImg = document.querySelector('#jar img');
    if (jarImg.classList.contains('clicked')) return;

    jarImg.classList.add('clicked');
    fetch('/api/get_note')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                jarImg.classList.remove('clicked');
                jarImg.src = '/static/images/jar_empty.png';
                return;
            }
            document.querySelector('h1').style.display = 'none';
            document.querySelector('h3').style.display = 'none';
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
    const jarImg = document.querySelector('#jar img');
    jarImg.classList.remove('clicked');
    document.getElementById('gallery-button-container').style.display = 'flex';
    document.querySelector('h1').style.display = 'block';
    document.querySelector('h3').style.display = 'block';
}

function toggleGallery() {
    const gallery = document.getElementById('gallery');
    const button = document.getElementById('gallery-button');
    if (gallery.style.display === 'none') {
        gallery.style.display = 'flex';
        button.innerText = 'Hide Pulled Notes';
        loadPulledNotes();
    } else {
        gallery.style.display = 'none';
        button.innerText = 'View Pulled Notes';
    }
}

function loadPulledNotes() {
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
        })
        .catch(error => console.error('Error fetching pulled notes:', error));
}
