let scanned = [];
let shooter = [];
let deer = [];

let curShooter = 0;
let curDeer = 0;

function preload() {
  // Load your 3 frames from assets folder
  scanned.push(loadImage("assets/IMG_0006 2.jpg"));
  scanned.push(loadImage("assets/IMG_0007 2.jpg"));
  scanned.push(loadImage("assets/IMG_0008 2.jpg"));
}

function setup() {
  createCanvas(800, 500);

  // Measure actual dimensions of scanned images to crop safely
  let imgW = scanned[0].width;
  let imgH = scanned[0].height;

  // Crop shooter (left side) and deer (right side)
  shooter = crop(scanned, 0, 0, floor(imgW * 0.45), imgH);
  deer = crop(scanned, floor(imgW * 0.55), 0, floor(imgW * 0.45), imgH);

  // Erase white background cleanly from cropped parts
  eraseBg(shooter, 20);
  eraseBg(deer, 20);
}

function draw() {
  background(240);

  // 1. SHOOTER ANIMATION: Follows your mouse pointer
  if (shooter.length > 0 && shooter[curShooter]) {
    image(
      shooter[curShooter],
      mouseX - 100,
      mouseY - 100,
      200,
      200
    );
  }

  // Cycle shooter frames automatically over time
  if (frameCount % 15 === 0) {
    curShooter = (curShooter + 1) % shooter.length;
  }

  // 2. DEER ANIMATION: Sits on the right side of the canvas
  if (deer.length > 0 && deer[curDeer]) {
    image(
      deer[curDeer],
      450,
      100,
      250,
      250
    );
  }

  // PROXIMITY INTERACTION:
  // Measure distance between mouse and deer position (450, 100)
  let d = dist(mouseX, mouseY, 550, 200);

  if (d < 180) {
    // Mouse is CLOSE: Deer animates rapidly using sin() oscillation
    curDeer = floor(map(sin(frameCount / 4), -1, 1, 0, deer.length));
  } else {
    // Mouse is FAR: Deer loops slowly
    if (frameCount % 30 === 0) {
      curDeer = (curDeer + 1) % deer.length;
    }
  }
}

// TEMPLATE HELPER FUNCTIONS
function crop(imgs, x, y, w, h) {
  let cropped = [];
  for (let i = 0; i < imgs.length; i++) {
    cropped.push(imgs[i].get(x, y, w, h));
  }
  return cropped;
}

function eraseBg(imgs, threshold = 20) {
  for (let i = 0; i < imgs.length; i++) {
    let img = imgs[i];
    img.loadPixels();
    if (!img.pixels || img.pixels.length === 0) continue;

    for (let j = 0; j < img.pixels.length; j += 4) {
      let d = 255 - img.pixels[j];
      d += 255 - img.pixels[j + 1];
      d += 255 - img.pixels[j + 2];
      if (d < threshold) {
        img.pixels[j + 3] = 0;
      }
    }
    img.updatePixels();
  }
}