// Theme Toggle
document.getElementById("toggle-theme").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// Global Variables
let projectsData = []; // To store the uploaded project data
let currentProjectIndex = null; // To track the currently edited project

// Handle File Upload
document.getElementById("fileInput").addEventListener("change", handleFileUpload);

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const data = JSON.parse(e.target.result);
                projectsData = data; // Update global projectsData
                localStorage.setItem('projectsData', JSON.stringify(data)); // Save to localStorage
                renderProjects(projectsData); // Render the projects
            } catch (error) {
                console.error("Invalid JSON file:", error);
                alert("The uploaded file is not a valid JSON.");
            }
        };
        reader.readAsText(file);
    }
}

// Render Project Cards
function renderProjects(projects) {
    const container = document.getElementById("projects-container");
    const noProjectsMessage = document.getElementById("no-projects-message");

    if (noProjectsMessage) {
        if (projects.length === 0) {
            noProjectsMessage.style.display = "block"; // Show message if no projects
            container.innerHTML = ""; // Clear container
            return;
        } else {
            noProjectsMessage.style.display = "none"; // Hide the message
        }
    }

    container.innerHTML = ""; // Clear existing content

    projects.forEach((project, index) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <div class="card-body">
                <h3 class="card-title">${project.name}</h3>
                <p class="card-text"><strong>Open Bugs:</strong> ${project.openBugs || 0}</p>
                <p class="card-text"><strong>Prod Version:</strong> ${project.prodVersion || 'N/A'}</p>
                <p class="card-text"><strong>Backlog:</strong> ${project.backlog || 'None'}</p>
                <button class="edit-button" onclick="openEditModal(${index})">Edit</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Open Edit Modal
function openEditModal(index) {
    currentProjectIndex = index;
    const project = projectsData[index];

    // Fill the form with the project data
    document.getElementById("edit-name").value = project.name || '';
    document.getElementById("edit-prod-version").value = project.prodVersion || '';
    document.getElementById("edit-preprod-version").value = project.preprodVersion || '';
    document.getElementById("edit-open-bugs").value = project.openBugs || 0;
    document.getElementById("edit-backlog").value = project.backlog || '';

    document.getElementById("edit-modal").style.display = "block";
}

// Close Edit Modal
function closeEditModal() {
    document.getElementById("edit-modal").style.display = "none";
}

// Save Edited Project
function saveEdit() {
    if (currentProjectIndex !== null) {
        const project = projectsData[currentProjectIndex];

        // Update project with form data
        project.name = document.getElementById("edit-name").value;
        project.prodVersion = document.getElementById("edit-prod-version").value;
        project.preprodVersion = document.getElementById("edit-preprod-version").value;
        project.openBugs = parseInt(document.getElementById("edit-open-bugs").value) || 0;
        project.backlog = document.getElementById("edit-backlog").value;

        // Save updated data back to localStorage
        localStorage.setItem('projectsData', JSON.stringify(projectsData));

        // Re-render the projects
        renderProjects(projectsData);

        // Close the modal
        closeEditModal();
    }
}

// Load Data from LocalStorage on Page Load
window.addEventListener('load', () => {
    const storedProjects = localStorage.getItem('projectsData');
    if (storedProjects) {
        projectsData = JSON.parse(storedProjects);
        renderProjects(projectsData);
    }
});

// Clear LocalStorage
function clearLocalStorage() {
    localStorage.removeItem('projectsData'); // Remove data from localStorage
    projectsData = []; // Clear global data
    renderProjects(projectsData); // Clear the display
    alert("Projects cleared!");
}

function downloadUpdatedJSON() {
    // הפיכת הנתונים ל-JSON מסודר
    const dataStr = JSON.stringify(projectsData, null, 4);
    const blob = new Blob([dataStr], { type: "application/json" }); // יצירת קובץ JSON
    const url = URL.createObjectURL(blob);

    // יצירת קישור להורדה
    const a = document.createElement("a");
    a.href = url;
    a.download = "updated_projects.json"; // שם הקובץ
    a.click(); // הורדת הקובץ באופן אוטומטי

    URL.revokeObjectURL(url); // ניקוי ה-URL הזמני
}
