//ui variables
const uiVars = {
  video: getElement('video'),
  durationCount: getElement('durationCount'),
  durationBarContainer: getElement('durationBarContainer'),
  durationBar: getElement('durationBar'),
  playBtn: getElement('play'),
  playIcon: getElement('playIcon'),
  volumeIcon: getElement('volumeIcon'),
  volume: getElement('volume'),
  volumeRange: getElement('volumeRange'),
  stopBtn: getElement('stop'),
  nextBtn: getElement('next'),
  prevBtn: getElement('prev'),
  file: getElement('fileElem'),
  allVideos: getElement('allVideosContainer'),
};

let videos = [];
let videoIndex = 0;

//event listeners
function events() {
  //load videos event
  uiVars.file.addEventListener('change', loadVideos);

  //play and pause button event
  uiVars.playBtn.addEventListener('click', playVideo);

  //video timeupdate event
  uiVars.video.addEventListener('timeupdate', setDuration);

  //next video
  uiVars.nextBtn.addEventListener('click', nextVideo);

  //prev video
  uiVars.prevBtn.addEventListener('click', prevVideo);

  //stop video
  uiVars.stopBtn.addEventListener('click', stopVideo);

  //change video event
  uiVars.allVideos.addEventListener('click', changeVideo);

  //change duration bar event
  uiVars.durationBarContainer.addEventListener('click', changeDuration);

  //show volume event
  uiVars.volumeIcon.addEventListener('mouseover', showVolume);

  //hide volume event
  uiVars.volumeRange.addEventListener('mouseleave', hideVolume);

  //set volume
  uiVars.volumeRange.addEventListener('click', setVolume);
}

//load videos
function loadVideos() {
  const files = Array.from(uiVars.file.files);

  files.forEach((file) => {
    videos.push({
      path: `./${file.webkitRelativePath}\n`,
      name: file.name,
    });

    const div = `
    <div class="video">
            <video class="change"
              src="./${file.webkitRelativePath}\n"
            ></video>
            <p>${file.name}</p>
            <hr />
          </div>
    `;

    uiVars.allVideos.innerHTML += div;

    uiVars.playBtn.disabled = false;
  });
  uiVars.video.setAttribute('src', videos[videoIndex].path);
}

function playPause() {
  if (uiVars.playIcon.classList.contains('fa-play')) {
    uiVars.video.play();
    uiVars.playIcon.classList.replace('fa-play', 'fa-pause');
  } else {
    uiVars.video.pause();
    uiVars.playIcon.classList.replace('fa-pause', 'fa-play');
  }
}

function playVideo() {
  playPause();
}

//set duration
function setDuration() {
  //get minutes and seconds
  const minutes = Math.floor(uiVars.video.currentTime / 60);
  const seconds = Math.floor(uiVars.video.currentTime - minutes * 60);

  //set duration textContent to minutes and seconds
  uiVars.durationCount.textContent = `${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  //get progress bar
  const barLength =
    uiVars.durationBarContainer.clientWidth *
    (uiVars.video.currentTime / uiVars.video.duration);

  //set progress bar
  uiVars.durationBar.style.width = `${barLength}px`;

  checkVideoEnd();
}

//next video
function nextVideo() {
  if (videoIndex < videos.length - 1 && videos.length !== 0) {
    uiVars.video.setAttribute('src', videos[(videoIndex += 1)].path);

    uiVars.video.play();
    uiVars.playIcon.classList.replace('fa-play', 'fa-pause');
  } else {
    videoIndex = 0;
    uiVars.video.setAttribute('src', videos[videoIndex].path);

    uiVars.video.play();
    uiVars.playIcon.classList.replace('fa-play', 'fa-pause');
  }
}

//prev video
function prevVideo() {
  if (videoIndex > 0 && videos.length !== 0) {
    uiVars.video.setAttribute('src', videos[(videoIndex -= 1)].path);

    uiVars.video.play();
    uiVars.playIcon.classList.replace('fa-play', 'fa-pause');
  } else {
    videoIndex = videos.length - 1;

    uiVars.video.setAttribute('src', videos[videoIndex].path);

    uiVars.video.play();
    uiVars.playIcon.classList.replace('fa-play', 'fa-pause');
  }
}

//stop video function
function stopVideo() {
  uiVars.video.pause();
  uiVars.video.currentTime = 0;
  uiVars.playIcon.classList.replace('fa-pause', 'fa-play');
}

//change video
function changeVideo(e) {
  if (e.target.className === 'change') {
    videos.forEach((video, index) => {
      if (e.target.nextElementSibling.textContent === video.name) {
        videoIndex = index;
      }
    });

    const attr = e.target.getAttribute('src');
    uiVars.video.setAttribute('src', attr);

    uiVars.video.play();
    uiVars.playIcon.classList.replace('fa-play', 'fa-pause');
  }
}

//change duration
function changeDuration(e) {
  uiVars.video.currentTime =
    (e.offsetX / this.clientWidth) * uiVars.video.duration;
}

//show volume
function showVolume() {
  uiVars.volumeRange.style.display = 'inline-block';
}

//hide volume
function hideVolume() {
  uiVars.volumeRange.style.display = 'none';
}

//set volume
function setVolume(e) {
  uiVars.volume.style.width = `${e.offsetX}px`;
  uiVars.video.volume = e.offsetX / 100;
}

//check for video end
function checkVideoEnd() {
  if (uiVars.video.currentTime === uiVars.video.duration) {
    uiVars.video.currentTime = 0;
    uiVars.playIcon.classList.replace('fa-pause', 'fa-play');
  }
}

function getElement(id) {
  return document.getElementById(id);
}

events();
