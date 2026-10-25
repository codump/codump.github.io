---
published: true
title: "Catchy snow text and elements, pun intended!"
description: |
  For catch-snow projects, I use a hidden canvas mask to dynamically track text contours for accurate animation alignment. Combined with responsive scaling and interactive physics, this lightweight technique turns typography into physical barriers on scroll or click, delivering premium holiday animations without the bloat of heavy graphic libraries.

  Here is the HTML, the two numbers behind `snow-offset-` will set the offset so you can fine tune per element. The first number is the offset for mobile and the second is for desktop.
home_preview:  |
  For catch-snow projects, I use a hidden canvas mask to dynamically track text contours for accurate animation alignment. Combined with responsive scaling and interactive physics, this lightweight technique turns typography into physical barriers on scroll or click, delivering premium holiday animations without the bloat of heavy graphic libraries.
  <br/>
  <button class="blueButton">Demo</button> <button class="greenButton">See code</button>
author: kip
github_star: codump/catchy-snow-text-and-elements
github_gist:
date: 26-10-25 11:15:00 +0200
categories: [Coding, Script]
tags: [JavaScript, Front-end, X-mas]
image:
  path: /assets/img/snow.gif
  lqip: "data:image/webp;base64,UklGRk..."

pin: false
full_text: false
---
For catch-snow projects, I use a hidden canvas mask to dynamically track text contours for accurate animation alignment. Combined with responsive scaling and interactive physics, this lightweight technique turns typography into physical barriers on scroll or click, delivering premium holiday animations without the bloat of heavy graphic libraries.

<button class="blueButton" onclick="window.open('https://codump.github.io/demo/catchy-snow-text-and-elements/')">Demo</button> <button class="greenButton" onclick="window.open('https://github.com/codump/catchy-snow-text-and-elements/')">See code</button><br/><br/>

Here is the HTML, the two numbers behind `snow-offset-` will set the offset so you can fine tune per element. The first number is the offset for mobile and the second is for desktop.

