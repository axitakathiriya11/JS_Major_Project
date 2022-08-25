let body_container = document.querySelector(".body-container");

let btn_focus = document.getElementById("btn-focus");
let btn_short_break = document.getElementById("btn-short-break");
let btn_long_break = document.getElementById("btn-long-break");

let timeLeftSection = document.querySelector(".timeLeftSection");
let btn_start = document.querySelector("#btn-start");
let btn_reset = document.querySelector("#btn-reset");

let empty_task_list = document.getElementById("empty_task_list");
let btn_add_task = document.querySelector("#addtask");
let task_list = document.querySelector("#tasklist");
let btn_clear_task = document.getElementById("btn-clear-task");

let btn_clear_logs = document.getElementById("btn-clear-logs");
let btnSave = document.querySelector("#btnSave");

var reportUpdateLog = document.getElementById("reportUpdateLog");
let autoStartRounds = document.getElementById("autoStartRounds");
let longBreakIntervalSlider = document.getElementById(
  "longBreakIntervalSlider"
);
let longBreakIntervalValue = document.getElementById("longBreakIntervalValue");
let tick_sound = document.getElementById("tick_sound");
var notificationTextInput = document.getElementById("input_notification_time");
let backgroundMusicOptions = document.getElementById("backgroundMusicOptions");

var timeleft;
var notificationTime;
var titleDisplayText;
var currentTab, updateSeconds;
var timerIsRunning = false;
var currentStartTime, currentEndTime;
var currentDate;

let currentIntervalCount = 0;

var tick = new Audio("assets/sounds/tick.mp3");

var notification = new Audio("assets/sounds/notification-bell.mp3");

var allPossibleModes = {
  focus: {
    default_time: 15,
    localStorage: localStorage.getItem("focus_time"),
    sound: new Audio("assets/sounds/alert-short-break.mp3"),
    titleDisplayText: "Time to focus!",
  },
  long_break: {
    default_time: 20,
    localStorage: localStorage.getItem("long_break_time"),
    sound: new Audio("assets/sounds/alert-short-break.mp3"),
    titleDisplayText: "Time for a break!",
  },
  short_break: {
    default_time: 5,
    localStorage: localStorage.getItem("short_break_time"),
    sound: new Audio("assets/sounds/alert-short-break.mp3"),
    titleDisplayText: "Time for a break!",
  },
};

var allBackgroundMusic = {
  Campfire: new Audio("assets/sounds/background_music/Campfire.mp3"),
  Forest: new Audio("assets/sounds/background_music/Forest.mp3"),
  Ocean: new Audio("assets/sounds/background_music/Ocean.mp3"),
  Rain: new Audio("assets/sounds/background_music/Rain.mp3"),
  "Windy Desert": new Audio("assets/sounds/background_music/Windy_Desert.mp3"),
};

init();

function init() {
  currentTab = "focus";
  displayTimeLeftValue();
  setDataInSettingModal();
  setToDoList();
  displayReportLog();
  displayEmptyTask();
  displayAutoStartValue();
  displayNotificationValue();
  displayLongIntervalValue();
  displayBackgroundMusic();
  changeButtonColor();
  changeBackgroundColor();
}

function displayTimeLeftValue() {
  if (allPossibleModes[currentTab].localStorage) {
    timeleft = minutesToSeconds(allPossibleModes[currentTab].localStorage);
  } else {
    timeleft = minutesToSeconds(allPossibleModes[currentTab].default_time);
  }
  timeLeftSection.innerHTML = secondsToMinutes(timeleft);
}

