/*
Template for IMA's Creative Coding Lab 

Project A: Generative Creatures
CCLaboratories Biodiversity Atlas 
*/

let exposure = 0;      // number of particle encounters (permanent)
let particles = [];

// current values (these ease toward their targets, so changes are gradual)
let pinkAmt = 0;       // 0 = white, 1 = fully pink
let sizeScale = 1;     // body size multiplier
let spikeScale = 1;    // spike length multiplier
let speedScale = 1;    // animation speed multiplier
let animTime = 0;      // our own clock, so speed can change

function setup() {
  createCanvas(800, 500);
  for (let i = 0; i < 8; i++) {
    particles.push(makeParticle(random(-width, 0)));
  }
}

function draw() {
  background(220);

  updateTargets();
  animTime += speedScale;

  drawCreature(width / 2, height / 2);

  updateParticles();
  drawParticles();
  drawCounter();
}


function updateTargets() {
  // 3-4 points: turns pink
  let pinkTarget = constrain(map(exposure, 2, 4, 0, 1), 0, 1);
  // 5-7 points: gets larger
  let sizeTarget = constrain(map(exposure, 4, 7, 1, 1.4), 1, 1.4);
  // 8-9 points: spikes grow longer
  let spikeTarget = constrain(map(exposure, 7, 9, 1, 2), 1, 2);
  // 10+ points: moves faster (final form)
  let speedTarget = exposure >= 10 ? 1.8 : 1;

  pinkAmt = lerp(pinkAmt, pinkTarget, 0.03);
  sizeScale = lerp(sizeScale, sizeTarget, 0.03);
  spikeScale = lerp(spikeScale, spikeTarget, 0.03);
  speedScale = lerp(speedScale, speedTarget, 0.03);
}

// ---------- PARTICLES ----------
function makeParticle(x) {
  return {
    x: x,
    y: random(120, 380),
    speed: random(1, 3),
    phase: random(TWO_PI),
    d: 24,
    hit: false // so one pass only counts once
  };
}

function updateParticles() {
  let creatureRadius = 100 * 0.7 * sizeScale;

  for (let p of particles) {
    p.x += p.speed;
    p.d = 24 + sin(frameCount * 0.08 + p.phase) * 10;

    // touching the creature = 1 exposure point
    let touching = dist(p.x, p.y, width / 2, height / 2) < creatureRadius + p.d / 2;
    if (touching && !p.hit) {
      exposure++;
      p.hit = true;
    }

    // wrap around, ready to be an encounter again
    if (p.x > width + 30) {
      p.x = -30;
      p.y = random(120, 380);
      p.hit = false;
    }
  }
}

function drawParticles() {
  noStroke();
  fill(255, 90, 120);
  for (let p of particles) {
    circle(p.x, p.y, p.d);
  }
}

function drawCounter() {
  noStroke();
  fill(60);
  textSize(16);
  text("Exposure: " + exposure, 20, 30);
}

// ---------- CREATURE ----------
function drawCreature(x, y) {
  push();

  let bounce = sin(animTime * 0.08) * 8;
  translate(x, y + bounce);
  scale(0.7 * sizeScale); // base size, grows with exposure

  stroke(60);
  strokeWeight(2);

  // spikes (length multiplied by spikeScale)
  drawSpike(0, -95, 60 * spikeScale, 0);
  drawSpike(-40, -85, 50 * spikeScale, -0.4);
  drawSpike(40, -85, 50 * spikeScale, 0.4);

  let legSwing = sin(animTime * 0.08) * 0.25;
  drawLeg(-40, 80, 120, legSwing);
  drawLeg(40, 80, 120, -legSwing);

  let armSwing = sin(animTime * 0.05) * 0.3;
  drawArm(95, -10, 230, -0.1 + armSwing, 1);
  drawArm(-95, -10, 230, -0.1 + armSwing, -1);

  drawBody(0, 0, 200);
  drawEye(-48, -30, 70, 80, -0.1);
  drawEye(48, -30, 70, 80, 0.1);
  drawMouth(0, 45, 90, 22);

  pop();
}

function drawBody(x, y, size) {
  push();
  translate(x, y);
  let pulse = 1 + sin(animTime * 0.1) * 0.04;
  scale(pulse);

  // lerpColor blends white toward pink by pinkAmt
  fill(lerpColor(color(245), color(255, 150, 180), pinkAmt));
  circle(0, 0, size);

  strokeWeight(1);
  for (let a = 0; a < TWO_PI; a += 0.15) {
    push();
    rotate(a);
    line(size / 2 - 4, 0, size / 2 + 4, 0);
    pop();
  }
  pop();
}

function drawEye(x, y, w, h, tilt) {
  push();
  translate(x, y);
  rotate(tilt);
  rectMode(CENTER);

  // blink: skip drawing the eye for a few frames
  if (animTime % 150 >= 6) {
    fill(255);
    rect(0, 0, w, h, 25);

    // pupil drifts around inside the eye
    let px = sin(animTime * 0.03) * w * 0.25;
    let py = cos(animTime * 0.05) * h * 0.2;
    fill(0);
    circle(px, py, 8);
  }
  pop();
}

function drawMouth(x, y, w, h) {
  push();
  translate(x, y);
  let open = h + sin(animTime * 0.1) * 6;

  rectMode(CENTER);
  fill(255);
  rect(0, 0, w, open);

  noFill();
  beginShape();
  let teeth = 6;
  for (let i = 0; i <= teeth; i++) {
    let tx = -w / 2 + (w / teeth) * i;
    let ty = (i % 2 === 0) ? -open / 2 : 0;
    vertex(tx, ty);
  }
  endShape();
  pop();
}

function drawArm(x, y, len, angle, dir) {
  push();
  translate(x, y);
  scale(dir, 1); // flip for the left arm
  rotate(angle);

  noFill();
  beginShape();
  for (let i = 0; i <= len; i += 5) {
    let wave = sin(i * 0.03 - animTime * 0.1) * 15 * (i / len);
    vertex(i, wave);
  }
  endShape();

  let tipY = sin(len * 0.03 - animTime * 0.1) * 15;
  translate(len, tipY);
  fill(255);
  triangle(0, -8, 0, 8, 16, 0);
  pop();
}

function drawLeg(x, y, len, angle) {
  push();
  translate(x, y);
  rotate(angle);
  line(0, 0, 0, len);
  fill(255);
  triangle(-8, len, 8, len, 0, len + 22);
  pop();
}

function drawSpike(x, y, len, angle) {
  push();
  translate(x, y);
  rotate(angle + sin(animTime * 0.15 + x) * 0.15);
  stroke(100);
  strokeWeight(2);
  line(0, 0, 0, -len);
  pop();
}