const { response } = require("express");
const { del } = require("express/lib/application");

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
            loadStudySessions(); // Reload the list o   tudy sessions to include the new addition
            studyForm.reset(); // Clear the form fields
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        alert('Please fill in all required fields.');
    }
}

/ Define a function to delete a specific study session
function deleteStudySession(id) {
   
    // Display a confirmation dialog to the user before proceeding
    if (confirm('Are you sure you want to delete this study session?')) {
       
        // Send a DELETE request to the server using the Fetch API
        fetch(`http://localhost:3001/api/study-sessions/${id}`, {
           
            // Specify the HTTP method as 'DELETE'
            method: 'DELETE',
        })
        // Handle the response once the DELETE request is successful
        .then(() => {
           
            // Log a message to the console to indicate success
            console.log('Study session deleted');
           
            // Call a function to reload the list of study sessions (assumes such a function exists)
            loadStudySessions(); // Reload the list of study sessions
        })
        // Handle any errors that occur during the fetch request
        .catch(error => {
           
            // Log the error message to the console
            console.error('Error deleting study session:', error);
        });
    }
}




function deleteStudySession() {
    const deleteMethod = {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json'
        },
    }
    fetch(`http://localhost:3001/api/study-sessions/${sessionId}`, deleteMethod)
    .then(response => response.json())
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
                    <button onclick="deleteStudySession(${session.id})">Delete</button>
                `;

                studyList.appendChild(studyItem);
            });
        })
        .catch(error => {
            console.error('Error fetching study sessions:', error);
        });
}


// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadStudySessions(); // Load study sessions when the page loads
    studyForm.onsubmit = addStudySession; // Set form submission to add a new session
});
