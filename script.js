const video = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const captureBtn = document.getElementById("capture");
const loadingSpinner = document.getElementById("loading-spinner");
const resultDiv = document.getElementById("result");
const colorPaletteDiv = document.getElementById("color-palette");
const welcomeScreen = document.getElementById("welcome-screen");
const startBtn = document.getElementById("start-btn");

// Hide welcome screen and show main content
document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("start-btn");
    const welcomeScreen = document.getElementById("welcome-screen");
    const appContainer = document.getElementById("app-container");
    
    startBtn.addEventListener("click", () => {
        welcomeScreen.classList.add("hidden");
        appContainer.classList.remove("hidden");
    });
});

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        video.play();
        startFaceDetection(); // Start face detection
    })
    .catch(err => console.error("Camera access denied", err));

captureBtn.addEventListener("click", () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    loadingSpinner.classList.remove("hidden");
    analyzeSkinTone();
});

function analyzeSkinTone() {
    setTimeout(() => {
        loadingSpinner.classList.add("hidden");
        const detectedTone = detectTone();
        const detectedSeason = detectSeason(detectedTone);
        resultDiv.innerHTML = `Detected: ${detectedTone} - ${detectedSeason}`;
        document.getElementById("color-title").classList.remove("hidden");
        displayColorPalette(detectedSeason);
    }, 2000);
}

function detectTone() {
    const tones = ["Warm Tone", "Cool Tone", "Neutral Tone"];
    return tones[Math.floor(Math.random() * tones.length)]; // Placeholder logic
}

function detectSeason(tone) {
    const seasons = {
        "Warm Tone": ["Spring", "Autumn"],
        "Cool Tone": ["Winter", "Summer"],
        "Neutral Tone": ["Neutral Season"]
    };
    const selectedSeasons = seasons[tone];
    return selectedSeasons[Math.floor(Math.random() * selectedSeasons.length)];
}

function displayColorPalette(season) {
    colorPaletteDiv.innerHTML = "";
    const palettes = {
        "Spring": ["#FFD700", "#FFA07A", "#FF6347", "#FFB6C1", "#98FB98", "#FF69B4"],
        "Summer": ["#87CEEB", "#4682B4", "#B0E0E6", "#AFEEEE", "#ADD8E6", "#5F9EA0"],
        "Autumn": ["#D2691E", "#8B4513", "#CD853F", "#A0522D", "#FF8C00", "#DAA520"],
        "Winter": ["#708090", "#2F4F4F", "#778899", "#4682B4", "#8A2BE2", "#DC143C"],
        "Neutral Season": ["#B0A394", "#8D7B68", "#D9C6A1", "#C0C0C0", "#A9A9A9", "#808080"]
    };
    
    if (palettes[season]) {
        palettes[season].forEach(color => {
            const colorBox = document.createElement("div");
            colorBox.className = "color-box";
            colorBox.style.backgroundColor = color;
            colorBox.style.width = "40px";
            colorBox.style.height = "40px";
            colorBox.style.borderRadius = "5px";
            colorBox.style.display = "inline-block";
            colorBox.style.margin = "5px";
            colorBox.style.boxShadow = "0px 0px 5px rgba(0, 0, 0, 0.3)";
            colorPaletteDiv.appendChild(colorBox);
        });
        colorPaletteDiv.classList.remove("hidden");
    }
}

// Initialize MediaPipe Face Detection
const faceDetection = new faceDetection.FaceDetector({
    model: "short",
    minDetectionConfidence: 0.5,
});

function startFaceDetection() {
    async function detectFace() {
        const faces = await faceDetection.detect(video);
        if (faces.length > 0) {
            console.log("Face detected:", faces);
        } else {
            console.log("No face detected.");
        }
        requestAnimationFrame(detectFace);
    }
    detectFace();
}