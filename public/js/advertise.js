import { showAlert } from "./alerts.js";

const form = document.getElementById("add_asset");
const tableSelect = document.getElementById("table_select");
const inputFields = document.querySelectorAll(
  ".form__group:not(.form__group--table-select)"
);

if (form) {
  inputFields.forEach((field) => {
    field.style.display = "none";
  });

  function handleSelectionChange() {
    inputFields.forEach((field) => {
      field.style.display = "none";
    });
    const selectedTable = tableSelect.value;
    console.log("Selected value:", selectedTable);

    if (selectedTable) {
      showInputFields(selectedTable);
    }
  }

  tableSelect.addEventListener("change", handleSelectionChange);
}

form.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent the default form submission
  const selectedTable = tableSelect.value;

  if (validateForm()) {
    // Submit the data
    submitDataToApi(selectedTable);
  } else {
    showAlert("error", "Please fill in all required fields.");
  }
});

function showInputFields(tableId) {
  document.querySelectorAll(`.form__group--${tableId}`).forEach((field) => {
    field.style.display = "block";
  });
}

function validateForm() {
  let isValid = true;
  const selectedTable = document.getElementById("table_select").value;

  // Select all fields for the selected table
  let fieldsToValidate;

  switch (selectedTable) {
    case "sellhouse":
      fieldsToValidate = document.querySelectorAll(
        ".form__group--sellhouse input, .form__group--sellhouse select"
      );
      break;
    case "renthouse":
      fieldsToValidate = document.querySelectorAll(
        ".form__group--renthouse input, .form__group--renthouse select"
      );
      break;
    case "land":
      fieldsToValidate = document.querySelectorAll(
        ".form__group--land input, .form__group--land select"
      );
      break;
    default:
      fieldsToValidate = [];
      break;
  }

  fieldsToValidate.forEach((field) => {
    field.required = true; // Make all fields required

    // Check if the field is empty
    if (!field.value.trim()) {
      isValid = false;
      field.classList.add("error"); // Add error class for styling
    } else {
      field.classList.remove("error"); // Remove error class if valid
    }
    field.required = false; // Make all fields required
  });

  return isValid;
}

async function submitDataToApi(selectedTable) {
  // const form = document.getElementById("add_asset");

  // const userId = getLoggedInUserId(); // Get user ID from cookie

  const title = document.getElementById("title").value;
  const user = document.getElementById("id").value;
  const price = document.getElementById("price").value;
  const area = document.getElementById("area")
    ? document.getElementById("area").value
    : null;
  const bedRooms = document.getElementById("bedrooms")
    ? document.getElementById("bedrooms").value
    : null;
  const bathRooms = document.getElementById("bathrooms")
    ? document.getElementById("bathrooms").value
    : null;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;
  const kebele = document.getElementById("kebele").value;
  const city = document.getElementById("city").value;
  const state = document.getElementById("state").value;
  const coverImage = document.getElementById("coverImage").files[0];
  const images = document.getElementById("images").files;

  // // Create a JSON object
  // const data = {
  //   title,
  //   price,
  //   user,
  //   area,
  //   bedRooms,
  //   bathRooms,
  //   category,
  //   description,
  //   kebele,
  //   city,
  //   state,
  //   coverImage: coverImage,
  //   images: Array.from(images).map((file) => file),
  // };
  
  const formData = new FormData();
  formData.append("title", title);
  formData.append("price", price);
  formData.append("user", user);
  if (area) formData.append("area", area);
  if (bedRooms) formData.append("bedRooms", bedRooms);
  if (bathRooms) formData.append("bathRooms", bathRooms);
  formData.append("category", category);
  formData.append("description", description);
  formData.append("kebele", kebele);
  formData.append("city", city);
  formData.append("state", state);
  if (coverImage) formData.append("coverImage", coverImage);
  for (const img of images) {
    formData.append("images", img);
  }
  // Log the data
  // console.log("FROM/ INPUT FILES" ,data);

  let url;

  switch (selectedTable) {
    case "sellhouse":
      url = "/api/v1/sellhouse"; // Replace with your actual API endpoint
      break;
    case "renthouse":
      url = "/api/v1/renthouse"; // Replace with your actual API endpoint
      break;
    case "land":
      url = "/api/v1/land"; // Replace with your actual API endpoint
      break;
    default:
      alert("Please select a valid option.");
      return;
  }

  // Send data using Axios
  const res = await axios({
    method: "POST",
    url,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
    .then((response) => {
      console.log("Success:", response.data);
      showAlert("success", "You have posted successfully,\nThank you");
    })
    .catch((error) => {
      console.error("Error:", error);
      showAlert("error", "Retry, there was some error");
    });

   if (res.data.status === "success") {
     showAlert("success", `${type.toUpperCase()} Data posted successfully!`);
     console.log("posted");
   }

}

