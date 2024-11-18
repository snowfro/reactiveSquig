// Get the hash from the URL if it exists
const urlParams = new URLSearchParams(window.location.search);
const urlHash = urlParams.get('hash');

let tokenData = {
  "tokenId": "9950",
  "hashes": [urlHash || "0x5085269cee073fce254ad8e71fb7d4b0462fb4b1cca67b2314fdd278e80860f0"]
};

// Log the hash being used
console.log("Using hash:", tokenData.hashes[0]);

let numHashes = tokenData.hashes.length;
let hashPairs = [];
for (let i = 0; i < numHashes; i++) {
     for (let j = 0; j < 32; j++) {
          hashPairs.push(tokenData.hashes[i].slice(2 + (j * 2), 4 + (j * 2)));
     }
}
let decPairs = hashPairs.map(x => {
     return parseInt(x, 16);
});

let seed = parseInt(tokenData.hashes[0].slice(0, 16), 16);
let color;
let backgroundIndex = 0;
let backgroundArray = [255, 225, 200, 175, 150, 125, 100, 75, 50, 25, 0, 25, 50, 75, 100, 125, 150, 175, 200, 225];
let index = 0;
let ht;
let wt = 2;
let speed = 1;
let segments;
let amp = 1;
let direction = 1;
let loops = false;
let startColor = decPairs[29];
let reverse = decPairs[30] < 128;
let slinky = decPairs[31] < 35;
let pipe = decPairs[22] < 32;
let bold = decPairs[23] < 15;
let segmented = decPairs[24] < 30;
let fuzzy = pipe && !slinky;
let squigH;
let squigW;

let initialBackgroundIndex = 0;
let initialLoops = false;
let initialSpeed = 1;

function setup() {
  // Parse URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  
  // Check for a 'hash' parameter in the URL
  const urlHash = urlParams.get('hash');
  if (urlHash) {
    // If a hash is provided in the URL, update the tokenData.hashes
    tokenData.hashes = [urlHash];
    console.log("Using hash from URL:", urlHash);
  } else {
    console.log("Using default hash:", tokenData.hashes[0]);
  }

  // Recalculate hashPairs and decPairs based on the potentially new hash
  hashPairs = [];
  for (let i = 0; i < tokenData.hashes.length; i++) {
    for (let j = 0; j < 32; j++) {
      hashPairs.push(tokenData.hashes[i].slice(2 + (j * 2), 4 + (j * 2)));
    }
  }
  decPairs = hashPairs.map(x => parseInt(x, 16));

  // Update seed based on the new hash
  seed = parseInt(tokenData.hashes[0].slice(0, 16), 16);

  // Set initial animation state and background color from URL params
  initialLoops = urlParams.get('animate') === 'true';
  initialSpeed = parseFloat(urlParams.get('speed')) || 1;
  initialBackgroundIndex = parseInt(urlParams.get('bg')) || 0;

  let portrait = windowWidth < windowHeight;
  createCanvas(window.windowWidth,window.windowHeight);
  squigW = windowWidth > windowHeight * 3 / 2 ? windowHeight * 3 / 2 : windowWidth;
  squigH = windowWidth > windowHeight * 3 / 2 ? windowHeight : windowWidth * 2 / 3;
  var el = document.getElementsByTagName("canvas")[0];
  el.addEventListener("touchstart", mouseClicked, false);
  colorMode(HSB, 255);
  segments = map(decPairs[26], 0, 255, 12, 20);
  ht = map(decPairs[27], 0, 255, 3, 4);
  spread = decPairs[28] < 3 ? 0.5 : map(decPairs[28], 0, 255, 5, 50);
  strokeWeight(squigH/1200);

  // Apply initial states from URL params
  backgroundIndex = initialBackgroundIndex;
  loops = initialLoops;
  speed = initialSpeed;
}

function draw() {
     color = 0;
     background(backgroundArray[backgroundIndex]);
     let div = Math.floor(map(Math.round(decPairs[24]), 0, 230, 3, 20));
     let steps = slinky ? 50 : fuzzy ? 1000 : 200;
     translate((width / 2) - (squigW / wt / 2), height / 2);
     for (let j = 0; j < segments - 2; j++) {
          for (let i = 0; i <= steps; i++) {
               let t = i / steps;
               let x = curvePoint(squigW / segments / wt * j, squigW / segments / wt * (j + 1), squigW / segments / wt * (j + 2), squigW / segments / wt * (j + 3), t);
               let y = curvePoint(map(decPairs[j], 0, 255, -squigH / ht, squigH / ht) * amp, map(decPairs[j + 1], 0, 255, -squigH / ht, squigH / ht) * amp, map(decPairs[j + 2], 0, 255, -squigH / ht, squigH / ht) * amp, map(decPairs[j + 3], 0, 255, -squigH / ht, squigH / ht) * amp, t);
               let hue = reverse ? 255 - (((color / spread) + startColor + index) % 255) : (((color / spread) + startColor) + index) % 255;

               if (fuzzy) {
                    noStroke();
                    fill(hue, 255, 255, 20);
                    let fuzzX = x + map(rnd(), 0, 1, 0, squigH / 10);
                    let fuzzY = y + map(rnd(), 0, 1, 0, squigH / 10);
                    if (dist(x, y, fuzzX, fuzzY) < squigH / 11.5) {
                         circle(fuzzX, fuzzY, map(rnd(), 0, 1, squigH / 160, squigH / 16));
                    }
               } else {
                    if (slinky && pipe) {
                         if (i == 0 || i == steps - 1) {
                              fill(0);
                         } else {
                              noFill();
                         }
                         stroke(0);
                         circle(x, y, (squigH / 7))
                    }

                    if (slinky) {
                         if (i == 0 || i == steps - 1) {
                              fill(hue, 255, 255);
                         } else {
                              noFill();
                         }
                         stroke(hue, 255, 255);
                    } else {
                         noStroke();
                         fill(hue, 255, 255);
                    }

                    circle(x, y, bold && !slinky ? squigH / 5 : squigH / 13);

                    if (segmented && !slinky && !bold) {
                         if (i % div === 0 || i == 0 || i == steps - 1) {
                              noStroke();
                              fill(decPairs[25]);
                              circle(x, y, squigH / 12);
                         }
                    }
               }
               color++;
          }
          seed = parseInt(tokenData.hashes[0].slice(0, 16), 16);
     }


     loops === true ? index = index + speed : index = index;
     if (keyIsDown(UP_ARROW)) {
          if (keyIsDown(SHIFT)) {
               if (speed < 20) {
                    speed++;
               } else {
                    speed = 20;
               }
          } else {
               if (speed < 20) {
                    speed = speed + 0.1;
               } else {
                    speed = 20;
               }
          }
     } else if (keyIsDown(DOWN_ARROW)) {
          if (keyIsDown(SHIFT)) {
               if (speed > 1) {
                    speed--;
               } else {
                    speed = 0.1;
               }
          } else {
               if (speed > 0.1) {
                    speed = speed - 0.1;
               } else {
                    speed = 0.1;
               }
          }
     }

}

function keyPressed() {
     if (keyCode === 32) {
          if (backgroundIndex < backgroundArray.length - 1) {
               backgroundIndex++;
          } else {
               backgroundIndex = 0;
          }
     }
}

function mouseClicked() {
     if (loops === false) {
          loops = true;
     } else {
          loops = false;
     }
}

function rnd() {


     seed ^= seed << 13;

     seed ^= seed >> 17;

     seed ^= seed << 5;

     return (((seed < 0) ? ~seed + 1 : seed) % 1000) / 1000;
}
