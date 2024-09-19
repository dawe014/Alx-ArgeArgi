// import axios from "axios";

// const axios = require("axios");
import { showAlert } from "./alerts.js";

const updateSetting = async (id, data, type) => {
  try {
    const url = `/api/v1/sellhouse/${id}`;

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
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".update_sell_home");

  document.querySelectorAll(".delete-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const homeId = button.getAttribute("data-home-id");
      const imageUrl = button.getAttribute("data-image-url");
      const index = button.getAttribute("data-index");
      deleteImage(homeId, imageUrl, index);
    });
  });


  const button = document.getElementById("add-image-button");
  button.addEventListener("click", async (event)=>{
    event.preventDefault();
    const fileInput = document.getElementById("new-image");
    const homeId = button.getAttribute("data-image-id");

    const file =  fileInput.files[0];


    console.log('dawe', file)
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
        console.log("dawe", formData);

      const res = await axios
        .post(`/api/v1/sellhouse/${homeId}/addimage`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
      if (res.data.status === "success") {
        showAlert("success", `Image  added successfully!`);
      }
    }
  });

  console.log("from update js....");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("title").value;
      const description = document.getElementById("description").value;
      const area = document.getElementById("area").value;
      const id = document.getElementById("id").value;
      const kebele = document.getElementById("kebele").value;
      const city = document.getElementById("city").value;
      const state = document.getElementById("state").value;
      const bathRooms = document.getElementById("bathRooms").value;
      const bedRooms = document.getElementById("bedRooms").value;
      const price = document.getElementById("price").value;
      console.log(title);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("area", area);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("price", price);
      formData.append("kebele", kebele);
      formData.append("bathRooms", bathRooms);
      formData.append("bedRooms", bedRooms);
      // if (photo) formData.append("photo", photo);

      updateSetting(id, formData);
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

async function deleteImage(homeId, imageUrl, index) {
  try {
    console.log(homeId, imageUrl);
    // Send delete request to the server
    await axios.delete(`/api/v1/sellhouse/${homeId}/image`, {
      data: {
        imageUrl: imageUrl,
      },
    });

    // Update the images array and input field on the client side
    let imagesInput = document.getElementById("images");
    let imagesArray = imagesInput.value.split(", ");

    // Remove the image at the specified index
    imagesArray.splice(index, 1);

    // Update the input field
    imagesInput.value = imagesArray.join(", ");

    // Remove the image container from the DOM
    let imageContainer = document.getElementById(`image-${index}`);
    imageContainer.remove();
  } catch (error) {
    console.error("Error deleting image:", error);
  }
}
