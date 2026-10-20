import { db } from '../firebase/firebaseConfig.js';
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const stateRef = ref(db, 'kioskState/currentId');
const projectsRef = ref(db, 'projects');
const infoContainer = document.getElementById('info-container');
const heroImage = document.getElementById('proj-visual'); // Make sure your HTML has this ID

let allProjects = [];

// 1. Keep a live list of all projects from Firebase
onValue(projectsRef, (snapshot) => {
    allProjects = snapshot.val();
});

// 2. Listen for when the Tablet changes the active project
onValue(stateRef, (snapshot) => {
    const activeId = snapshot.val();
    
    if (allProjects && allProjects[activeId]) {
        const project = allProjects[activeId];

        // Animation reset
        infoContainer.classList.remove('fade-in');
        void infoContainer.offsetWidth; 
        infoContainer.classList.add('fade-in');

        // Check if it's a screensaver
        const isSS = String(activeId).includes('screensaver');
        
        if (isSS) {
            infoContainer.style.display = 'none';
        } else {
            infoContainer.style.display = 'flex';

            // --- IMAGE LOGIC ---
            // Pulling from your Team 4 server folder
            if (heroImage && project.imageName) {
                heroImage.src = `https://dca.durhamcollege.ca/~team4/assets/images/${project.imageName}`;
            }

            // --- TEXT LOGIC ---
            document.getElementById('proj-id').innerText = String(activeId).padStart(2, '0');
            document.getElementById('proj-title').innerText = project.projectTitle || "Untitled Project";
            document.getElementById('proj-description').innerText = project.description || "";

            // --- TECH STACK LOGIC ---
            const techList = document.getElementById('proj-tech');
            if (techList) {
                techList.innerHTML = ''; 
                if (project.techStack) {
                    const techArray = project.techStack.split(',').map(item => item.trim());
                    techArray.forEach(item => {
                        const li = document.createElement('li');
                        li.innerText = item;
                        techList.appendChild(li);
                    });
                }
            }
        }
    }
});