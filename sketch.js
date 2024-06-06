let mic, fft;
let particleData = [];

function setup() {
  createCanvas(windowWidth, 300);
  background(0);

  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
}

function draw() {
  // Create a gradient background
  let bgCol1 = color(0, 0, 0);
  let bgCol2 = color(0, 0, 56);
  background(lerpColor(bgCol1, bgCol2, frameCount / 200));

  translate(width / 2, height / 2);

  let spectrum = fft.analyze();
  particleData.length = spectrum.length;

  for (let i = 0; i < spectrum.length; i++) {
    let freq = spectrum[i];
    let angle = i * i * i + freq / 200 * cos(i) + frameCount * sin(i) / 700;
    let radius = map(freq, 0, 255, 20, 100); // Larger circles

    if (particleData[i]) {
      particleData[i].x = radius * cos(angle);
      particleData[i].y = radius * sin(angle);
    } else {
      particleData[i] = {
        x: radius * cos(angle),
        y: radius * sin(angle),
        freq: freq,
        color: color(255)
      };
    }

    noStroke();
    fill(particleData[i].color);
    ellipse(particleData[i].x, particleData[i].y, 8, 8); // Larger circles
  }
  for (let i = 0; i < particleData.length - 1; i++) {
    let particle1 = particleData[i];
    let particle2 = particleData[i + 1];
    let distance = dist(particle1.x, particle1.y, particle2.x, particle2.y);
    if (distance < 100 && particle1.freq > 30 && particle2.freq > 30) {
      stroke(0, 0, 56 + cos(frameCount / 99) * 80, 50);
      strokeWeight(1);
      line(particle1.x, particle1.y, particle2.x, particle2.y);
    }
  }
}

