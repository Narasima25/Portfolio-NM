document.addEventListener('DOMContentLoaded', () => {
    // Initial generation on load
    generatePortfolio();
    // Download button setup
    document.getElementById('downloadBtn').addEventListener('click', downloadPortfolio);
    // Setup initial scroll observer
    setupIntersectionObserver();
});

// --- SCROLL ANIMATION LOGIC ---
const observerOptions = {
    root: null, // relative to the viewport
    rootMargin: '0px',
    threshold: 0.2 // trigger when 20% of the element is visible
};

function setupIntersectionObserver() {
    if (window.portfolioObserver) {
        window.portfolioObserver.disconnect();
    }
    
    const sections = document.querySelectorAll('#portfolio-output .portfolio-section');
    if (sections.length === 0) return;

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    };

    window.portfolioObserver = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
        section.classList.remove('is-visible');
        window.portfolioObserver.observe(section);
    });
}

/**
 * Reads all form inputs and generates the portfolio HTML structure.
 * This function injects user data into the Framer-inspired layout.
 */
function generatePortfolio() {
    // --- 1. Get User Data from Input Fields ---
    const name = document.getElementById('nameInput').value;
    const title = document.getElementById('titleInput').value;
    const profileImgUrl = document.getElementById('profileImgInput').value;
    const bio = document.getElementById('bioInput').value;
    const skillsString = document.getElementById('skillsInput').value;
    const projectTitle = document.getElementById('projectTitle').value;
    const projectDesc = document.getElementById('projectDesc').value;
    const projectLink = document.getElementById('projectLink').value;
    const projectImgUrl = "https://via.placeholder.com/600x400/00bcd4/ffffff?text=Project+Screenshot"; 
    const email = document.getElementById('emailInput').value;
    const linkedin = document.getElementById('linkedinInput').value;
    const github = document.getElementById('githubInput').value;

    // --- 2. Process Skills ---
    const skillsArray = skillsString.split(',').map(skill => skill.trim()).filter(s => s);
    const skillsHtml = skillsArray.map(skill => `<li class="skill-tag">${skill}</li>`).join('');

    // --- 3. Build the Portfolio HTML Structure ---
    const portfolioHTML = `
        <div class="portfolio-header">
            <img src="${profileImgUrl || 'https://via.placeholder.com/120'}" alt="${name} Profile Picture" class="profile-img">
            <h1>${name || 'Your Name'}</h1>
            <p>${title || 'Your Role/Title'}</p>
        </div>

        <section id="about" class="portfolio-section">
            <h2>About Me</h2>
            <p>${bio || 'This is where your professional bio will go.'}</p>
        </section>

        <section id="skills" class="portfolio-section">
            <h2>Skills</h2>
            <ul class="skills-list">
                ${skillsHtml || '<li class="skill-tag">Skills will appear here...</li>'}
            </ul>
        </section>

        <section id="projects" class="portfolio-section">
            <h2>Projects</h2>
            <div class="project-card">
                <img src="${projectImgUrl}" alt="${projectTitle || 'Project Screenshot'}" class="project-img">
                <div class="project-card-content">
                    <h3>${projectTitle || 'Project Title'}</h3>
                    <p>${projectDesc || 'Project description goes here.'}</p>
                    <p><a href="${projectLink || '#'}" target="_blank">View Live Demo &rarr;</a></p>
                </div>
            </div>
        </section>

        <section id="contact" class="portfolio-section">
            <h2>Contact</h2>
            <div class="contact-info">
                <p>Email: <a href="mailto:${email}">${email || 'yourname@example.com'}</a></p>
                <p>LinkedIn: <a href="${linkedin}" target="_blank">${linkedin || 'Link to LinkedIn Profile'}</a></p>
                <p>GitHub: <a href="${github}" target="_blank">${github || 'Link to GitHub Profile'}</a></p>
            </div>
        </section>
    `;

    document.getElementById('portfolio-output').innerHTML = portfolioHTML;
    // Re-attach the observer every time content is generated
    setupIntersectionObserver();
}

/**
 * Wraps the generated content with the full boilerplate HTML and triggers a download.
 */
