// import axios from "axios";

// const axios = require("axios");
import { showAlert } from "./alerts.js";

const updateSetting = async (id, data, type) => {
  try {
    const url = `/api/v1/users/${id}`;

    const res = await axios({
      method: "PATCH",
      url,
      data,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.data.status === "success") {
      showAlert("success", `${type.toUpperCase()} updated successfully!`);
      console.log("updated");
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
    console.log("error", err.response.data);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".update_user");

  


  console.log("from update js....");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("Dawe user keedha submit keessa");
      const name = document.getElementById("name").value;
      const phone = document.getElementById("phone").value;
      const role = document.getElementById("role").value;
      const id = document.getElementById("id").value;

      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("role", role);

      updateSetting(id, formData, "data");
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