function setDataInSettingModal() {
  if (allPossibleModes["focus"].localStorage) {
    document.getElementById("input_focus").value =
      allPossibleModes["focus"].localStorage;
  } else {
    document.getElementById("input_focus").value =
      allPossibleModes["focus"].default_time;
  }

  if (allPossibleModes["long_break"].localStorage) {
    document.getElementById("long_break_focus").value =
      allPossibleModes["long_break"].localStorage;
  } else {
    document.getElementById("long_break_focus").value =
      allPossibleModes["long_break"].default_time;
  }

  if (allPossibleModes["short_break"].localStorage) {
    document.getElementById("short_break_focus").value =
      allPossibleModes["short_break"].localStorage;
  } else {
    document.getElementById("short_break_focus").value =
      allPossibleModes["short_break"].default_time;
  }

  if (localStorage.playTickSound === "true") {
    tick_sound.checked = true;
  } else {
    tick_sound.checked = false;
  }
}

function setToDoList() {
  var todoList = localStorage.myitems;
  if (todoList !== undefined) {
    document.querySelector("#tasklist").innerHTML = todoList;
  }
}

function displayReportLog() {
  if (localStorage.logContents !== undefined) {
    if (localStorage.logContents.indexOf("tr") == -1) {
      displayNoLogs();
    } else {
      if (localStorage.logContents) {
        reportUpdateLog.innerHTML = localStorage.logContents;
        hideNoLogs();
      }
    }
  }
}

function displayEmptyTask() {
  if (localStorage.myitems !== undefined) {
    if (localStorage.myitems.indexOf("li") == -1) {
      empty_task_list.style.display = "block";
    } else {
      empty_task_list.style.display = "none";
    }
  }
}

function displayAutoStartValue() {
  if (localStorage.autoStartRoundsValue === "true") {
    autoStartRounds.checked = true;
  } else {
    autoStartRounds.checked = false;
  }
}

function displayNotificationValue() {
  if (localStorage.notificationTextInputValue) {
    notificationTextInput.value = localStorage.notificationTextInputValue;
  } else {
    notificationTextInput.value = 1;
    localStorage.notificationTextInputValue = 1;
  }
}

function displayLongIntervalValue() {
  if (localStorage.longIntervalTime) {
    longBreakIntervalValue.innerHTML = localStorage.longIntervalTime;
    longBreakIntervalSlider.value = localStorage.longIntervalTime;
  } else {
    longBreakIntervalValue.innerHTML = 1;
    longBreakIntervalSlider.value = 1;
    localStorage.longIntervalTime = 1;
  }
}

function displayBackgroundMusic() {
  if (localStorage.backgroundMusicOptionsValue) {
    backgroundMusicOptions.value = localStorage.backgroundMusicOptionsValue;
  } else {
    backgroundMusicOptions.value = "None";
  }
}

function changeButtonColor() {
  if (currentTab == "focus") {
    btn_focus.style.backgroundColor = "rgba(0, 0, 0, 0.15)";
    btn_focus.style.color = "white";
    btn_focus.style.borderWidth = "2px";

    btn_short_break.style.backgroundColor = "transparent";
    btn_short_break.style.color = "white";
    btn_short_break.style.borderWidth = "2px";

    btn_long_break.style.backgroundColor = "transparent";
    btn_long_break.style.color = "white";
    btn_long_break.style.borderWidth = "2px";
  } else if (currentTab == "short_break") {
    btn_focus.style.backgroundColor = "transparent";
    btn_focus.style.color = "white";
    btn_focus.style.borderWidth = "2px";

    btn_short_break.style.backgroundColor = "rgba(0, 0, 0, 0.15)";
    btn_short_break.style.color = "white";
    btn_short_break.style.borderWidth = "2px";

    btn_long_break.style.backgroundColor = "transparent";
    btn_long_break.style.color = "white";
    btn_long_break.style.borderWidth = "2px";
  } else if (currentTab == "long_break") {
    btn_focus.style.backgroundColor = "transparent";
    btn_focus.style.color = "white";
    btn_focus.style.borderWidth = "2px";

    btn_short_break.style.backgroundColor = "transparent";
    btn_short_break.style.color = "white";
    btn_short_break.style.borderWidth = "2px";

    btn_long_break.style.backgroundColor = "rgba(0, 0, 0, 0.15)";
    btn_long_break.style.color = "white";
    btn_long_break.style.borderWidth = "2px";
  }
}

