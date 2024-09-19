function dropdownmenu() {
  var dropdownContent = document.getElementById("dropdownContent");
  var profile = document.getElementById("profile");
  if (dropdownContent.style.display === "block") {
    dropdownContent.style.display = "none";
    profile.style.boxShadow = "none";
  } else {
    dropdownContent.style.display = "block";
    profile.style.boxShadow = "-0.2px -0.2px 3px 3px  #dddddd";
  }
}

// Optional: Close the dropdown if the user clicks outside of it

window.onclick = function (event) {
  if (
    !event.target.matches("#dropdownButton") &&
    !event.target.closest("#dropdownButton")
  ) {
    var profile = document.getElementById("profile");

    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.style.display === "block") {
        openDropdown.style.display = "none";
        profile.style.boxShadow = "none";
      }
    }
  }
};

// Display the signup modal
// document.getElementById("signupLink").onclick = function () {
//   var modal = document.getElementById("signupModal");
//   modal.style.display = "block";
// };

// Close the modal when the user clicks on <span> (x)
// document.querySelector(".close").onclick = function () {
//   var modal = document.getElementById("signupModal");
//   modal.style.display = "none";
// };

// Close the modal when the user clicks anywhere outside of the modal
// window.onclick = function (event) {
//   var modal = document.getElementById("signupModal");
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// };
