const API_BASE = "http://localhost:8000";

/* ===================================
   NAVIGATION
=================================== */

function showPage(pageId, element) {

    document.querySelectorAll(".page")
        .forEach(page => {
            page.classList.add("hidden");
        });

    document.getElementById(pageId)
        .classList.remove("hidden");

    document.querySelectorAll(".nav-item")
        .forEach(item => {
            item.classList.remove("active");
        });

    if (element) {
        element.classList.add("active");
    }

    if(pageId === "calendar-page"){

    if(calendar){

        calendar.render();

        setTimeout(() => {

            calendar.updateSize();

        }, 100);
    }
}
}

/* ===================================
   MODAL
=================================== */

function openModal() {

    document.getElementById(
        "studyModal"
    ).style.display = "flex";
}

function closeModal() {

    document.getElementById(
        "studyModal"
    ).style.display = "none";
}

/* ===================================
   THEME
=================================== */

function setTheme(theme) {

    if (theme === "dark") {

        document.body.classList.add(
            "dark-theme"
        );

    } else {

        document.body.classList.remove(
            "dark-theme"
        );
    }

    localStorage.setItem(
        "theme",
        theme
    );
}

/* ===================================
   CREATE STUDY PLAN
=================================== */

async function generatePlan() {

    const payload = {

        subject:
            document.getElementById(
                "subject"
            ).value,

        total_hours:
            parseInt(
                document.getElementById(
                    "hours"
                ).value
            ),

        difficulty:
            document.getElementById(
                "difficulty"
            ).value,

        preferred_slot:
            document.getElementById(
                "slot"
            ).value,

        exam_date:
            document.getElementById(
                "examDate"
            ).value
    };

    console.log(
        "Payload:",
        payload
    );

    try {

        const response =
            await fetch(
                `${API_BASE}/generate-plan`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body:
                        JSON.stringify(
                            payload
                        )
                }
            );

        console.log(
            "Status:",
            response.status
        );

        const data =
            await response.json();

        console.log(data);

        closeModal();

        await loadDashboard();
        await loadTasks();
        // await loadRecommendations();
        await loadCompletionRecommendation();

        showToast(
            "✅ Study Plan Created Successfully"
        );

    }
    catch (error) {

        console.error(error);

        // alert(
        //     "Failed to create plan"
        // );
        showToast(

        "Failed to create plan. Please try again."
);
        
    }
}

/* ===================================
   DASHBOARD
=================================== */

async function loadDashboard() {

    try {

        const response =
            await fetch(
                `${API_BASE}/dashboard`
            );

        const data =
            await response.json();

        const subjects =
            document.getElementById(
                "subjectsCount"
            );

        const planned =
            document.getElementById(
                "plannedHours"
            );

        const completed =
            document.getElementById(
                "completedHours"
            );

        const progress =
            document.getElementById(
                "progress"
            );

        if (subjects)
            subjects.innerText =
                data.subjects;

        if (planned)
            planned.innerText =
                data.planned_hours;

        if (completed)
            completed.innerText =
                data.completed_hours;

        if (progress)
            progress.innerText =
                data.progress + "%";

        const circle =
            document.getElementById(
                "completionCircle"
            );

        if (circle) {

            const progress =
                data.progress;

            circle.innerText =
                progress + "%";

            const degrees =
                (progress / 100) * 360;

            circle.style.background = `

                conic-gradient(

                    #22c55e 0deg,

                    #22c55e ${degrees}deg,

                    #960b2e ${degrees}deg,

                    #960b2e 360deg

                )

            `;
        }

    }
    catch (error) {

        console.error(
            "Dashboard Error",
            error
        );
    }
}

/* ===================================
   TASKS
=================================== */

async function loadTasks() {

    try {

        const response =
            await fetch(
                `${API_BASE}/tasks`
            );

        const tasks =
            await response.json();

        const tracker =
            document.getElementById(
                "taskTracker"
            );

        const allTasks =
            document.getElementById(
                "allTasksContainer"
            );

        let html = "";

        tasks.forEach((task, index) => {

            html += `

                <div class="task-card">

                    <div class="task-left">

                        <input
                            type="checkbox"
                            ${task.status === "completed"
                                ? "checked"
                                : ""}
                            onchange="updateTask(${task.id})">

                        <span>

                            ${task.subject}

                        </span>

                    </div>

                    <div class="task-time">

                        ${9 + index}:00 AM

                    </div>

                </div>

            `;
        });

        if (tracker)
            tracker.innerHTML =
                html;

        if (allTasks)
            allTasks.innerHTML =
                html;

        renderSchedule(tasks);

    }
    catch (error) {

        console.error(
            "Task Error",
            error
        );
    }
}

async function updateTask(taskId) {

    try {

        const response =
            await fetch(
                `${API_BASE}/tasks/${taskId}`,
                {
                    method: "PATCH"
                }
            );

        const data =
            await response.json();

        console.log(data);

        await loadTasks();
        await loadDashboard();
        // await loadRecommendations();
        await loadCompletionRecommendation();

    }
    catch (error) {

        console.error(
            error
        );
    }
}