function changeBackgroundColor() {
  if (currentTab == "focus") {
    body_container.style.backgroundColor = "#D95550";
  } else if (currentTab == "short_break") {
    body_container.style.backgroundColor = "#4C9195";
  } else if (currentTab == "long_break") {
    body_container.style.backgroundColor = "#457CA3";
  }
}

btn_focus.addEventListener("click", function () {
  currentTab = "focus";
  currentIntervalCount = 0;
  stopTimer();
  displayTimeLeftValue();
  changeButtonColor();
  changeBackgroundColor();
});

btn_short_break.addEventListener("click", function () {
  currentTab = "short_break";
  currentIntervalCount = 0;
  stopTimer();
  displayTimeLeftValue();
  changeButtonColor();
  changeBackgroundColor();
});

btn_long_break.addEventListener("click", function () {
  currentTab = "long_break";
  currentIntervalCount = 0;
  stopTimer();
  displayTimeLeftValue();
  changeButtonColor();
  changeBackgroundColor();
});

function titleTimeDisplay() {
  titleDisplayText = allPossibleModes[currentTab].titleDisplayText;
}

longBreakIntervalSlider.addEventListener("input", function () {
  longBreakIntervalValue.innerHTML = longBreakIntervalSlider.value;
  localStorage.longIntervalTime = longBreakIntervalSlider.value;
});

autoStartRounds.addEventListener("change", function () {
  localStorage.autoStartRoundsValue = autoStartRounds.checked;
});

tick_sound.addEventListener("change", function () {
  localStorage.playTickSound = tick_sound.checked;
});

btn_clear_task.addEventListener("click", function () {
  task_list.innerHTML = "";
  localStorage.myitems = task_list.innerHTML;
  displayEmptyTask();
});

backgroundMusicOptions.addEventListener("change", function () {
  localStorage.backgroundMusicOptionsValue = backgroundMusicOptions.value;
  stopBackGroundMusic();
  playBackGroundMusic();
});

function stopBackGroundMusic() {
  for (var allSounds in allBackgroundMusic) {
    allBackgroundMusic[allSounds].pause();
    allBackgroundMusic[allSounds].currentEndTime = 0;
  }
}

function playBackGroundMusic() {
  if (!tick_sound.checked) {
    if (localStorage.backgroundMusicOptionsValue) {
      if (localStorage.backgroundMusicOptionsValue !== "None") {
        if (timerIsRunning) {
          allBackgroundMusic[localStorage.backgroundMusicOptionsValue].play();
        }
      }
    }
  }
}

notificationTextInput.addEventListener("change", function () {
  localStorage.notificationTextInputValue = notificationTextInput.value;
});

btnSave.addEventListener("click", function () {
  localStorage.setItem(
    "focus_time",
    document.getElementById("input_focus").value
  );
  localStorage.setItem(
    "long_break_time",
    document.getElementById("long_break_focus").value
  );
  localStorage.setItem(
    "short_break_time",
    document.getElementById("short_break_focus").value
  );

  allPossibleModes["focus"].localStorage =
    document.getElementById("input_focus").value;
  allPossibleModes["long_break"].localStorage =
    document.getElementById("long_break_focus").value;
  allPossibleModes["short_break"].localStorage =
    document.getElementById("short_break_focus").value;

  displayTimeLeftValue();
});

function stopTimer() {
  clearInterval(updateSeconds);
  timerIsRunning = false;
  stopBackGroundMusic();
  btn_start.innerHTML = "START";
  document.title = "PomodoroTimers";
}

btn_clear_logs.addEventListener("click", function () {
  reportUpdateLog.innerHTML = "";
  localStorage.logContents = reportUpdateLog.innerHTML;
  displayNoLogs();
});

btn_start.addEventListener("click", function () {
  if (!timerIsRunning) {
    startCountDown();
  } else {
    stopTimer();
  }
});

