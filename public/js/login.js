// import axios from "axios";
// const axios = require('axios');

// import { showAlert } from "./alerts";

// const { signUp } = require("../../controllers/viewController");

const hideAlert = () => {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};

showAlert = (type, msg, time = 7) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(hideAlert, time * 1000);
};

const login = async (phone, password) => {
  console.log("dawe from login to the system login.js");
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/login",
      data: {
        phone,
        password,
      },
    });
    console.log("respnse message", res);
    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }

    console.log(res);
  } catch (err) {
    console.log("dawe login error message", err);
    showAlert("error", err.response.data.message);

    console.log("DAWE", err.response.data.message);
  }
};

const signUp = async (name, phone, password, passwordConfirm) => {
  console.log("dawe from signup to the system");
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/signup",
      data: {
        name,
        phone,
        password,
        passwordConfirm,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Signup  successfully!");
      window.setTimeout(() => {
        location.assign("/login");
      }, 1500);
    }

    console.log(res);
  } catch (err) {
    showAlert("error", err.response.data.message);

    // console.log("DAWE signup", err.response.data.message);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const form_login = document.getElementById("form--login");
  const form_signup = document.getElementById("form--signup");
  if (form_login) {
    form_login.addEventListener("submit", (e) => {
      e.preventDefault();
      const phone = document.getElementById("phone").value;
      const password = document.getElementById("password").value;

      if (!phone || !password) {
        alert("Please fill in both fields.");
        return;
      }
      console.log("dawe================");

      login(phone, password);
    });
  }

  if (form_signup) {
    form_signup.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const phone = document.getElementById("phone").value;
      const password = document.getElementById("password").value;
      const passwordConfirm = document.getElementById("passwordConfirm").value;

      if (!phone || !password || !name || !passwordConfirm) {
        alert("Please fill in All fields.");
        return;
      }

      signUp(name, phone, password, passwordConfirm);
    });
  }
});

const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/v1/users/logout",
    });
    // window.location.href = "/buyhouse";
    // console.log(res.data);

    // if ((res.data.status = "success"))
  } catch (err) {
    console.log(err.response);
    showAlert("error", "Error logging out! Try again.");
  }
};