```html
<button type="submit" class="catch-snow-btn">THIS IS A BUTTON</button>
<footer class="catch-snow-element">THIS IS AN ELEMENT</footer>
<!-- 6 = Offset for mobile & 16 = Offset for desktop. You can change this per element. -->
<h1 class="catch-snow-text snow-offset-6_16">THIS IS TEXT</h1>
```
And then the script itself.
```js
window.addEventListener('DOMContentLoaded', () => {
  const maxFlakes = 120;
  const canvas = document.getElementById('snow-canvas');
  const ctx = canvas.getContext('2d');
  const maskCanvas = document.createElement('canvas');
  const mctx = maskCanvas.getContext('2d', { willReadFrequently: true });
  let maskData = null;

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    maskCanvas.width = window.innerWidth;
    maskCanvas.height = window.innerHeight;
    ctx.scale(dpr, dpr);
    generateCollisionMask();
  }

  let flakes = [];
  let settledSnow = [];

  function generateCollisionMask() {
    mctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    const textElements = document.querySelectorAll('.catch-snow-text');
    textElements.forEach((el) => {
      if (!el.firstChild) return;
      const style = window.getComputedStyle(el);
      mctx.save();
      mctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      mctx.textAlign = 'left';
      mctx.textBaseline = 'top';
      if ('letterSpacing' in mctx || 'letterSpacing' in CanvasRenderingContext2D.prototype) {
        mctx.letterSpacing = style.letterSpacing;
      }
      mctx.fillStyle = '#ff0000';
      let mobileOffset = 8;
      let desktopOffset = 17;
      el.classList.forEach((className) => {
        if (className.startsWith('snow-offset-')) {
          const parts = className.replace('snow-offset-', '').split('_');
          if (parts.length === 2) {
            mobileOffset = parseFloat(parts[0]);
            desktopOffset = parseFloat(parts[1]);
          }
        }
      });
      const isMobile = window.innerWidth <= 768;
      const yOffset = isMobile ? mobileOffset : desktopOffset;
      const range = document.createRange();
      const nodeIterator = document.createNodeIterator(el, NodeFilter.SHOW_TEXT);
      let textNode;
      while ((textNode = nodeIterator.nextNode())) {
        const textContent = textNode.nodeValue;
        const words = textContent.split(/(\s+)/);
        let currentCharIndex = 0;
        words.forEach((word) => {
          if (word.trim().length > 0) {
            range.setStart(textNode, currentCharIndex);
            range.setEnd(textNode, currentCharIndex + word.length);
            const rects = range.getClientRects();
            if (rects.length > 0) {
              for (let i = 0; i < rects.length; i++) {
                const rect = rects[i];
                let renderText = word;
                if (style.textTransform === 'uppercase') renderText = renderText.toUpperCase();
                if (style.textTransform === 'lowercase') renderText = renderText.toLowerCase();
                mctx.fillText(renderText, rect.left, rect.top + yOffset);
              }
            }
          }
          currentCharIndex += word.length;
        });
      }
      mctx.restore();
    });
    maskData = mctx.getImageData(0, 0, maskCanvas.width, maskCanvas.height).data;
  }

  function checkMaskCollision(x, y) {
    if (!maskData) return false;
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    if (ix < 0 || ix >= maskCanvas.width || iy < 0 || iy >= maskCanvas.height) return false;
    const index = (iy * maskCanvas.width + ix) * 4;
    return maskData[index] > 200;
  }

  function createFlake(x, y) {
    return {
      x: x !== undefined ? x : Math.random() * window.innerWidth,
      y: y !== undefined ? y : -10,
      r: Math.random() * 2 + 1,
      vy: Math.random() * 1.2 + 0.6,
      vx: Math.random() * 0.4 - 0.2,
    };
  }
  for (let i = 0; i < maxFlakes; i++) {
    flakes.push(createFlake(Math.random() * window.innerWidth, Math.random() * window.innerHeight));
  }

  function releaseAllSettledSnow() {
    if (settledSnow.length > 0) {
      const targets = Array.from(
        document.querySelectorAll('.catch-snow-btn, .catch-snow-button, .catch-snow-element'),
      ).map((el) => el.getBoundingClientRect());
      settledSnow.forEach((s) => {
        if (s.y < window.innerHeight) {
          let startY = s.y;
          for (let t of targets) {
            if (s.x >= t.left && s.x <= t.right && s.y >= t.top - 5 && s.y <= t.top + 5) {
              startY = t.top + 3;
              break;
            }
          }
          flakes.push({
            x: s.x,
            y: startY,
            r: s.r,
            vy: Math.random() * 0.8 + 1.0,
            vx: Math.random() * 0.8 - 0.4,
            isReleased: true,
          });
        }
      });
      settledSnow = [];
    }
    generateCollisionMask();
  }
  window.addEventListener('scroll', releaseAllSettledSnow);

  function bindButtonClicks() {
    const buttons = document.querySelectorAll(
      '.catch-snow-btn, .catch-snow-button, .catch-snow-element',
    );
    buttons.forEach((btn) => {
      if (!btn.classList.contains('snow-bound')) {
        btn.classList.add('snow-bound');
        btn.addEventListener('click', () => {
          releaseAllSettledSnow();
        });
      }
    });
  }
  bindButtonClicks();
  setInterval(bindButtonClicks, 300);

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    settledSnow.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
      ctx.fill();
    });
    const targets = Array.from(
      document.querySelectorAll('.catch-snow-btn, .catch-snow-button, .catch-snow-element'),
    ).map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
      };
    });
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.beginPath();
    for (let i = flakes.length - 1; i >= 0; i--) {
      let f = flakes[i];
      ctx.moveTo(f.x, f.y);
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
      f.y += f.vy;
      f.x += f.vx;
      let landed = false;
      for (let t of targets) {
        if (f.x > t.left && f.x < t.right && f.y >= t.top - 2 && f.y <= t.top + f.vy + 1) {
          settledSnow.push({ x: f.x, y: t.top - 1, r: f.r });
          landed = true;
          break;
        }
      }
      if (!landed) {
        let isCollidingNow = checkMaskCollision(f.x, f.y);
        let wasCollidingBefore = checkMaskCollision(f.x, f.y - f.vy);
        if (isCollidingNow && !wasCollidingBefore) {
          settledSnow.push({ x: f.x, y: f.y - 1, r: f.r });
          landed = true;
        }
      }
      if (landed) {
        flakes.splice(i, 1);
        if (flakes.length < maxFlakes) {
          flakes.push(createFlake());
        }
      } else if (f.y > window.innerHeight) {
        if (f.isReleased) {
          flakes.splice(i, 1);
        } else {
          flakes[i] = createFlake();
        }
      }
    }
    ctx.fill();
    if (settledSnow.length > 3000) {
      settledSnow.shift();
    }
    requestAnimationFrame(draw);
  }

  setTimeout(generateCollisionMask, 400);
  draw();
});

```
{: file="snow.js" }
