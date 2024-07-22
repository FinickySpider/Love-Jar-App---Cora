document.addEventListener('DOMContentLoaded', () => {
    fetchNoteCount();
    startUpdateTimer();
});

let galleryWasOpen = false;

function pullNote() {
    const jarImg = document.querySelector('#jar img');
    if (jarImg.classList.contains('clicked')) return;

    playClickSound(); // Play click sound

    jarImg.classList.add('clicked');
    jarImg.style.display = 'none'; // Hide jar image when note is pulled
    
    // Store the state of the gallery
    galleryWasOpen = document.getElementById('gallery').style.display === 'flex';
    if (galleryWasOpen) {
        document.getElementById('gallery').style.display = 'none';
    }

    fetch('/api/get_note')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                jarImg.classList.remove('clicked');
                jarImg.src = '/static/images/jar_empty.png';
                jarImg.style.display = 'block'; // Ensure the empty jar image is visible
                return;
            }
            displayNote(data.content, data.font);
            updateNoteCount();
            if (document.getElementById('notes-left').innerText == '0') {
                jarImg.src = '/static/images/jar_empty.png';
                jarImg.style.display = 'block'; // Ensure the empty jar image is visible
            }
        })
        .catch(error => console.error('Error fetching note:', error));
}

function displayNote(content, font) {
    const note = document.getElementById('note');
    const noteContent = document.getElementById('note-content');
    const putAwayButton = document.getElementById('put-away-button');
    noteContent.innerText = content;
    noteContent.style.fontFamily = font;

    adjustFontSize(noteContent, note);

    note.style.display = 'flex';
    note.style.animation = 'slideIn 0.5s forwards';
    putAwayButton.style.display = 'block'; // Show the button after the note is displayed

    document.querySelector('h1').style.display = 'none';
    document.querySelector('h3').style.display = 'none';
    document.getElementById('gallery-button-container').style.display = 'none';
    document.getElementById('gallery').style.display = 'none';
}

function putAwayNote() {
    const note = document.getElementById('note');
    const putAwayButton = document.getElementById('put-away-button');
    note.style.display = 'none';
    putAwayButton.style.display = 'none'; // Hide the button after the note is put away
    document.querySelector('h1').style.display = 'block';
    document.querySelector('h3').style.display = 'block';
    document.getElementById('gallery-button-container').style.display = 'block';
    
    // Restore the gallery state
    if (galleryWasOpen) {
        document.getElementById('gallery').style.display = 'flex';
        document.getElementById('gallery-button').innerText = 'Hide Pulled Notes';
    } else {
        document.getElementById('gallery').style.display = 'none';
        document.getElementById('gallery-button').innerText = 'View Pulled Notes';
    }

    const jarImg = document.querySelector('#jar img');
    jarImg.classList.remove('clicked');
    if (document.getElementById('notes-left').innerText == '0') {
        jarImg.src = '/static/images/jar_empty.png';
    } else {
        jarImg.src = '/static/images/jar.png';
    }
    jarImg.style.display = 'block'; // Show jar image when note is put away
}

function adjustFontSize(textElement, containerElement) {
    let fontSize = 30; // Start with a smaller font size
    const maxHeight = containerElement.clientHeight - 40; // Adjust for padding
    const maxWidth = containerElement.clientWidth - 40; // Adjust for padding

    textElement.style.fontSize = `${fontSize}px`;

    while ((textElement.scrollHeight > maxHeight || textElement.scrollWidth > maxWidth) && fontSize > 16) {
        fontSize -= 1;
        textElement.style.fontSize = `${fontSize}px`;
    }

    textElement.style.overflow = 'auto';
}










function toggleGallery() {
    const gallery = document.getElementById('gallery');
    const button = document.getElementById('gallery-button');
    if (gallery.style.display === 'none') {
        fetch('/api/get_pulled_notes')
            .then(response => response.json())
            .then(data => {
                gallery.innerHTML = '';
                data.forEach(note => {
                    const noteDiv = document.createElement('div');
                    noteDiv.classList.add('note');
                    noteDiv.innerText = note.content;
                    noteDiv.style.fontFamily = note.font;
                    
                    // Apply scaling and overflow handling for gallery notes
                    noteDiv.style.maxWidth = '400px';
                    noteDiv.style.width = '80%';
                    noteDiv.style.height = '200px';
                    noteDiv.style.maxHeight = '200px'; // Set a fixed max height
                    noteDiv.style.overflowY = 'auto'; // Make overflow scrollable vertically
                    noteDiv.style.overflowX = 'hidden'; // Hide horizontal overflow

                    gallery.appendChild(noteDiv);
                });
                gallery.style.display = 'flex';
                button.innerText = 'Hide Pulled Notes';
            })
            .catch(error => console.error('Error fetching pulled notes:', error));
    } else {
        gallery.style.display = 'none';
        button.innerText = 'View Pulled Notes';
    }
}

function updateNoteCount() {
    fetch('/api/get_note_count')
        .then(response => response.json())
        .then(data => {
            document.getElementById('notes-left').innerText = data.count;
            const jarImg = document.querySelector('#jar img');
            if (data.count == 0) {
                jarImg.src = '/static/images/jar_empty.png';
            } else {
                jarImg.src = '/static/images/jar.png';
            }
        })
        .catch(error => console.error('Error fetching note count:', error));
}

function playClickSound() {
    const clickSound = new Audio('/static/sounds/click.mp3');
    clickSound.play();
}

function startUpdateTimer() {
    setInterval(() => {
        fetchNoteCount();
        if (galleryWasOpen) {
            updateGallery();
        }
    }, 30000); // 30 seconds interval
}

function fetchNoteCount() {
    fetch('/api/get_note_count')
        .then(response => response.json())
        .then(data => {
            document.getElementById('notes-left').innerText = data.count;
            const jarImg = document.querySelector('#jar img');
            if (data.count == 0) {
                jarImg.src = '/static/images/jar_empty.png';
            } else {
                jarImg.src = '/static/images/jar.png';
            }
        })
        .catch(error => console.error('Error fetching note count:', error));
}

function updateGallery() {
    fetch('/api/get_pulled_notes')
        .then(response => response.json())
        .then(data => {
            const gallery = document.getElementById('gallery');
            gallery.innerHTML = '';
            data.forEach(note => {
                const noteDiv = document.createElement('div');
                noteDiv.classList.add('note');
                noteDiv.innerText = note.content;
                noteDiv.style.fontFamily = note.font;

                // Apply scaling and overflow handling for gallery notes
                noteDiv.style.maxWidth = '400px';
                noteDiv.style.width = '80%';
                noteDiv.style.height = '200px';
                noteDiv.style.maxHeight = '200px'; // Set a fixed max height
                noteDiv.style.overflowY = 'auto'; // Make overflow scrollable vertically
                noteDiv.style.overflowX = 'hidden'; // Hide horizontal overflow

                gallery.appendChild(noteDiv);
            });
        })
        .catch(error => console.error('Error fetching pulled notes:', error));
}