function downloadPortfolio() {
    const name = document.getElementById('nameInput').value || 'Portfolio';
    const content = document.getElementById('portfolio-output').innerHTML;

    // Get the complete embedded CSS
    const embeddedCSS = getEmbeddedCSS();

    const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}'s Portfolio</title>
    <style>${embeddedCSS}</style>
    <script>
        const observerOptions = {
            root: null, 
            rootMargin: '0px',
            threshold: 0.2
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        document.querySelectorAll('.portfolio-section').forEach(section => {
            observer.observe(section);
        });
    </script>
</head>
<body>
    ${content}
</body>
</html>
    `;

    // --- 5. Create and Trigger Download ---
    const filename = `${name.toLowerCase().replace(/\s/g, '-')}-portfolio.html`;
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Helper function to store the complete, embeddable CSS
// This CSS is embedded directly into the downloaded HTML file.
function getEmbeddedCSS() {
    return `
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Roboto', sans-serif; 
            line-height: 1.6; 
            color: #333; 
            /* Framer-inspired: Wide main container and clean background */
            background: linear-gradient(to bottom right, #eef5ff, #ffffff);
            background-color: #f0f8ff;
            max-width: 1200px; /* Constrain the main portfolio width */
            margin: 0 auto;
            padding: 0 40px; 
        }
        
        /* === ANIMATION STYLES for Downloaded Page === */
        .portfolio-section { 
            opacity: 0; 
            transition: opacity 0.6s ease-out, transform 0.6s ease-out; 
            transform: translateY(25px); 
            padding: 40px 0; 
            border-bottom: 1px solid #f0f0f0;
        }
        .portfolio-section:last-of-type {
            border-bottom: none;
        }
        .portfolio-section.is-visible { 
            opacity: 1; 
            transform: translateY(0); 
        }

        /* --- HEADER/HERO SECTION (Bold & Large) --- */
        .portfolio-header { 
            text-align: center; 
            padding: 80px 0; 
            margin-bottom: 20px; 
            border-bottom: none; 
        }
        .portfolio-header h1 { 
            color: #1e3a5f; 
            font-size: 4.5em; 
            font-weight: 900; 
            margin-bottom: 15px; 
            letter-spacing: -2px;
        }
        .portfolio-header p { 
            color: #555; 
            font-size: 1.8em; 
            font-weight: 300; 
        }

        /* Section Titles */
        .portfolio-section h2 { 
            font-size: 1.8em; 
            color: #1e3a5f; 
            margin-bottom: 30px; 
            text-align: left; 
            border-left: none; 
            padding-left: 0; 
            font-weight: 700;
        }

        /* Image Styles */
        .profile-img { 
            width: 120px; 
            height: 120px; 
            border-radius: 50%; 
            object-fit: cover; 
            margin-bottom: 25px; 
            border: 3px solid #00bcd4; 
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.1); 
            display: block; 
            margin-left: auto; 
            margin-right: auto; 
        }
        .project-img { 
            width: 100%; 
            max-height: 350px; 
            object-fit: cover; 
            border-radius: 10px; 
            margin-bottom: 0; 
            display: block;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        /* Interactive Card Styles */
        .project-card { 
            background-color: #ffffff; 
            padding: 0; 
            border: none; 
            border-radius: 10px; 
            margin-top: 25px; 
            box-shadow: 0 0 0 1px #e0e0e0; 
            transition: all 0.3s ease;
            overflow: hidden;
        }
        .project-card-content {
            padding: 30px;
        }
        /* Card Hover */
        .project-card:hover { 
            transform: translateY(-5px); 
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); 
        }
        .project-card h3 { color: #1e3a5f; margin-bottom: 10px; font-weight: 700; }
        .project-card a { color: #00bcd4; text-decoration: none; font-weight: 700; }
        .project-card a:hover { text-decoration: underline; }

        /* Skills Tag Styles */
        .skills-list { list-style: none; display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px; }
        .skill-tag { 
            background-color: #f0f0f0; 
            color: #555; 
            padding: 8px 16px; 
            border-radius: 6px; 
            font-size: 0.9em; 
            font-weight: 500; 
            transition: all 0.3s ease; 
            cursor: default;
        }
        /* Tag Hover */
        .skill-tag:hover { 
            background-color: #00bcd4; 
            color: white; 
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        /* Contact Styles */
        .contact-info { text-align: center; font-size: 1.1em; line-height: 1.8; }
        .contact-info a { color: #1e3a5f; text-decoration: none; font-weight: 500; transition: color 0.3s; }
        .contact-info a:hover { color: #00bcd4; text-decoration: underline; }

        /* Media Queries */
        @media (max-width: 900px) {
            body { padding: 0 15px; }
            .portfolio-header { padding: 50px 0; }
            .portfolio-header h1 { font-size: 3em; }
            .portfolio-header p { font-size: 1.2em; }
        }
    `;
}