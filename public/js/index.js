import '@babel/polyfill';

import { login } from "./login";
import { dropdownmenu, setupOutsideClick } from "./script";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form--login");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const phone = document.getElementById("phone").value;
      const password = document.getElementById("password").value;

      if (!phone || !password) {
        alert("Please fill in both fields.");
        return;
      }

      login(phone, password);
    });
  }
});


document.getElementById("dropdownButton").onclick = dropdownmenu;
setupOutsideClick();