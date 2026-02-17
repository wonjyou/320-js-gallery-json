var nextBtn = document.getElementById("next");
var leftBtn = document.getElementById("left");
var carousel = document.querySelector("ul");
var indicatorsContainer = document.querySelector(".indicators");

var track = document.createElement("div");
track.classList.add("track");
carousel.appendChild(track);

var dots = [];
var totalImages = 0;
var currentImage = 0;

// Autoplay variables
var autoplayBtn = document.getElementById("autoplay-btn");
var pauseIcon = autoplayBtn.querySelector(".pause-icon");
var playIcon = autoplayBtn.querySelector(".play-icon");
var progressRingFill = document.querySelector(".progress-ring-fill");
var autoplayInterval = null;
var isPlaying = true;

// Fetch image data from JSON file and initialise the carousel
fetch("./images.json")
  .then(function(response) {
    if (!response.ok) {
      throw new Error("Failed to load images.json: " + response.status);
    }
    return response.json();
  })
  .then(function(data) {
    var images = data.images;
    totalImages = images.length;

    // Build carousel items from JSON data
    for (var i = 0; i < images.length; i++) {
      var li = document.createElement("li");
      var img = document.createElement("img");
      img.src = images[i].src;
      img.alt = images[i].alt;
      li.appendChild(img);
      track.appendChild(li);
    }

    // Build indicator dots
    for (var i = 0; i < images.length; i++) {
      var dot = document.createElement("button");
      dot.classList.add("dot");
      dot.setAttribute("data-index", i);
      dot.onclick = function() {
        currentImage = parseInt(this.getAttribute("data-index"));
        setImage();
        checkState();
        updateDots();
        resetAutoplay();
      };
      indicatorsContainer.appendChild(dot);
      dots.push(dot);
    }

    // Initialise carousel state
    checkState();
    updateDots();
    setImage();
    startAutoplay();
  })
  .catch(function(error) {
    console.error("Error loading gallery images:", error);
    carousel.innerHTML =
      "<li style='display:flex;align-items:center;justify-content:center;width:800px;height:800px;color:#666;font-family:sans-serif;'>Failed to load images. Please check images.json.</li>";
  });

function setImage() {
  track.style.transform = "translateX(-" + currentImage * 100 + "%)";
}

function updateDots() {
  for (var i = 0; i < dots.length; i++) {
    dots[i].classList.remove("active");
  }
  if (dots[currentImage]) {
    dots[currentImage].classList.add("active");
  }
}

function checkState() {
  if (currentImage === 0) {
    leftBtn.classList.add("disable");
  }
  if (currentImage === totalImages - 1) {
    nextBtn.classList.add("disable");
  }
  if (currentImage > 0 && currentImage < totalImages - 1) {
    nextBtn.classList.remove("disable");
  }
  if (currentImage > 0) {
    leftBtn.classList.remove("disable");
  }
}

function goLeft() {
  if (currentImage > 0) {
    currentImage--;
    setImage();
  }
  checkState();
  updateDots();
  resetAutoplay();
}

function goRight() {
  if (currentImage < totalImages - 1) {
    currentImage++;
    setImage();
  }
  checkState();
  updateDots();
  resetAutoplay();
}

leftBtn.onclick = goLeft;
nextBtn.onclick = goRight;

// Keyboard arrow key navigation
document.addEventListener("keydown", function(e) {
  if (e.key === "ArrowLeft") {
    goLeft();
  } else if (e.key === "ArrowRight") {
    goRight();
  }
});

// Autoplay helpers
function restartRingAnimation() {
  progressRingFill.style.animation = "none";
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      progressRingFill.style.animation = "ring-countdown 5s linear forwards";
    });
  });
}

function stopRingAnimation() {
  progressRingFill.style.animation = "none";
}

function autoplayNext() {
  currentImage = (currentImage + 1) % totalImages;
  setImage();
  checkState();
  updateDots();
  restartRingAnimation();
}

function startAutoplay() {
  autoplayInterval = setInterval(autoplayNext, 5000);
  isPlaying = true;
  pauseIcon.classList.remove("hidden");
  playIcon.classList.add("hidden");
  autoplayBtn.setAttribute("aria-label", "Pause autoplay");
  restartRingAnimation();
}

function stopAutoplay() {
  clearInterval(autoplayInterval);
  autoplayInterval = null;
  isPlaying = false;
  pauseIcon.classList.add("hidden");
  playIcon.classList.remove("hidden");
  autoplayBtn.setAttribute("aria-label", "Play autoplay");
  stopRingAnimation();
}

function resetAutoplay() {
  if (isPlaying) {
    clearInterval(autoplayInterval);
    autoplayInterval = setInterval(autoplayNext, 5000);
    restartRingAnimation();
  }
}

autoplayBtn.onclick = function() {
  if (isPlaying) {
    stopAutoplay();
  } else {
    startAutoplay();
  }
};
