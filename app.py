from flask import Flask, request, jsonify, render_template
import sqlite3
import random

app = Flask(__name__)

# Initialize the database
def init_db():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL,
            font TEXT
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS pulled_notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL,
            font TEXT,
            date_pulled DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# API Endpoints
@app.route('/api/get_note', methods=['GET'])
def get_note():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM notes')
    notes = cursor.fetchall()
    if notes:
        note = random.choice(notes)
        cursor.execute('INSERT INTO pulled_notes (content, font) VALUES (?, ?)', (note[1], note[2]))
        cursor.execute('DELETE FROM notes WHERE id = ?', (note[0],))
        conn.commit()
        conn.close()
        return jsonify({'content': note[1], 'font': note[2]})
    conn.close()
    return jsonify({'error': 'No notes left'}), 404


@app.route('/api/submit_note', methods=['POST'])
def submit_note():
    content = request.json.get('content')
    font = request.json.get('font')
    if content:
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        cursor.execute('INSERT INTO notes (content, font) VALUES (?, ?)', (content, font))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Note submitted successfully'})
    return jsonify({'error': 'Content is required'}), 400


@app.route('/api/submit_bulk_notes', methods=['POST'])
def submit_bulk_notes():
    notes = request.json.get('notes')
    if notes:
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        for note in notes:
            cursor.execute('INSERT INTO notes (content, font) VALUES (?, ?)', (note, 'Arial'))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Bulk notes submitted successfully'})
    return jsonify({'error': 'No notes to submit'}), 400




@app.route('/api/get_pulled_notes', methods=['GET'])
def get_pulled_notes():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, content, font FROM pulled_notes')
    notes = cursor.fetchall()
    conn.close()
    return jsonify([{'id': note[0], 'content': note[1], 'font': note[2]} for note in notes])

@app.route('/api/edit_pulled_note/<int:note_id>', methods=['PUT'])
def edit_pulled_note(note_id):
    content = request.json.get('content')
    font = request.json.get('font')
    if content and font:
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        cursor.execute('UPDATE pulled_notes SET content = ?, font = ? WHERE id = ?', (content, font, note_id))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Pulled note updated successfully'})
    return jsonify({'error': 'Content and font are required'}), 400

@app.route('/api/delete_pulled_note/<int:note_id>', methods=['DELETE'])
def delete_pulled_note(note_id):
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM pulled_notes WHERE id = ?', (note_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Pulled note deleted successfully'})



@app.route('/api/get_note_count', methods=['GET'])
def get_note_count():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) FROM notes')
    count = cursor.fetchone()[0]
    conn.close()
    return jsonify({'count': count})


@app.route('/api/get_notes', methods=['GET'])
def get_notes():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, content, font FROM notes')
    notes = cursor.fetchall()
    conn.close()
    return jsonify([{'id': note[0], 'content': note[1], 'font': note[2]} for note in notes])

@app.route('/api/edit_note/<int:note_id>', methods=['PUT'])
def edit_note(note_id):
    content = request.json.get('content')
    font = request.json.get('font')
    if content and font:
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        cursor.execute('UPDATE notes SET content = ?, font = ? WHERE id = ?', (content, font, note_id))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Note updated successfully'})
    return jsonify({'error': 'Content and font are required'}), 400

@app.route('/api/delete_note/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM notes WHERE id = ?', (note_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Note deleted successfully'})

@app.route('/api/purge_notes', methods=['DELETE'])
def purge_notes():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM notes')
    conn.commit()
    conn.close()
    return jsonify({'message': 'All notes purged successfully'})

@app.route('/api/purge_pulled_notes', methods=['DELETE'])
def purge_pulled_notes():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM pulled_notes')
    conn.commit()
    conn.close()
    return jsonify({'message': 'All pulled notes purged successfully'})



# Render pages
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit_note')
def submit_note_page():
    return render_template('submit_note.html')

@app.route('/manage_notes')
def manage_notes_page():
    return render_template('manage_notes.html')

if __name__ == '__main__':
    app.run(debug=True)
