
// 3D Text to Sign Language Animation
// const ANIMATION_DELAY = 1200; // ms per letter
let handScene, handRenderer, handCamera, handModel, animationFrameId;


// 2D Text to Sign Language Animation (with .png/.jpeg/.jpg support)
const ANIMATION_DELAY = 900; // ms per letter
function startSignAnimation() {
  const input = document.getElementById('text-input').value;
  const animationDiv = document.getElementById('sign-animation') || document.getElementById('sign-3d-animation');
  animationDiv.innerHTML = '';
  let i = 0;
  function showNext() {
    if (i >= input.length) return;
    const char = input[i].toLowerCase();
    animationDiv.innerHTML = '';
    if ((char >= 'a' && char <= 'z') || (char >= '0' && char <= '9')) {
      const tryExtensions = ['.png', '.jpeg', '.jpg'];
      let found = false;
      for (let ext of tryExtensions) {
        let img = document.createElement('img');
        img.src = 'asl_images/' + char + ext;
        img.alt = char;
        img.onerror = function() {
          if (!found && ext === tryExtensions[tryExtensions.length-1]) {
            animationDiv.innerText = '[No image for ' + char + ']';
          }
        };
        img.onload = function() {
          if (!found) {
            found = true;
            animationDiv.innerHTML = '';
            animationDiv.appendChild(img);
          }
        };
        animationDiv.appendChild(img);
      }
    } else if (char === ' ') {
      animationDiv.innerHTML = '<span style="font-size:2em">&nbsp;</span>';
    } else {
      animationDiv.innerText = char;
    }
    i++;
    if (i < input.length) setTimeout(showNext, ANIMATION_DELAY);
  }
  if (input.length > 0) showNext();
}

function animateLetters(text, idx) {
  if (!handModel) return;
  if (idx >= text.length) return;
  const char = text[idx];
  // For demo: random pose per letter (replace with real poses for each letter)
  poseHandForLetter(char);
  renderHandScene();
  setTimeout(() => animateLetters(text, idx+1), ANIMATION_DELAY);
}

function poseHandForLetter(char) {
  // Placeholder: random rotation for each letter (replace with real finger poses)
  if (!handModel) return;
  const r = (char.charCodeAt(0) % 26) * (Math.PI/13);
  handModel.rotation.set(r, r/2, -r/3);
}

function renderHandScene() {
  if (handRenderer && handScene && handCamera) {
    handRenderer.render(handScene, handCamera);
    animationFrameId = requestAnimationFrame(renderHandScene);
  }
}
