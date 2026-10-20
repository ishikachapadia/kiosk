// tablet 

import { db } from '../firebase/firebaseConfig.js';
import { ref, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// GSAP Setup
gsap.registerPlugin(ScrollTrigger);

const IDLE_LIMIT = 30000;
let idleTimer;
let globalProjectData = null;

import { onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Listen to the 'projects' folder we just created in Firebase
onValue(ref(db, 'projects'), (snapshot) => {
    const projectData = snapshot.val();
    if (projectData) {
        globalProjectData = projectData;
        init(projectData); // This builds your grid using the Google Sheet data
    }
}, (error) => {
    console.error("Error loading Firebase data:", error);
});

function updateState(id) {
    set(ref(db, 'kioskState/currentId'), id).catch(console.error);
}

function resetTimer() {
    clearTimeout(idleTimer);
    hideScreensaver();
    idleTimer = setTimeout(() => showScreensaver(), IDLE_LIMIT);
}

function setupSearch() {
    const searchInput = document.getElementById('projectSearch');
    
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.project-card');

        cards.forEach(card => {
            // We search through the Title, the Author Name, and the Category
            const title = card.querySelector('.card-title').innerText.toLowerCase();
            const author = card.querySelector('.card-author').innerText.toLowerCase();
            const category = card.dataset.category;

            const isMatch = title.includes(term) || 
                            author.includes(term) || 
                            category.includes(term);

            card.classList.toggle('hidden', !isMatch);
        });

        // Keep GSAP Parallax updated as cards disappear/reappear
        ScrollTrigger.refresh();
        resetTimer(); // Tapping the search bar should also stop the screensaver
    });
}
function showScreensaver() {
    const ssContainer = document.getElementById('screensaver-container');
    const ssVideo = document.getElementById('ss-video');
    const ssImg = document.getElementById('ss-img');
    
    // 1. List your actual filenames sitting in that assets folder
    const ssFiles = ['ss1.mp4', 'ss2.mp4', 'ss3.mp4']; // Add/change these to match your actual files
    const randomFile = ssFiles[Math.floor(Math.random() * ssFiles.length)];
    
    // 2. Use the relative path you provided
    const assetPath = `../assets/${randomFile}`;
    
    ssContainer.style.display = 'block';

    // 3. Handle Video vs Image
    if (randomFile.toLowerCase().endsWith('.mp4')) {
        ssImg.style.display = 'none';
        ssVideo.style.display = 'block';
        
        // Only update the source if it's different to avoid flickering
        if (ssVideo.getAttribute('src') !== assetPath) {
            ssVideo.src = assetPath;
        }
        
        ssVideo.play().catch(err => console.error("Video play blocked:", err));
    } else {
        ssVideo.style.display = 'none';
        ssImg.style.display = 'block';
        ssImg.src = assetPath;
    }
}

function hideScreensaver() {
    const ssContainer = document.getElementById('screensaver-container');
    if (ssContainer) ssContainer.style.display = 'none';
    const ssVideo = document.getElementById('ss-video');
    if (ssVideo) ssVideo.pause();
}

function init(projectData) {
    const grid = document.getElementById('projectGrid');
    grid.innerHTML = ''; 

    Object.keys(projectData).forEach((key, i) => {
        const p = projectData[key];
        if (key.includes('screensaver')) return;

        // --- NAME EXTRACTION LOGIC ---
        // Takes "ishika.chapadia@dcmail.ca", splits at '@', then replaces '.' with a space
// --- NAME EXTRACTION LOGIC ---
let fullName = "Anonymous";
if (p.studentEmail) {
    // 1. Get the part before the @
    let namePart = p.studentEmail.split('@')[0]; 
    
    // 2. Remove any numbers at the end of the string
    namePart = namePart.replace(/\d+$/, ''); 
    
    // 3. Replace dots with spaces
    fullName = namePart.replace(/\./g, ' '); 
}

        const card = document.createElement('div');
        card.className = 'project-card';
        
        const category = p.techStack ? p.techStack.split(',')[0].trim() : 'Project';
        card.dataset.category = category.toLowerCase();

        card.innerHTML = `
            <div class="card-header">
                <span>№ ${String(i + 1).padStart(2, '0')}</span>
                <span class="card-category">${category}</span>
            </div>
            <div class="card-img-container">
                <img class="card-img-inner" src="https://dca.durhamcollege.ca/~team4/assets/images/${p.imageName}" alt="${p.projectTitle}">
            </div>
            <h3 class="card-title">${p.projectTitle}</h3>
            <span class="card-author">${fullName}</span> 
        `;

        card.addEventListener('click', () => {
            updateState(key);
            resetTimer();
        });

        grid.appendChild(card);
    });

    setupEffects();
    setupSearch();
    window.addEventListener('pointerdown', resetTimer);
    resetTimer();
}
function setupEffects() {
    // 1. Reveal Cards on Scroll
    gsap.utils.toArray('.project-card').forEach((card) => {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none none"
            }
        });
    });

    // 2. Parallax Images
    gsap.utils.toArray('.card-img-inner').forEach((img) => {
        gsap.to(img, {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });
}

function setupFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const active = document.querySelector('.filter-btn.active');
            if (active) active.classList.remove('active');
            btn.classList.add('active');
            
            const filter = btn.dataset.filter.toLowerCase();
            
            document.querySelectorAll('.project-card').forEach(card => {
                const cat = card.dataset.category;
                const isMatch = filter === 'all' || cat.includes(filter);
                card.classList.toggle('hidden', !isMatch);
            });
            
            // Refresh ScrollTrigger so parallax stays aligned with filtered grid
            ScrollTrigger.refresh();
        });
    });
}