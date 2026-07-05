const skeleton = document.querySelector("#aboutSkeleton");
const content = document.querySelector("#aboutContent");

window.addEventListener("load", () => {
  setTimeout(() => {
    skeleton.style.display = "none";
    content.classList.remove("hidden");
    content.classList.add("fade_in");
  }, 1100);
});
