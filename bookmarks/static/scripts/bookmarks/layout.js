document.addEventListener("DOMContentLoaded", function () {
  const aside = document.getElementsByTagName("aside")[0];
  const sidebarToggleButton = document.getElementById("sidebar-toggle-button");
  const overlay = document.querySelector(".overlay");
  const body = document.querySelector("body");

  sidebarToggleButton.addEventListener("click", function () {
    aside.classList.toggle("open");
    overlay.classList.toggle("active");
    body.classList.toggle("no-scroll");
  });

  overlay.addEventListener("click", function () {
    aside.classList.toggle("open");
    overlay.classList.remove("active");
    body.classList.remove("no-scroll");
  });
});
