document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("manage");

  document.querySelectorAll(".delete-button").forEach((button) => {
    button.addEventListener("submit", (event) => {
      event.preventDefault();
      const homeId = button.getAttribute("data-home-id");
      console.log(homeId)
      // deleteImage(homeId, imageUrl, index);
    });
  });

});