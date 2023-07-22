function HideSideBar() {
  var element = document.getElementById("sidebar");
  element.classList.toggle("hidden");

  var element = document.getElementById("content-section");
  element.classList.toggle("ml-[200px]");
}
