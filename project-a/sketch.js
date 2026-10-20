/*
Template for IMA's Creative Coding Lab 

Project A: Generative Creatures
CCLaboratories Biodiversity Atlas 
*/

let exposure = 0;    
let particles = [];

// current values
let bodyCol, targetCol; 
let sizeScale = 1;    
let spikeScale = 1;    
let speedScale = 1;    
let animTime = 0;      

// creature position
let cx, cy;
let started = false;   

// background grid
let gridJitter = [];
const GRID_X = 15;
const GRID_Y = 25;

const BASE_SCALE = 0.4;

function setup() {
  createCanvas(800, 500);
  cx = width / 2;
  cy = height / 2;
  bodyCol = color(245);
  targetCol = color(245);

  for (let i = 0; i < 10; i++) {
    particles.push(makeParticle(random(-width, 0)));
  }
  refreshGrid();
}

function draw() {
  background(15, 15, 25);

  drawGrid();

  updateTargets();
  animTime += speedScale;

  followMouse();
  drawCreature(cx, cy);

  updateParticles();
  drawParticles();
  drawUI();
}

function mouseMoved() {
  started = true;
}

// grid
function refreshGrid() {
  gridJitter = [];
  for (let x = 0; x < width; x += GRID_X) {
    for (let y = 0; y < height; y += GRID_Y) {
      gridJitter.push(random(-4, 4));
    }
  }
}

function drawGrid() {
  if (frameCount % 6 === 0) refreshGrid();

  noStroke();
  fill(90);
  let i = 0;
  for (let x = 0; x < width; x += GRID_X) {
    for (let y = 0; y < height; y += GRID_Y) {
      circle(x, y + gridJitter[i], 3);
      i++;
    }
  }
}

// mouse interaction
function followMouse() {
  let targetX = started ? mouseX : width / 2;
  let targetY = started ? mouseY : height / 2;

  cx = lerp(cx, targetX, 0.05);
  cy = lerp(cy, targetY, 0.05);
}

// rules
function updateTargets() {
  bodyCol = lerpColor(bodyCol, targetCol, 0.05);
  let sizeTarget = constrain(map(exposure, 4, 7, 1, 1.4), 1, 1.4);
  let spikeTarget = constrain(map(exposure, 7, 9, 1, 2), 1, 2);
  let speedTarget = exposure >= 10 ? 1.8 : 1;

  sizeScale = lerp(sizeScale, sizeTarget, 0.03);
  spikeScale = lerp(spikeScale, spikeTarget, 0.03);
  speedScale = lerp(speedScale, speedTarget, 0.03);
}

// particles
function makeParticle(x) {
  return {
    x: x,
    y: random(30, height - 30),
    speed: random(1, 3),
    phase: random(TWO_PI),
    d: 24,
    hit: false
  };
}

function updateParticles() {
  let creatureRadius = 100 * BASE_SCALE * sizeScale;

  for (let p of particles) {
    p.x += p.speed;
    p.d = 24 + sin(frameCount * 0.08 + p.phase) * 10;

    let touching = dist(p.x, p.y, cx, cy) < creatureRadius + p.d / 2 + 8;
    if (touching) {
      exposure++;
      targetCol = color(random(100, 255), random(100, 255), random(100, 255));
    
      p.x = random(-300, -30);
      p.y = random(30, height - 30);
    }

    if (p.x > width + 30) {
      p.x = -30;
      p.y = random(30, height - 30);
    }
  }
}

function drawParticles() {
  for (let p of particles) {
    drawBacterium(p.x, p.y, p.d, p.phase);
  }
}

function drawBacterium(x, y, d, phase) {
  push();
  translate(x, y);
  rotate(frameCount * 0.02 + phase);

  stroke(255, 90, 120);
  strokeWeight(2);
  let spikes = 8;
  for (let i = 0; i < spikes; i++) {
    let a = (TWO_PI / spikes) * i;
    line(cos(a) * d / 2, sin(a) * d / 2, cos(a) * (d / 2 + 8), sin(a) * (d / 2 + 8));
  }

  noStroke();
  fill(255, 90, 120);
  circle(0, 0, d);
  pop();
}

function drawUI() {
  noStroke();
  textSize(12);
  fill(150);
  text("Move your mouse to guide the creature", 20, height - 20);
}

// creature
function drawCreature(x, y) {
  push();

  let bounce = sin(animTime * 0.08) * 8 * BASE_SCALE * 2;
  translate(x, y + bounce);

  let lean = constrain((targetXForLean() - x) * 0.002, -0.3, 0.3);
  rotate(lean);

  scale(BASE_SCALE * sizeScale);

  stroke(220);
  strokeWeight(2);

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

function targetXForLean() {
  return started ? mouseX : width / 2;
}

function drawBody(x, y, size) {
  push();
  translate(x, y);
  let pulse = 1 + sin(animTime * 0.1) * 0.04;
  scale(pulse);

  fill(bodyCol);
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
  stroke(40);

  if (animTime % 150 >= 6) {
    fill(255);
    rect(0, 0, w, h, 25);

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
  stroke(40);

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
  scale(dir, 1);
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
  stroke(180);
  strokeWeight(2);
  line(0, 0, 0, -len);
  pop();
}