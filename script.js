let startTime = 0;

let elapsedTime = 0;

let timerInterval = null;

let running = false;

let laps = JSON.parse(localStorage.getItem("laps")) || [];

const time = document.getElementById("time");

const status = document.getElementById("status");

const currentDate = document.getElementById("currentDate");

const liveClock = document.getElementById("liveClock");

const lapList = document.getElementById("lapList");

const lapCount = document.getElementById("lapCount");

const totalLaps = document.getElementById("totalLaps");

const bestLap = document.getElementById("bestLap");

const slowLap = document.getElementById("slowLap");

const avgLap = document.getElementById("avgLap");

const toast = document.getElementById("toast");

const themeBtn = document.getElementById("themeBtn");

const fullscreenBtn = document.getElementById("fullscreenBtn");

function showToast(message){

    toast.innerText = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2000);

}

function updateCurrentDate(){

    const now = new Date();

    currentDate.innerText = now.toDateString();

}

function updateLiveClock(){

    const now = new Date();

    liveClock.innerText = now.toLocaleTimeString();

}

setInterval(updateLiveClock,1000);

updateCurrentDate();

updateLiveClock();

themeBtn.onclick=()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

        themeBtn.innerHTML='<i class="fa-solid fa-sun"></i>';

    }

    else{

        localStorage.setItem("theme","light");

        themeBtn.innerHTML='<i class="fa-solid fa-moon"></i>';

    }

};

if(localStorage.getItem("theme")==="dark"){

    document.body.classList.add("dark");

    themeBtn.innerHTML='<i class="fa-solid fa-sun"></i>';

}

fullscreenBtn.onclick=()=>{

    if(!document.fullscreenElement){

        document.documentElement.requestFullscreen();

    }

    else{

        document.exitFullscreen();

    }

};

function formatTime(ms){

    let milliseconds = ms % 1000;

    let seconds = Math.floor(ms/1000)%60;

    let minutes = Math.floor(ms/60000)%60;

    let hours = Math.floor(ms/3600000);

    return(

        String(hours).padStart(2,'0')+":"

        +String(minutes).padStart(2,'0')+":"

        +String(seconds).padStart(2,'0')+"."

        +String(milliseconds).padStart(3,'0')

    );

}
function updateDisplay() {

    time.innerText = formatTime(elapsedTime);

    const seconds = Math.floor(elapsedTime / 1000);

    const degree = (seconds % 60) * 6;

    document.querySelector(".circle").style.background =
    `conic-gradient(#22c55e ${degree}deg,#ffffff55 ${degree}deg)`;

}

function startStopwatch() {

    if (running) {

        return;

    }

    running = true;

    status.innerText = "Running";

    status.style.color = "#22c55e";

    startTime = Date.now() - elapsedTime;

    timerInterval = setInterval(() => {

        elapsedTime = Date.now() - startTime;

        updateDisplay();

    }, 10);

    showToast("Stopwatch Started");

}

function pauseStopwatch() {

    if (!running) {

        return;

    }

    running = false;

    clearInterval(timerInterval);

    status.innerText = "Paused";

    status.style.color = "#f59e0b";

    showToast("Stopwatch Paused");

}

function resetStopwatch() {

    clearInterval(timerInterval);

    running = false;

    elapsedTime = 0;

    startTime = 0;

    time.innerText = "00:00:00.000";

    status.innerText = "Ready";

    status.style.color = "#FFD43B";

    document.querySelector(".circle").style.background =
    "conic-gradient(#22c55e 0deg,#ffffff55 0deg)";

    showToast("Stopwatch Reset");

}

document

.getElementById("startBtn")

.addEventListener("click", () => {

    startStopwatch();

});

document

.getElementById("pauseBtn")

.addEventListener("click", () => {

    if (running) {

        pauseStopwatch();

    }

    else {

        startStopwatch();

    }

});

document

.getElementById("resetBtn")

.addEventListener("click", () => {

    resetStopwatch();

});
function saveLaps() {

    localStorage.setItem("laps", JSON.stringify(laps));

}

function timeToMilliseconds(timeString) {

    const parts = timeString.split(":");

    const hours = Number(parts[0]);

    const minutes = Number(parts[1]);

    const sec = parts[2].split(".");

    const seconds = Number(sec[0]);

    const milliseconds = Number(sec[1]);

    return (((hours * 60 + minutes) * 60) + seconds) * 1000 + milliseconds;

}

function updateStatistics() {

    lapCount.innerText = laps.length;

    totalLaps.innerText = laps.length;

    if (laps.length === 0) {

        bestLap.innerText = "--";

        slowLap.innerText = "--";

        avgLap.innerText = "--";

        return;

    }

    let fastest = laps[0];

    let slowest = laps[0];

    let total = 0;

    laps.forEach(lap => {

        const value = timeToMilliseconds(lap.time);

        total += value;

        if (value < timeToMilliseconds(fastest.time)) {

            fastest = lap;

        }

        if (value > timeToMilliseconds(slowest.time)) {

            slowest = lap;

        }

    });

    bestLap.innerText = fastest.time;

    slowLap.innerText = slowest.time;

    avgLap.innerText = formatTime(Math.floor(total / laps.length));

}

