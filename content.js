let isWatchingPlaylist;
let likeButton;
let seeked = false;
let likedVideo = false;
let likeAnyVideo = false;
let likeSeeked = false;

// Run Script when page has loaded
document.addEventListener("DOMContentLoaded", () => {
  runApp();
});

//
window.addEventListener("transitionend", event => {
  if (
    event.target.id === "progress" &&
    event.target.className.includes("yt-page-navigation-progress")
  ) {
    runApp();
  }
});

/** FUNCTIONS **/
// Reset Variables
function reset() {
  seeked = false;
  likeAnyVideo = false;
  likeSeeked = false;

  likeButton = document.querySelector(
    "#button.ytd-toggle-button-renderer:first-child"
  );

  likedVideo = likeButton.classList.includes("style-default-active");
}

// Initialize App
function initializeApp() {
  reset();
  getSavedConfigurations();
  subscribeToStorageChanges();
}

// Get user preference from storage
function getSavedConfigurations() {
  chrome.storage.sync.get(["any-video", "seeked"], res => {
    likeAnyVideo = res["any-video"];
    likeSeeked = res["seeked"];
  });
}

// Listen to preference changes and return from storage
function subscribeToStorageChanges() {
  chrome.storage.onChanged.addListener(() => getSavedConfigurations());
}

// Check if the video is in playlist
function videoInPlaylist() {
  const { pathname, search } = window.location;

  if (
    pathname === "watch" &&
    search.includes("list=") &&
    !search.includes("&list=WL")
  ) {
    isWatchingPlaylist = true;
  } else {
    isWatchingPlaylist = false;
  }
}

// Like Video
function likeVideo() {
  video.addEventListener("progress", _ => {
    const { getCurrentTime, getDuration } = video;
    const halfDuration = getDuration() / 2;

    if (getCurrentTime() >= halfDuration && !likedVideo && !seeked) {
      likeButton.click();
      likedVideo = true;
    }
  });
}

function checkSeeked() {
  const video = document.querySelector("video.html5-main-video");

  video.addEventListener("seeked", _ => {
    seeked = true;
  });
}

// Track video progress and like video when halfway through
function likeVideoWhenHalfwayThrough() {
  if (likeAnyVideo || isWatchingPlaylist) {
    checkSeeked();

    if (likeSeeked || seeked) {
      likeVideo();
    }
  }
}

// Run Extension
function runApp() {
  initializeApp();
  videoInPlaylist();
  likeVideoWhenHalfwayThrough();
}
