
let dancer;

function setup() {
  // no adjustments in the setup function needed...
  createCanvas(windowWidth, windowHeight);

  // ...except to adjust the dancer's name on the next line:
  dancer = new Morphine(width / 2, height / 2);
}

function draw() {
  // you don't need to make any adjustments inside the draw loop
  background(0);
  drawFloor(); // for reference only

  dancer.update();
  dancer.display();
}

// You only code inside this class.
// Start by giving the dancer your name, e.g. LeonDancer.
class Morphine {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.time = 0;
    this.angle = 0;
    // add properties for your dancer here:
    
    //..
    //..
  }
  update() {
    // update properties here to achieve
    this.time += 1;
    this.angle = sin(this.time * 0.05) * PI / 4;

    // your dancer's desired moves and behaviour
  }
  display() {
    // the push and pop, along with the translate 
    // places your whole dancer object at this.x and this.y.
    // you may change its position on line 19 to see the effect.
    push();
    translate(this.x, this.y);
  // Dance move: spin around
    rotate(this.angle);

    stroke(220);
    strokeWeight(2);

    // Body
    fill(90, 180, 170);
    circle(0, 0, 100);

    // Three spikes
    line(0, -48, 0, -86);
    line(-25, -40, -40, -70);
    line(25, -40, 40, -70);

    // Eyes
    stroke(40);
    fill(255);
    ellipse(-22, -12, 22, 30);
    ellipse(22, -12, 22, 30);

    // Pupils
    fill(0);
    circle(-22, -12, 7);
    circle(22, -12, 7);

    // Mouth
    noFill();
    arc(0, 17, 25, 15, 0, PI);
    stroke(220);
    // Legs

    strokeWeight(3);
    line(-25, 45, -30, 75);
    line(25, 45, 30, 75);
    // Legs
    line(-25, 45, -30, 75);
    line(25, 45, 30, 75);

// Triangle feet
    fill(255);
    triangle(-42, 75, -18, 75, -30, 95);
    triangle(18, 75, 42, 75, 30, 95);
// Arms
    stroke(220);
    strokeWeight(3);
    noFill();

// Left arm
    line(-45, -10, -85, 15);
    triangle(-85, 15, -95, 10, -90, 25);

// Right arm
    line(45, -10, 85, 15);
    triangle(85, 15, 95, 10, 90, 25);
    pop();
  }

}
