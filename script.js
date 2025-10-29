// === GLOBAL VARIABLES ===
let uploadedProfileImageDataURL = ""; // store uploaded image as base64

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    // Initial portfolio generation
    generatePortfolio();

    // Download button setup
    document.getElementById("downloadBtn").addEventListener("click", downloadPortfolio);

    // Setup Intersection Observer
    setupIntersectionObserver();

    // Setup image upload + drag-drop
    setupImageUpload();
});

// --- DRAG & DROP / UPLOAD LOGIC ---
function setupImageUpload() {
    const uploadArea = document.getElementById("uploadArea");
    const fileInput = document.getElementById("profileImgInput");
    const previewImg = document.getElementById("previewImg");

    // Click → open file picker
    uploadArea.addEventListener("click", () => fileInput.click());

    // File selected
    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file, previewImg);
    });

    // Drag events
    uploadArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        uploadArea.classList.add("dragover");
    });
    uploadArea.addEventListener("dragleave", () => uploadArea.classList.remove("dragover"));
    uploadArea.addEventListener("drop", (e) => {
        e.preventDefault();
        uploadArea.classList.remove("dragover");
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file, previewImg);
    });
}

// Handle file preview + store DataURL
function handleFile(file, previewImg) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        uploadedProfileImageDataURL = event.target.result; // store globally
        previewImg.src = uploadedProfileImageDataURL;
        generatePortfolio();
    };
    reader.readAsDataURL(file);
}

// --- SCROLL ANIMATION LOGIC ---
const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.2,
};

function setupIntersectionObserver() {
    if (window.portfolioObserver) {
        window.portfolioObserver.disconnect();
    }

    const sections = document.querySelectorAll("#portfolio-output .portfolio-section");
    if (sections.length === 0) return;

    const observerCallback = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    };

    window.portfolioObserver = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((section) => {
        section.classList.remove("is-visible");
        window.portfolioObserver.observe(section);
    });
}

// --- MAIN PORTFOLIO GENERATION ---
function generatePortfolio() {
    const name = document.getElementById("nameInput").value;
    const title = document.getElementById("titleInput").value;
    const bio = document.getElementById("bioInput").value;
    const skillsString = document.getElementById("skillsInput").value;
    const projectTitle = document.getElementById("projectTitle").value;
    const projectDesc = document.getElementById("projectDesc").value;
    const projectLink = document.getElementById("projectLink").value;
    const email = document.getElementById("emailInput").value;
    const linkedin = document.getElementById("linkedinInput").value;
    const github = document.getElementById("githubInput").value;

    // ✅ Prefer uploaded image first, else fallback preview or placeholder
    const previewImg = document.getElementById("previewImg");
    const profileImgUrl =
        uploadedProfileImageDataURL ||
        (previewImg ? previewImg.src : "https://via.placeholder.com/150");

    // Skills
    const skillsArray = skillsString
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);
    const skillsHtml = skillsArray.map((s) => `<li class="skill-tag">${s}</li>`).join("");

    // Portfolio HTML
    const portfolioHTML = `
        <div class="portfolio-header">
            <img src="${profileImgUrl}" alt="${name}" class="profile-img">
            <h1>${name || "Your Name"}</h1>
            <p>${title || "Your Role/Title"}</p>
        </div>

        <section id="about" class="portfolio-section">
            <h2>About Me</h2>
            <p>${bio || "This is where your professional bio will go."}</p>
        </section>

        <section id="skills" class="portfolio-section">
            <h2>Skills</h2>
            <ul class="skills-list">
                ${skillsHtml || "<li class='skill-tag'>Skills will appear here...</li>"}
            </ul>
        </section>

        <section id="projects" class="portfolio-section">
            <h2>Projects</h2>
            <div class="project-card">
                <img src="https://via.placeholder.com/600x400/00bcd4/ffffff?text=Project+Screenshot" class="project-img">
                <div class="project-card-content">
                    <h3>${projectTitle || "Project Title"}</h3>
                    <p>${projectDesc || "Project description goes here."}</p>
                    <p><a href="${projectLink || "#"}" target="_blank">View Live Demo →</a></p>
                </div>
            </div>
        </section>

        <section id="contact" class="portfolio-section">
            <h2>Contact</h2>
            <div class="contact-info">
                <p>Email: <a href="mailto:${email}">${email || "yourname@example.com"}</a></p>
                <p>LinkedIn: <a href="${linkedin}" target="_blank">${linkedin || "LinkedIn Profile"}</a></p>
                <p>GitHub: <a href="${github}" target="_blank">${github || "GitHub Profile"}</a></p>
            </div>
        </section>
    `;

    document.getElementById("portfolio-output").innerHTML = portfolioHTML;
    setupIntersectionObserver();
}

// --- DOWNLOAD PORTFOLIO FUNCTION ---
function downloadPortfolio() {
    const name = document.getElementById("nameInput").value || "Portfolio";
    const content = document.getElementById("portfolio-output").innerHTML;
    const embeddedCSS = getEmbeddedCSS();

    const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${name}'s Portfolio</title>
<style>${embeddedCSS}</style>
</head>
<body>
${content}
</body>
</html>
`;

    const blob = new Blob([fullHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.toLowerCase().replace(/\s+/g, "-")}-portfolio.html`;
    a.click();
    URL.revokeObjectURL(url);
}

// --- EMBEDDED CSS FOR DOWNLOADED FILE ---
function getEmbeddedCSS() {
    return `
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Roboto', sans-serif; line-height: 1.6; color: #333;
               background: linear-gradient(to bottom right, #eef5ff, #ffffff);
               max-width: 1200px; margin: 0 auto; padding: 0 40px; }
        .portfolio-header { text-align: center; padding: 80px 0; }
        .profile-img { width: 120px; height: 120px; border-radius: 50%; object-fit: cover;
                       border: 3px solid #00bcd4; box-shadow: 0 0 15px rgba(0,0,0,0.1); }
        .portfolio-header h1 { font-size: 3rem; color: #1e3a5f; margin: 15px 0 5px; }
        .portfolio-header p { font-size: 1.2rem; color: #555; }
        .portfolio-section { margin: 50px 0; opacity: 0; transform: translateY(25px);
                             transition: all 0.6s ease-out; }
        .portfolio-section.is-visible { opacity: 1; transform: translateY(0); }
        .skills-list { display: flex; flex-wrap: wrap; gap: 10px; list-style: none; }
        .skill-tag { background: #f0f0f0; padding: 8px 16px; border-radius: 6px; }
        .project-card { background: #fff; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); overflow: hidden; }
        .project-img { width: 100%; max-height: 350px; object-fit: cover; }
        .project-card-content { padding: 25px; }
        .contact-info { text-align: center; }
        .contact-info a { color: #1e3a5f; text-decoration: none; }
        .contact-info a:hover { color: #00bcd4; }
    `;
}