function renderLaps() {

    lapList.innerHTML = "";

    if (laps.length === 0) {

        lapList.innerHTML = `

        <div class="empty">

            <i class="fa-regular fa-clock"></i>

            <p>No Laps Recorded Yet</p>

        </div>

        `;

        updateStatistics();

        return;

    }

    let fastestIndex = 0;

    let slowestIndex = 0;

    laps.forEach((lap, index) => {

        if (

            timeToMilliseconds(lap.time)

            <

            timeToMilliseconds(laps[fastestIndex].time)

        ) {

            fastestIndex = index;

        }

        if (

            timeToMilliseconds(lap.time)

            >

            timeToMilliseconds(laps[slowestIndex].time)

        ) {

            slowestIndex = index;

        }

    });

    laps.forEach((lap, index) => {

        let badge = "";

        if (index === fastestIndex) {

            badge = `<span class="lap-badge best">Best</span>`;

        }

        else if (index === slowestIndex) {

            badge = `<span class="lap-badge slowest">Slowest</span>`;

        }

        lapList.innerHTML += `

        <li class="lap-item">

            <div class="lap-left">

                <span class="lap-number">

                    Lap ${index + 1}

                </span>

                <span class="lap-time">

                    ${lap.time}

                </span>

                ${badge}

            </div>

            <button

                class="delete-lap"

                onclick="deleteLap(${index})"

            >

                <i class="fa-solid fa-trash"></i>

            </button>

        </li>

        `;

    });

    updateStatistics();

    saveLaps();

}
function addLap() {

    if (!running) {

        showToast("Start the stopwatch first");

        return;

    }

    const lap = {

        time: formatTime(elapsedTime)

    };

    laps.push(lap);

    saveLaps();

    renderLaps();

    lapList.scrollTop = lapList.scrollHeight;

    showToast("Lap Recorded");

}

document

.getElementById("lapBtn")

.addEventListener("click", addLap);

function deleteLap(index) {

    laps.splice(index, 1);

    saveLaps();

    renderLaps();

    showToast("Lap Deleted");

}

window.deleteLap = deleteLap;

function clearAllLaps() {

    laps = [];

    saveLaps();

    renderLaps();

    showToast("All Laps Cleared");

}

document

.getElementById("clearLaps")

.addEventListener("click", clearAllLaps);

function exportLaps() {

    if (laps.length === 0) {

        showToast("No laps to export");

        return;

    }

    let content = "SMART STOPWATCH PRO\n\n";

    content += "Lap History\n\n";

    laps.forEach((lap, index) => {

        content += `Lap ${index + 1} : ${lap.time}\n`;

    });

    content += "\n";

    content += "Total Laps : " + laps.length;

    const blob = new Blob([content], {

        type: "text/plain"

    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "Stopwatch_Laps.txt";

    a.click();

    URL.revokeObjectURL(url);

    showToast("Laps Exported");

}

document

.getElementById("exportBtn")

.addEventListener("click", exportLaps);

document.addEventListener("keydown", (e) => {

    if (e.target.tagName === "INPUT") return;

    if (e.code === "Space") {

        e.preventDefault();

        if (running) {

            pauseStopwatch();

        }

        else {

            startStopwatch();

        }

    }

    if (e.key === "l" || e.key === "L") {

        addLap();

    }

    if (e.key === "r" || e.key === "R") {

        resetStopwatch();

    }

});

window.addLap = addLap;
function celebrateMilestone() {

    if (laps.length > 0 && laps.length % 10 === 0) {

        showToast("🎉 " + laps.length + " Laps Completed!");

        confetti();

    }

}

function confetti() {

    for (let i = 0; i < 120; i++) {

        const piece = document.createElement("div");

        piece.style.position = "fixed";

        piece.style.width = "10px";

        piece.style.height = "10px";

        piece.style.left = Math.random() * 100 + "vw";

        piece.style.top = "-20px";

        piece.style.background =
            `hsl(${Math.random() * 360},100%,50%)`;

        piece.style.borderRadius = "50%";

        piece.style.pointerEvents = "none";

        piece.style.zIndex = "9999";

        piece.style.transition =
            "transform 3s linear, opacity 3s";

        document.body.appendChild(piece);

        setTimeout(() => {

            piece.style.transform =
                `translateY(${window.innerHeight + 100}px)`;

            piece.style.opacity = "0";

        }, 50);

        setTimeout(() => {

            piece.remove();

        }, 3000);

    }

}

const oldAddLap = addLap;

addLap = function () {

    oldAddLap();

    celebrateMilestone();

};

setInterval(() => {

    if (running) {

        document.querySelector("#time").style.transform = "scale(1.02)";

        setTimeout(() => {

            document.querySelector("#time").style.transform = "scale(1)";

        }, 250);

    }

}, 1000);

window.onload = () => {

    updateCurrentDate();

    updateLiveClock();

    renderLaps();

    updateStatistics();

    updateDisplay();

};

window.addEventListener("beforeunload", () => {

    saveLaps();

});

window.startStopwatch = startStopwatch;
window.pauseStopwatch = pauseStopwatch;
window.resetStopwatch = resetStopwatch;
window.deleteLap = deleteLap;
window.addLap = addLap;