function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );

    toast.innerText =
        message;

    toast.classList.add(
        "show-toast"
    );

    setTimeout(() => {

        toast.classList.remove(
            "show-toast"
        );

    }, 3000);
}

/* ===================================
   SCHEDULE VIEW
=================================== */


/* ===================================
   RECOMMENDATIONS
=================================== */

async function loadCompletionRecommendation() {

    try {

        const response =
            await fetch(
                `${API_BASE}/recommendations`
            );

        const data =
            await response.json();

        const recommendationDiv =
            document.getElementById(
                "completionRecommendation"
            );

        if (recommendationDiv) {

            recommendationDiv.innerHTML = `

                <strong>

                    ${data.completed_tasks}
                    /
                    ${data.total_tasks}
                    sessions completed

                </strong>

                <br><br>

                ${data.recommendation}

            `;
        }

    }
    catch(error) {

        console.error(error);
    }
}

/* ===================================
   CHAT
=================================== */

function toggleChat() {

    const chat =
        document.getElementById(
            "chatWindow"
        );

    if (
        chat.style.display === "flex"
    ) {

        chat.style.display = "none";

    } else {

        chat.style.display = "flex";
    }
}

async function sendMessage() {

    const input =
        document.getElementById(
            "chatInput"
        );

    if (!input)
        return;

    const message =
        input.value;

    if (!message)
        return;

    try {

        const response =
            await fetch(
                `${API_BASE}/chat`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body:
                        JSON.stringify({
                            query: message
                        })
                }
            );

        const data =
            await response.json();

        const messages =
            document.getElementById(
                "chatMessages"
            );

        if (messages) {

            messages.innerHTML += `

                <div class="message-row user-row">

                    <div class="message-label">

                        User

                    </div>

                    <div class="user-message">

                        ${message}

                    </div>

                </div>

                <div class="message-row ai-row">

                    <div class="message-label">

                        AI Study Coach

                    </div>

                    <div class="ai-message">

                        ${data.response}

                    </div>

                </div>

            `;

            messages.scrollTop =
                messages.scrollHeight;
        }

        input.value = "";
        input.focus();

    }
    catch (error) {

        console.error(error);
    }
}

/* ===================================
   CALENDAR
=================================== */

let calendar;

// function initializeCalendar() {

//     const calendarEl =
//         document.getElementById("calendar");

//     calendar =
//         new FullCalendar.Calendar(
//             calendarEl,
//             {
//                 initialView:
//                     "dayGridMonth",

//                 height: 700,

//                 dateClick(info) {

//                     openModal();

//                     document.getElementById(
//                         "examDate"
//                     ).value =
//                         info.dateStr;
//                 }
//             }
//         );
// }

function initializeCalendar() {

    const calendarEl =
        document.getElementById(
            "calendar"
        );

    if (!calendarEl)
        return;

    calendar =
        new FullCalendar.Calendar(
            calendarEl,
            {
                initialView: "dayGridMonth",
                height: 700,

                dateClick(info) {

                    openModal();

                    document.getElementById(
                        "examDate"
                    ).value =
                        info.dateStr;
                }
            }
        );
}

/* ===================================
   CHART
=================================== */

let energyChart;

function initializeChart(tasks = []) {

    const chart =
        document.getElementById(
            "energyChart"
        );

    if (!chart)
        return;

    const subjectHours = {};

    tasks.forEach(task => {

        if (!subjectHours[task.subject]) {

            subjectHours[task.subject] = 0;
        }

        // subjectHours[task.subject] += task.hours;
        subjectHours[task.subject] += Number(task.hours);
    });

    const labels =
        Object.keys(subjectHours);

    const values =
        Object.values(subjectHours);

    if (energyChart) {

        energyChart.destroy();
    }

    energyChart = new Chart(
        chart,
        {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Today's Study Hours",
                    data: values
                }]
            }
        }
    );
}

function renderSchedule(tasks){

    const container =
        document.getElementById(
            "scheduleContainer"
        );

    let html = "";

    tasks.forEach((task,index)=>{

        const startHour =
            9 + (index * 2);

        html += `

        <div class="schedule-block">

            <div class="time-label">

                ${startHour}:00

            </div>

            <div class="study-card">

                <h4>

                    ${task.subject}

                </h4>

                <span>

                    ${task.hours} hrs

                </span>

            </div>

        </div>

        `;
    });

    container.innerHTML = html;
    // initializeChart(tasks);
    initializeChart(tasks.slice(0, 5));
}

/* ===================================
   APP START
=================================== */

window.onload = async () => {

const savedTheme =

    localStorage.getItem("theme") || "light";

if (savedTheme === "dark") {

    document.body.classList.add(

        "dark-theme"

    );

} else {

    document.body.classList.remove(

        "dark-theme"

    );

}

const selectedRadio =

    document.querySelector(

        `input[value="${savedTheme}"]`

    );

if (selectedRadio) {

    selectedRadio.checked = true;

}

    initializeCalendar();

    // initializeChart();

    await loadDashboard();

    await loadTasks();

    await loadCompletionRecommendation();
};


