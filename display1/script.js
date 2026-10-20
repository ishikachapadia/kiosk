import { db } from '../firebase/firebaseConfig.js';
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const projectRef = ref(db, 'kioskState/currentId');
const syncRef = ref(db, 'kioskState/syncTime');
const allProjectsRef = ref(db, 'projects'); // New reference for student data

const videoPlayer = document.getElementById('main-video');
const imagePlayer = document.getElementById('main-img');

let allProjects = [];

// 1. LISTEN FOR ALL PROJECTS DATA
onValue(allProjectsRef, (snapshot) => {
    allProjects = snapshot.val();
});

// 2. LISTEN FOR CONTENT CHANGES (When the tablet taps a card)
onValue(projectRef, (snapshot) => {
    const activeId = snapshot.val();
    
    // Check if it's a screensaver manually (as these aren't in Firebase)
    if (String(activeId).includes('screensaver')) {
        // Handle screensaver visual
        const assetPath = `../assets/${activeId}.mp4`; // Matches your ss1.mp4, ss2.mp4 naming
        updateDisplay(assetPath);
    } else if (allProjects && allProjects[activeId]) {
        // Handle student project visual from server
        const project = allProjects[activeId];
        const assetPath = `https://dca.durhamcollege.ca/~team4/assets/images/${project.imageName}`;
        updateDisplay(assetPath);
    }
});

// Helper function to switch between IMG and VIDEO
function updateDisplay(path) {
    if (path.toLowerCase().endsWith('.mp4') || path.toLowerCase().endsWith('.webm')) {
        imagePlayer.style.display = 'none';
        videoPlayer.style.display = 'block';

        if (videoPlayer.src !== path) {
            videoPlayer.src = path;
            videoPlayer.load();
            videoPlayer.play().catch(() => console.log("Interaction required for audio/video"));
        }
    } else {
        videoPlayer.style.display = 'none';
        imagePlayer.style.display = 'block';
        imagePlayer.src = path;
    }
}

// 3. LISTEN FOR SYNC HEARTBEAT (Keeping the videos in time)
onValue(syncRef, (snapshot) => {
    const masterTime = snapshot.val();
    
    if (videoPlayer && !videoPlayer.paused && videoPlayer.readyState >= 2) {
        const duration = videoPlayer.duration;
        if (duration > 0) {
            const targetTime = masterTime % duration;
            const diff = Math.abs(videoPlayer.currentTime - targetTime);

            if (diff > 0.3) {
                videoPlayer.currentTime = targetTime;
            }
        }
    }
});