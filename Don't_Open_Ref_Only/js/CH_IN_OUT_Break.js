// Checks whether attendance belongs to today.
// If the date changes, yesterday's data is removed.

function resetAttendanceForNewDay() {

  let today = moment().format("YYYY-MM-DD");

  let savedDate =
    localStorage.getItem("attendanceDate");

  if (savedDate !== today) {

    localStorage.removeItem("checkInTime");
    localStorage.removeItem("checkOutTime");
    localStorage.removeItem("breakStart");
    localStorage.removeItem("breakEnd");

    localStorage.setItem(
      "attendanceDate",
      today
    );
  }
}

document.addEventListener("DOMContentLoaded", function () {

  // Show today's date

  const today = moment().format("dddd, MMMM D, YYYY");

  document.getElementById(
    "current-date"
  ).textContent = today;

  // Live clock

  function updateTime() {

    const now = moment();

    document.getElementById(
      "current_time"
    ).textContent =
      now.format("HH:mm:ss");
  }

  updateTime();

  setInterval(updateTime, 1000);

  // Check if a new day has started

  resetAttendanceForNewDay();

  // Card click events

  document
    .getElementById("checkInCard")
    .addEventListener("click", checkIn);

  document
    .getElementById("checkOutCard")
    .addEventListener("click", checkOut);

  document
    .getElementById("break-button")
    .addEventListener("click", toggleBreak);

  // Restore saved attendance data

  loadAttendance();
});


// Save the user's check-in time

function checkIn() {

  let checkInTime =
    localStorage.getItem("checkInTime");

  // Prevent multiple check-ins

  if (checkInTime) {
    alert("Already Checked In");
    return;
  }

  let now = new Date();

  // Save check-in time

  localStorage.setItem(
    "checkInTime",
    now.toString()
  );

  document.getElementById(
    "checkInStatus"
  ).innerHTML =
    "<strong>Checked In</strong>";

  document.getElementById(
    "checkInTime"
  ).innerText =
    now.toLocaleTimeString();
}


// Save check-out time and calculate working hours

function checkOut() {

  let checkInTime =
    localStorage.getItem("checkInTime");

  if (!checkInTime) {
    alert("Please Check In First");
    return;
  }

  let alreadyCheckedOut =
    localStorage.getItem("checkOutTime");

  if (alreadyCheckedOut) {
    alert("Already Checked Out");
    return;
  }

  let now = new Date();

  localStorage.setItem(
    "checkOutTime",
    now.toString()
  );

  // Disable break button after checkout

  document.getElementById(
    "break-button"
  ).disabled = true;

  document.getElementById(
    "break-button"
  ).innerText =
    "Checked Out";

  document.getElementById(
    "checkOutTime"
  ).innerText =
    "Checked Out : " +
    now.toLocaleTimeString();

  let start =
    new Date(checkInTime);

  // Calculate total working time

  let totalMinutes =
    Math.floor(
      (now - start) / 60000
    );

  let hours =
    Math.floor(totalMinutes / 60);

  let minutes =
    totalMinutes % 60;

  document.getElementById(
    "workingHours"
  ).innerText =
    hours + "h " + minutes + "m";
}


// Start and end break timer

function toggleBreak() {

  // User must check in first

  let checkInTime =
    localStorage.getItem("checkInTime");

  if (!checkInTime) {
    alert("Please Check In First");
    return;
  }

  // Don't allow breaks after checkout

  let checkOutTime =
    localStorage.getItem("checkOutTime");

  if (checkOutTime) {
    alert(
      "You have already checked out for today"
    );
    return;
  }

  let breakStart =
    localStorage.getItem("breakStart");

  let button =
    document.getElementById("break-button");

  let info =
    document.getElementById("breakInfo");

  // User starts break

  if (!breakStart) {

    let now = new Date();

    localStorage.setItem(
      "breakStart",
      now.toString()
    );

    button.innerText =
      "End Break";

    info.innerText =
      "Break Started : " +
      now.toLocaleTimeString();
  }

  // User ends break

  else {

    let endTime = new Date();

    let startTime =
      new Date(breakStart);

    let totalMinutes =
      Math.floor(
        (endTime - startTime) / 60000
      );

    info.innerText =
      "Break : " +
      startTime.toLocaleTimeString() +
      " to " +
      endTime.toLocaleTimeString() +
      " (" +
      totalMinutes +
      " min)";

    localStorage.setItem(
      "breakEnd",
      endTime.toString()
    );

    button.innerText =
      "Take A Break";

    localStorage.removeItem(
      "breakStart"
    );
  }
}


// Restore attendance data after refresh

function loadAttendance() {

  let checkInTime =
    localStorage.getItem("checkInTime");

  let checkOutTime =
    localStorage.getItem("checkOutTime");

  let breakStart =
    localStorage.getItem("breakStart");

  let breakEnd =
    localStorage.getItem("breakEnd");

  if (checkInTime) {

    document.getElementById(
      "checkInStatus"
    ).innerHTML =
      "<strong>Checked In</strong>";

    document.getElementById(
      "checkInTime"
    ).innerText =
      new Date(checkInTime)
        .toLocaleTimeString();
  }

  if (checkOutTime) {

    let start =
      new Date(checkInTime);

    let end =
      new Date(checkOutTime);

    let totalMinutes =
      Math.floor(
        (end - start) / 60000
      );

    let hours =
      Math.floor(totalMinutes / 60);

    let minutes =
      totalMinutes % 60;

    document.getElementById(
      "workingHours"
    ).innerText =
      hours + "h " + minutes + "m";

    document.getElementById(
      "checkOutTime"
    ).innerText =
      "Checked Out : " +
      end.toLocaleTimeString();

    // Keep break button disabled after refresh

    document.getElementById(
      "break-button"
    ).disabled = true;

    document.getElementById(
      "break-button"
    ).innerText =
      "Checked Out";
  }

  if (breakStart) {

    document.getElementById(
      "break-button"
    ).innerText =
      "End Break";

    document.getElementById(
      "breakInfo"
    ).innerText =
      "Break Started : " +
      new Date(breakStart)
        .toLocaleTimeString();
  }

  if (breakEnd) {

    document.getElementById(
      "breakInfo"
    ).innerText =
      "Last Break Ended At : " +
      new Date(breakEnd)
        .toLocaleTimeString();
  }
}