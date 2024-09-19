// import axios from "axios";
// const axios = require('axios');
import { showAlert } from "./alerts.js";

const updateSetting = async (data, type) => {
  try {
    const url =
      type === "password"
        ? "http://127.0.0.1:4000/api/v1/users/updateMyPassword"
        : "http://127.0.0.1:4000/api/v1/users/updateMe";

    const res = await axios({
      method: "PATCH",
      url,
      data,
      headers: {
        "Content-Type":
          type === "data" ? "multipart/form-data" : "application/json",
      },
    });

    if (res.data.status === "success") {
      showAlert("success", `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form-user-data");
  const pass = document.querySelector(".form-user-password");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const phone = document.getElementById("phone").value;
      const name = document.getElementById("name").value;
      const photoInput = document.getElementById("photo");
      const photo = photoInput ? photoInput.files[0] : null;
      alert('photo')

      if (!phone || !name) {
        alert("Please fill in both fields.");
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      if (photo) formData.append("photo", photo);

      updateSetting(formData, "data");
    });
  }

  if (pass) {
    pass.addEventListener("submit", (e) => {
      e.preventDefault();
      const currentPassword = document.getElementById("password-current").value;
      const password = document.getElementById("password").value;
      const passwordConfirm = document.getElementById("password-confirm").value;

      if (!currentPassword || !password || !passwordConfirm) {
        alert("Please fill in all fields.");
        return;
      }

      updateSetting({ currentPassword, password, passwordConfirm }, "password");
    });
  }
});


 document.addEventListener("DOMContentLoaded", () => {
   const links = document.querySelectorAll(".nav-link");

   links.forEach((link) => {
     link.addEventListener("click", function (event) {
       event.preventDefault(); // Prevent default behavior
       const url = this.getAttribute("data-link");

       fetch(url)
         .then((response) => {
           if (!response.ok) throw new Error("Network response was not ok");
           return response.text();
         })
         .then((html) => {
           document.querySelector(".user-view__content").innerHTML = html; // Update content
         })
         .catch((error) => console.error("Error fetching page:", error));
     });
   });
 });

 document.getElementById("toggleNav").addEventListener("click", function () {
   const menu = document.querySelector(".user-view__menu");
   menu.classList.toggle("active");
 });

 // Close the menu if clicked outside
 window.addEventListener("click", function (event) {
   const menu = document.querySelector(".user-view__menu");
   const toggleNav = document.getElementById("toggleNav");
   if (!toggleNav.contains(event.target) && !menu.contains(event.target)) {
     menu.classList.remove("active");
   }
 });