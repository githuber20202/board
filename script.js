// Theme Toggle
document.getElementById("toggle-theme").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// Global Variables
let projectsData = []; // To store the uploaded project data
let currentProjectIndex = null; // To track the currently edited project

// Handle File Upload
document.getElementById("fileInput").addEventListener("change", handleFileUpload);

function renderHotItems() {
    const hotTicker = document.getElementById("hot-items-ticker");
    if (!hotTicker || !projectsData.length) return;

    const names = projectsData.map(item => item.name).join(" • ");
    hotTicker.textContent = names;
}

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

// Function to render project cards
function renderProjects(projects) {
    const container = document.getElementById("projects-container");
    container.innerHTML = ""; // Clear existing content

    projects.forEach((project, index) => {
        const card = document.createElement("div");
        card.className = "card";

        let fieldsHTML = "";
        for (let i = 1; i <= 4; i++) {
            const fieldName = project.fieldNames?.[i] || `שדה ${i}`;
            const fieldValue = project.fields?.[i] || "N/A";
            fieldsHTML += `<p class="card-text"><strong>${fieldName}:</strong> ${fieldValue}</p>`;
        }

        card.innerHTML = `
            <div class="card-body">
                <h3 class="card-title">${project.name}</h3>
                ${fieldsHTML}
                <button class="edit-button" onclick="openEditModal(${index})">עריכה</button>
            </div>
        `;

        container.appendChild(card);
    });
}

// Open Edit Modal
function openEditModal(index) {
    if (index < 0 || index >= projectsData.length) {
        alert("Invalid project index.");
        return;
    }

    currentProjectIndex = index;
    const project = projectsData[index];

    document.getElementById("edit-name").value = project.name || "";

    const fieldsContainer = document.getElementById("edit-fields-container");
    if (!fieldsContainer) {
        console.error("Error: #edit-fields-container not found!");
        return;
    }

    let fieldsHTML = "";
    for (let i = 1; i <= 4; i++) {
        const fieldName = project.fieldNames?.[i] || `שדה ${i}`;
        const fieldValue = project.fields?.[i] || "";

        fieldsHTML += `
            <label for="edit-field-name-${i}">שם שדה ${i}:</label>
            <input type="text" id="edit-field-name-${i}" value="${fieldName}">

            <label for="edit-field-value-${i}">ערך שדה ${i}:</label>
            <input type="text" id="edit-field-value-${i}" value="${fieldValue}">
        `;
    }

    fieldsContainer.innerHTML = fieldsHTML;
    document.getElementById("edit-modal").style.display = "block";
}

function closeEditModal() {
    const modal = document.getElementById("edit-modal");
    if (modal) {
        modal.style.display = "none";
    } else {
        console.error("Error: #edit-modal not found!");
    }
}

function downloadUpdatedJSON() {
    if (projectsData.length === 0) {
        alert("אין נתונים להורדה!");
        return;
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projectsData, null, 4));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "projects.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    document.body.removeChild(downloadAnchorNode);
}

// Save Edited Project
function saveEdit() {
    if (currentProjectIndex !== null) {
        const project = projectsData[currentProjectIndex];

        // שמירת שם הפרויקט
        project.name = document.getElementById("edit-name").value.trim();

        // יצירת מבנה נתונים במקרה שהוא חסר
        if (!project.fieldNames) project.fieldNames = {};
        if (!project.fields) project.fields = {};

        // שמירת שמות השדות והערכים שלהם
        for (let i = 1; i <= 4; i++) {
            const fieldNameInput = document.getElementById(`edit-field-name-${i}`);
            const fieldValueInput = document.getElementById(`edit-field-value-${i}`);

            if (fieldNameInput && fieldValueInput) {
                project.fieldNames[i] = fieldNameInput.value.trim() || `שדה ${i}`;
                project.fields[i] = fieldValueInput.value.trim() || "N/A";
            }
        }

        // שמירת הנתונים ב-LocalStorage
        localStorage.setItem('projectsData', JSON.stringify(projectsData));

        // עדכון התצוגה מחדש
        renderProjects(projectsData);

        // סגירת חלון העריכה
        closeEditModal();
    }
}

// Load Data from LocalStorage on Page Load
window.addEventListener('load', () => {
    const storedProjects = localStorage.getItem('projectsData');

    if (storedProjects) {
        projectsData = JSON.parse(storedProjects);
    } else {
        fetch("projects.json")
            .then(response => response.json())
            .then(data => {
                projectsData = data;
                localStorage.setItem('projectsData', JSON.stringify(data));
                renderProjects(projectsData);
            })
            .catch(error => {
                console.error("Error loading JSON:", error);
                projectsData = []; // ודא שהמערך לא ריק
                renderProjects(projectsData);
            });
    }
    
    renderProjects(projectsData);
    renderHotItems();
});

