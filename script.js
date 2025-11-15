document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const setupContainer = document.getElementById('setup-container');
    const sprintContainer = document.getElementById('sprint-container');
    const taskInput = document.getElementById('task-input');
    const timeInput = document.getElementById('time-input');
    const startBtn = document.getElementById('start-btn');
    const sprintTask = document.getElementById('sprint-task');
    const timerDisplay = document.getElementById('timer-display');
    const sprintStatus = document.getElementById('sprint-status');
    const resultPrompt = document.getElementById('result-prompt');
    const successBtn = document.getElementById('success-btn');
    const failureBtn = document.getElementById('failure-btn');
    const sprintResult = document.getElementById('sprint-result');
    const resultText = document.getElementById('result-text');

    let timerInterval;

    // --- Functions ---

    function startSprint(task, minutes) {
        // Switch views
        setupContainer.classList.add('hidden');
        sprintContainer.classList.remove('hidden');

        // Set task display
        sprintTask.textContent = task;

        // Start timer
        let totalSeconds = minutes * 60;
        updateTimerDisplay(totalSeconds);

        timerInterval = setInterval(() => {
            totalSeconds--;
            updateTimerDisplay(totalSeconds);
            if (totalSeconds <= 0) {
                clearInterval(timerInterval);
                promptForReuslt();
            }
        }, 1000);

        // Update URL for sharing
        const url = new URL(window.location);
        url.searchParams.set('task', task);
        url.searchParams.set('time', minutes);
        history.pushState({}, '', url);
    }

    function updateTimerDisplay(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function promptForReuslt() {
        sprintStatus.classList.add('hidden');
        resultPrompt.classList.remove('hidden');
        timerDisplay.textContent = "00:00";
    }

    function showResult(isSuccess) {
        resultPrompt.classList.add('hidden');
        sprintResult.classList.remove('hidden');

        if (isSuccess) {
            resultText.textContent = "Success!";
            resultText.style.color = "#2ecc71"; // Green
        } else {
            resultText.textContent = "Failure.";
            resultText.style.color = "#e74c3c"; // Red
        }
    }

    // --- Event Listeners ---

    startBtn.addEventListener('click', () => {
        const task = taskInput.value.trim();
        const minutes = parseInt(timeInput.value, 10);

        if (task === "") {
            alert("Please enter a task.");
            return;
        }
        if (isNaN(minutes) || minutes < 1) {
            alert("Please enter a valid duration (at least 1 minute).");
            return;
        }

        startSprint(task, minutes);
    });

    successBtn.addEventListener('click', () => showResult(true));
    failureBtn.addEventListener('click', () => showResult(false));

    // --- Handle Shared URL ---

    const params = new URLSearchParams(window.location.search);
    const taskParam = params.get('task');
    const timeParam = params.get('time');

    if (taskParam && timeParam) {
        const minutes = parseInt(timeParam, 10);
        if (taskParam.trim() !== "" && !isNaN(minutes) && minutes > 0) {
            startSprint(taskParam, minutes);
        }
    }
});
