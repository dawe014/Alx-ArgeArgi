document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".buy__house");
  cards.forEach((card) => {
    card.addEventListener("click", function () {
      const id = card.getAttribute("data-id");
      console.log("dawe================");

      window.location.href = `/details/${id}`;
    });
  }); 
});

const slides = document.querySelectorAll(".slides img");
let slideIndex = 0;
let intervalid = null;

document.addEventListener("DOMContentLoaded", initializeSlider);

function initializeSlider() {
  if (slides.length > 0) {
    showSlides();
    intervalid = setInterval(nextSlide, 5000);
  }
}

function showSlides() {
  const slidesToShow = Math.min(slides.length, window.innerWidth > 680 ? 2 : 1);
  const offset = -slideIndex * (100 / slidesToShow);
  document.querySelector(".slides").style.transform = `translateX(${offset}%)`;
}

function prevSlide() {
  clearInterval(intervalid);
  slideIndex = (slideIndex - 1 + slides.length) % slides.length;
  showSlides();
}

function nextSlide() {
  slideIndex = (slideIndex + 1) % slides.length;
  showSlides();
}

// Swipe functionality
let startX;

document.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

document.addEventListener("touchmove", (e) => {
  const moveX = e.touches[0].clientX;
  if (startX - moveX > 50) {
    nextSlide();
  } else if (moveX - startX > 50) {
    prevSlide();
  }
});