btn_reset.addEventListener("click", function () {
  stopTimer();
  displayTimeLeftValue();
});

function startCountDown() {
  timerIsRunning = true;
  playBackGroundMusic();
  changeButtonColor();
  changeBackgroundColor();
  currentStartTime = getTime();
  currentDate = getDate();
  btn_start.innerHTML = "STOP";

  updateSeconds = setInterval(function () {
    if (timeleft <= 0) {
      stopTimer();
      currentEndTime = getTime();
      allPossibleModes[currentTab].sound.play();
      appendDataToReportModal();
      displayReportLog();
      autoStartRound();
      displayTimeLeftValue();
    }

    playTickSound();
    titleTimeDisplay();
    playEndingNotification();
    document.title = secondsToMinutes(timeleft) + " - " + titleDisplayText;
    timeLeftSection.innerHTML = secondsToMinutes(timeleft);
    timeleft -= 1;
  }, 1000);
}

function autoStartRound() {
  if (localStorage.autoStartRoundsValue === "true") {
    if (
      currentTab === "focus" &&
      currentIntervalCount == localStorage.longIntervalTime - 1
    ) {
      currentIntervalCount = 0;
      currentTab = "long_break";
      displayTimeLeftValue();

      changeButtonColor();
      changeBackgroundColor();

      setTimeout(() => {
        startCountDown();
      }, 1000);
    } else if (currentTab === "focus") {
      currentIntervalCount++;
      currentTab = "short_break";
      displayTimeLeftValue();
      changeButtonColor();
      changeBackgroundColor();
      setTimeout(() => {
        startCountDown();
      }, 1000);
    } else if (currentTab === "long_break" || currentTab === "short_break") {
      currentTab = "focus";
      displayTimeLeftValue();
      changeButtonColor();
      changeBackgroundColor();
      setTimeout(() => {
        startCountDown();
      }, 1000);
    }
  }
}

function playEndingNotification() {
  notificationTime = input_notification_time.value;
  if (timeleft === Number(minutesToSeconds(notificationTime))) {
    notification.play();
  }
}

function playTickSound() {
  if (tick_sound.checked) {
    tick.play();
  }
}

function appendDataToReportModal() {
  var sessionsCol = document.createElement("th");

  sessionsCol.setAttribute("scope", "row");
  if (currentTab === "focus") {
    var sessionData = document.createTextNode("Focus");
  } else if (currentTab === "short_break") {
    var sessionData = document.createTextNode("Short Break");
  } else if (currentTab === "long_break") {
    var sessionData = document.createTextNode("Long Break");
  }
  sessionsCol.appendChild(sessionData);

  var dateCol = document.createElement("td");
  dateData = document.createTextNode(currentDate);
  dateCol.appendChild(dateData);

  var startTimeCol = document.createElement("td");
  data = document.createTextNode(currentStartTime);
  startTimeCol.appendChild(data);

  var endTimeCol = document.createElement("td");
  data = document.createTextNode(currentEndTime);
  endTimeCol.appendChild(data);

  var timeCol = document.createElement("td");
  if (allPossibleModes[currentTab].localStorage) {
    data = document.createTextNode(
      allPossibleModes[currentTab].localStorage + " min"
    );
    timeCol.appendChild(data);
  } else {
    data = document.createTextNode(
      allPossibleModes[currentTab].defaultTime + " min"
    );
    timeCol.appendChild(data);
  }

  var row = document.createElement("tr");
  row.setAttribute("scope", "row");
  row.appendChild(sessionsCol);
  row.appendChild(dateCol);
  row.appendChild(startTimeCol);
  row.appendChild(endTimeCol);
  row.appendChild(timeCol);

  row.innerHTML += `<td>
    <input class="form-control" type="text" placeholder="" onchange="storeLogDescription(this)">
    </td>`;
  row.innerHTML += `<td>
  <button type="button" class="close" onclick = "deleteLog(this)" aria-label="Close">
  <img src='images/delete.png'></img>
  </button>
  </td>
  `;
  reportUpdateLog.appendChild(row);
  localStorage.logContents = reportUpdateLog.innerHTML;
}

