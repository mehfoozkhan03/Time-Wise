document.addEventListener("DOMContentLoaded", () => {
  // import { style } from "./nav_footer";
  const breakButton = document.getElementById("break-button");
  const breakPopup = document.getElementById("break-popup");
  // const updateTime = document.getElementById("current-time");
  const closePopup = document.getElementById("close-popup");

  // This is the Date showing function
  const today = moment().format("dddd, MMMM D, YYYY");
  document.getElementById("current-date").textContent = today;

  // This is the function showing current time
  function updateTime() {
    const now = moment();
    document.getElementById("current_time").textContent =
      now.format("HH:mm:ss");
  }
  setInterval(updateTime, 1000);

  if (breakButton && breakPopup) {
    // Show popup
    breakButton.addEventListener("click", () => {
      breakPopup.classList.add("active");
    });

    // Close popup
    closePopup.addEventListener("click", () => {
      breakPopup.classList.remove("active");
    });
  }
});

// Skeleton Loading

const skeleton = document.querySelector("#homeSkeleton");
const content = document.querySelector("#homeContent");

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    skeleton.style.display = "none";
    content.classList.remove("hidden");
    content.classList.add("fade_in");
  }, 1100);
});