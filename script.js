// Theme Toggle
document.getElementById("toggle-theme").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// Handle File Upload
document.getElementById("fileInput").addEventListener("change", handleFileUpload);

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                renderProjects(data);
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
    container.innerHTML = ""; // Clear existing content

    projects.forEach(project => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="card-body">
                <h3 class="card-title">${project.name}</h3>
                <p class="card-text"><strong>Prod Version:</strong> ${project.prodVersion || 'N/A'}</p>
                <p class="card-text"><strong>PreProd Version:</strong> ${project.preprodVersion || 'N/A'}</p>
                <p class="card-text"><strong>Open Bugs:</strong> ${project.openBugs || 0}</p>
                <p class="card-text"><strong>Backlog:</strong> ${project.backlog || 'None'}</p>
                <div class="card-buttons">
                    <button class="btn-details">Details</button>
                    <button class="btn-edit">Edit</button>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}