function storeLogDescription(item) {
  item.outerHTML =
    '<td><input class="form-control" type="text" value="' +
    item.value +
    '" onchange="storeLogDescription(this)"></td>';
  localStorage.logContents = reportUpdateLog.innerHTML;
}

function deleteLog(item) {
  item.parentNode.parentNode.remove();
  localStorage.logContents = reportUpdateLog.innerHTML;
}

btn_add_task.addEventListener("click", function () {
  if (document.querySelector("#textvalue").value !== "") {
    var listItem = document.createElement("li");
    var todo = document.createTextNode(
      document.querySelector("#textvalue").value
    );
    listItem.appendChild(todo);
    listItem.setAttribute("id", "list_item");
    listItem.setAttribute("class", "list-group-item");
    listItem.setAttribute("onclick", "checkedWhenclicked(this)");
    listItem.setAttribute("onmouseover", "taskMouseOver(this)");
    listItem.setAttribute("onmouseout", "taskMouseOut(this)");
    listItem.setAttribute(
      "style",
      "cursor:pointer; overflow-wrap: break-word;"
    );
    var completedButton = document.createElement("img");
    completedButton.setAttribute("id", "delete");
    completedButton.innerHTML = '<i class="fas fa-trash-alt fa-sm"></i>';
    completedButton.classList.add("close");
    completedButton.setAttribute("onclick", "deleteTasks(this)");
    listItem.appendChild(completedButton);
    completedButton.src = "images/delete.png";
    task_list.appendChild(listItem);
    document.querySelector("#textvalue").value = "";
    storeTask();
    displayEmptyTask();
  } else {
    alert("Task can not be empty.");
  }
});

function taskMouseOut(item) {
  item.style.fontSize = "1rem";
  item.style.transition = "100ms";
}

function taskMouseOver(item) {
  item.style.fontSize = "1.2rem";
  item.style.transition = "100ms";
}

function checkedWhenclicked(item) {
  item.style.transition = "all 0.2s ease-in";
  item.classList.toggle("done");
}

function storeTask() {
  localStorage.myitems = task_list.innerHTML;
}

function deleteTasks(item) {
  item.parentElement.style.transition = "all 0.2s ease-in";
  item.parentElement.addEventListener("transitionend", function () {
    item.parentElement.remove();
    storeTask();
    displayEmptyTask();
  });
}

function hideNoLogs() {
  document.getElementById("NoDataLoggedText").style.display = "none";
}
function displayNoLogs() {
  document.getElementById("NoDataLoggedText").style.display = "block";
}

let conversionMiToTimeOp = function conversionMiToTime(totalMinutes) {
  return (totalMinutes % 60) + ": 00";
};

function minutesToSeconds(minute) {
  return minute * 60;
}

function secondsToMinutes(second) {
  var minutes = Math.floor(second / 60);
  var seconds = second % 60;
  if (String(seconds).length === 1) {
    seconds = "0" + String(seconds);
  }
  if (String(minutes).length === 1) {
    minutes = "0" + String(minutes);
  }
  return minutes + ":" + String(seconds);
}

function getDate() {
  monthList = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var today = new Date();
  var date = today.getDate();
  var month = monthList[today.getMonth()];
  var year = today.getFullYear();
  return date + " " + month + " " + year;
}

function getTime() {
  var amOrPm = " AM";
  var today = new Date();
  var hours = today.getHours();
  if (Number(hours) > 12) {
    amOrPm = " PM";
    hours = Number(hours) % 12;
  }
  if (Number(hours) === 12) {
    amOrPm = " PM";
  }
  var minutes = today.getMinutes();
  if (String(minutes).length === 1) {
    minutes = "0" + minutes;
  }
  var time = hours + ":" + minutes + amOrPm;
  return time;
}
