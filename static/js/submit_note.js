function previewNote() {
    const content = document.getElementById('note-content-input').value;
    const font = document.getElementById('note-font-input').value;

    const previewContent = document.getElementById('preview-content');
    previewContent.innerText = content;
    previewContent.style.fontFamily = font;

    document.getElementById('note-preview').style.display = content ? 'block' : 'none';
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
