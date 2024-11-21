// Function to add a new study session
function addStudySession(event) {
    event.preventDefault(); // Prevent form from submitting in the traditional way

    const subject = document.getElementById('subject').value;
    const date = document.getElementById('date').value;
    const duration = document.getElementById('duration').value;
    const notes = document.getElementById('notes').value;

    // Ensure all fields are filled out
    if (subject && date && duration) {
        // Send a POST request to add the study session
        fetch('http://localhost:3001/api/study-sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subject, date, duration, notes }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Study session added:', data);
            loadStudySessions(); // Reload the list of study sessions to include the new addition
            studyForm.reset(); // Clear the form fields
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        alert('Please fill in all required fields.');
    }
}

// Function to load study sessions from the backend
function loadStudySessions() {
    fetch('http://localhost:3001/api/study-sessions')
        .then(response => response.json())
        .then(data => {
            studyList.innerHTML = ''; // Clear the existing list
            data.forEach(session => {
                const studyItem = document.createElement('div');
                studyItem.className = 'study-item';
                studyItem.innerHTML = `
                    <h3>${session.subject}</h3>
                    <p>Date: ${session.date}</p>
                    <p>Duration: ${session.duration} minutes</p>
                    <p>Notes: ${session.notes}</p>
                    <button class="delete" data-id="${session.id}">Delete</button>
                `;
                studyList.appendChild(studyItem);
            });

            // Add event listeners to all delete buttons
            document.querySelectorAll('.delete').forEach(button => {
                button.addEventListener('click', deleteStudySession);
            });
        })
        .catch(error => {
            console.error('Error fetching study sessions:', error);
        });
}

// Function to delete a study session
function deleteStudySession(event) {
    const button = event.target;
    const sessionId = button.getAttribute('data-id');

    fetch(`http://localhost:3001/api/study-sessions/${sessionId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            console.log(`Study session ${sessionId} deleted.`);
            loadStudySessions(); // Reload the list after deletion
        } else {
            console.error(`Failed to delete session ${sessionId}`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadStudySessions(); // Load study sessions when the page loads
    studyForm.onsubmit = addStudySession; // Set form submission to add a new session
});
