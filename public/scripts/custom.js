function HideSideBar() {
  var element = document.getElementById("sidebar")
  element.classList.toggle("hidden")

  if (window.location.pathname === "/watch") {
    return
  }

  if (window.innerWidth <= 470) {
    var element = document.getElementById("content-section")
    element.classList.remove("ml-[200px]")
    element.classList.add("mobile-mode")
  } else {
    var element = document.getElementById("content-section")
    element.classList.toggle("ml-[200px]")
  }

}
