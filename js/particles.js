/* ============================================
   DISCOLAND — Disco Particles Animation
   Canvas-based golden particle system
   ============================================ */

class DiscoParticles {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.lightRays = [];
    this.shootingStars = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.animationId = null;
    this.isVisible = true;
    this.lastShootingStarTime = 0;

    this.config = {
      particleCount: 130,
      lightRayCount: 8,
      colors: [
        'rgba(255, 215, 0, ',    // Gold
        'rgba(255, 191, 0, ',    // Amber
        'rgba(255, 228, 77, ',   // Light gold
        'rgba(224, 224, 224, ',  // Chrome/Silver
        'rgba(255, 255, 255, ',  // White sparkle
      ],
      maxSize: 4,
      minSize: 0.5,
      speed: 0.5,
    };

    this.init();
    this.bindEvents();
    this.animate();
  }

  init() {
    this.resize();
    this.createParticles();
    this.createLightRays();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    const observer = new IntersectionObserver((entries) => {
      this.isVisible = entries[0].isIntersecting;
    });
    observer.observe(this.canvas);
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    const colorIndex = Math.floor(Math.random() * this.config.colors.length);
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: Math.random() * (this.config.maxSize - this.config.minSize) + this.config.minSize,
      speedX: (Math.random() - 0.5) * this.config.speed,
      speedY: (Math.random() - 0.5) * this.config.speed,
      color: this.config.colors[colorIndex],
      opacity: Math.random() * 0.6 + 0.1,
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.03 + 0.01,
    };
  }

  createLightRays() {
    this.lightRays = [];
    for (let i = 0; i < this.config.lightRayCount; i++) {
      const angle = (Math.PI * 2 / this.config.lightRayCount) * i;
      this.lightRays.push({
        angle: angle,
        length: this.canvas.height * 0.85,
        width: 2,
        opacity: 0.04,
        rotationSpeed: 0.001 + Math.random() * 0.0015,
      });
    }
  }

  spawnShootingStar() {
    const startX = Math.random() * this.canvas.width * 0.8;
    const startY = Math.random() * this.canvas.height * 0.4;
    const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2; // ~45 degrees
    const length = 180 + Math.random() * 140;
    const speed = 12 + Math.random() * 8;

    this.shootingStars.push({
      x: startX,
      y: startY,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      length: length,
      speed: speed,
      life: 0,
      maxLife: 40 + Math.random() * 25,
      thickness: 2.5 + Math.random() * 1.5,
      color: Math.random() > 0.4 ? '#FFD700' : '#FFFFFF'
    });
  }

  updateShootingStars() {
    const now = Date.now();
    // Spawn a shooting star every 2.5 - 4.5 seconds
    if (now - this.lastShootingStarTime > 2500 + Math.random() * 2000) {
      this.spawnShootingStar();
      this.lastShootingStarTime = now;
    }

    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const star = this.shootingStars[i];
      star.x += star.dx;
      star.y += star.dy;
      star.life++;

      if (star.life >= star.maxLife) {
        this.shootingStars.splice(i, 1);
      }
    }
  }

  drawShootingStars() {
    this.shootingStars.forEach(star => {
      const progress = star.life / star.maxLife;
      const opacity = progress < 0.2 ? progress / 0.2 : (1 - progress);

      const tailX = star.x - star.dx * (star.length / star.speed);
      const tailY = star.y - star.dy * (star.length / star.speed);

      const gradient = this.ctx.createLinearGradient(star.x, star.y, tailX, tailY);
      gradient.addColorStop(0, star.color === '#FFD700' ? `rgba(255, 228, 77, ${opacity})` : `rgba(255, 255, 255, ${opacity})`);
      gradient.addColorStop(0.3, `rgba(255, 215, 0, ${opacity * 0.6})`);
      gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(star.x, star.y);
      this.ctx.lineTo(tailX, tailY);
      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = star.thickness;
      this.ctx.lineCap = 'round';
      this.ctx.stroke();

      // Glowing head
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.thickness * 1.8, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.9})`;
      this.ctx.shadowColor = '#FFD700';
      this.ctx.shadowBlur = 15;
      this.ctx.fill();
      this.ctx.restore();
    });
  }

  updateParticle(p) {
    p.x += p.speedX;
    p.y += p.speedY;

    const dx = this.mouseX - p.x;
    const dy = this.mouseY - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 200) {
      const force = (200 - dist) / 200 * 0.02;
      p.speedX += dx * force * 0.01;
      p.speedY += dy * force * 0.01;
    }

    p.speedX *= 0.999;
    p.speedY *= 0.999;

    p.pulsePhase += p.pulseSpeed;
    const pulseFactor = (Math.sin(p.pulsePhase) + 1) / 2;
    p.currentOpacity = p.opacity * (0.3 + 0.7 * pulseFactor);

    if (p.x < -10) p.x = this.canvas.width + 10;
    if (p.x > this.canvas.width + 10) p.x = -10;
    if (p.y < -10) p.y = this.canvas.height + 10;
    if (p.y > this.canvas.height + 10) p.y = -10;
  }

  drawParticle(p) {
    const opacity = p.currentOpacity || p.opacity;

    this.ctx.beginPath();
    const gradient = this.ctx.createRadialGradient(
      p.x, p.y, 0,
      p.x, p.y, p.size * 4
    );
    gradient.addColorStop(0, p.color + opacity + ')');
    gradient.addColorStop(0.5, p.color + (opacity * 0.3) + ')');
    gradient.addColorStop(1, p.color + '0)');
    this.ctx.fillStyle = gradient;
    this.ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.fillStyle = p.color + Math.min(opacity * 1.5, 1) + ')';
    this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawLightRays() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    this.lightRays.forEach(ray => {
      ray.angle += ray.rotationSpeed;

      this.ctx.save();
      this.ctx.translate(centerX, centerY);
      this.ctx.rotate(ray.angle);

      const gradient = this.ctx.createLinearGradient(0, 0, 0, ray.length);
      gradient.addColorStop(0, `rgba(255, 215, 0, ${ray.opacity})`);
      gradient.addColorStop(0.5, `rgba(255, 215, 0, ${ray.opacity * 0.5})`);
      gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');

      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(-ray.width / 2, 0, ray.width, ray.length);

      this.ctx.restore();
    });
  }

  drawConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          const opacity = (1 - dist / 100) * 0.05;
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(255, 215, 0, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }
  }

  animate() {
    if (!this.isVisible) {
      this.animationId = requestAnimationFrame(() => this.animate());
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawLightRays();
    this.drawConnections();

    this.particles.forEach(p => {
      this.updateParticle(p);
      this.drawParticle(p);
    });

    this.updateShootingStars();
    this.drawShootingStars();

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

/* ============================================
   3D Mirrored Disco Ball Canvas Renderer
   ============================================ */
class DiscoBall3D {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.rotation = 0;
    this.tilt = 0.25; // Slight downward angle
    this.radius = 125;
    this.rows = 18;
    this.cols = 36;
    this.lightSource = { x: 0.5, y: -0.6, z: 0.8 }; // Light from top right front
    this.animationId = null;
    this.isVisible = true;

    // Normalize light vector
    const len = Math.sqrt(
      this.lightSource.x ** 2 +
      this.lightSource.y ** 2 +
      this.lightSource.z ** 2
    );
    this.lightSource.x /= len;
    this.lightSource.y /= len;
    this.lightSource.z /= len;

    this.init();
    this.animate();
  }

  init() {
    this.canvas.width = 360;
    this.canvas.height = 360;

    const observer = new IntersectionObserver((entries) => {
      this.isVisible = entries[0].isIntersecting;
    });
    observer.observe(this.canvas);
  }

  project(x, y, z) {
    // Rotate around X axis for tilt
    const cosT = Math.cos(this.tilt);
    const sinT = Math.sin(this.tilt);

    const y1 = y * cosT - z * sinT;
    const z1 = y * sinT + z * cosT;

    // Center on canvas
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    return {
      px: centerX + x,
      py: centerY + y1,
      pz: z1,
      nx: x / this.radius,
      ny: y1 / this.radius,
      nz: z1 / this.radius
    };
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;

    // Background Outer Glow
    const outerGlow = this.ctx.createRadialGradient(cx, cy, this.radius * 0.8, cx, cy, this.radius * 1.4);
    outerGlow.addColorStop(0, 'rgba(255, 215, 0, 0.2)');
    outerGlow.addColorStop(0.5, 'rgba(255, 215, 0, 0.08)');
    outerGlow.addColorStop(1, 'rgba(255, 215, 0, 0)');
    this.ctx.fillStyle = outerGlow;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, this.radius * 1.4, 0, Math.PI * 2);
    this.ctx.fill();

    // Dark core shadow behind ball
    this.ctx.beginPath();
    this.ctx.arc(cx, cy + 5, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    this.ctx.fill();

    const facets = [];

    // Generate grid tiles
    for (let r = 0; r < this.rows; r++) {
      const phi1 = -Math.PI / 2 + (Math.PI * r) / this.rows;
      const phi2 = -Math.PI / 2 + (Math.PI * (r + 1)) / this.rows;

      const y1 = this.radius * Math.sin(phi1);
      const y2 = this.radius * Math.sin(phi2);

      const r1 = this.radius * Math.cos(phi1);
      const r2 = this.radius * Math.cos(phi2);

      for (let c = 0; c < this.cols; c++) {
        const theta1 = (Math.PI * 2 * c) / this.cols + this.rotation;
        const theta2 = (Math.PI * 2 * (c + 1)) / this.cols + this.rotation;

        // 4 corners of tile
        const p1 = this.project(r1 * Math.sin(theta1), y1, r1 * Math.cos(theta1));
        const p2 = this.project(r1 * Math.sin(theta2), y1, r1 * Math.cos(theta2));
        const p3 = this.project(r2 * Math.sin(theta2), y2, r2 * Math.cos(theta2));
        const p4 = this.project(r2 * Math.sin(theta1), y2, r2 * Math.cos(theta1));

        // Average Z depth (only draw front-facing tiles)
        const avgZ = (p1.pz + p2.pz + p3.pz + p4.pz) / 4;

        if (avgZ > -10) {
          // Average normal vector
          const avgNx = (p1.nx + p2.nx + p3.nx + p4.nx) / 4;
          const avgNy = (p1.ny + p2.ny + p3.ny + p4.ny) / 4;
          const avgNz = (p1.nz + p2.nz + p3.nz + p4.nz) / 4;

          // Specular reflection (dot product with light source)
          const dot = Math.max(0, avgNx * this.lightSource.x + avgNy * this.lightSource.y + avgNz * this.lightSource.z);
          const specular = Math.pow(dot, 12); // Sharp mirror highlight
          const diffuse = Math.max(0.15, dot);

          facets.push({
            p1, p2, p3, p4,
            avgZ,
            diffuse,
            specular
          });
        }
      }
    }

    // Sort front to back
    facets.sort((a, b) => a.avgZ - b.avgZ);

    // Render tiles
    facets.forEach(f => {
      this.ctx.beginPath();
      this.ctx.moveTo(f.p1.px, f.p1.py);
      this.ctx.lineTo(f.p2.px, f.p2.py);
      this.ctx.lineTo(f.p3.px, f.p3.py);
      this.ctx.lineTo(f.p4.px, f.p4.py);
      this.ctx.closePath();

      // Mirror base color (silver/gold depending on light)
      const baseGray = Math.floor(60 + f.diffuse * 140);
      const goldR = Math.floor(Math.min(255, baseGray + f.diffuse * 55));
      const goldG = Math.floor(Math.min(240, baseGray + f.diffuse * 35));
      const goldB = Math.floor(baseGray * 0.9);

      if (f.specular > 0.6) {
        // Super bright flash highlight
        const specAlpha = (f.specular - 0.6) / 0.4;
        this.ctx.fillStyle = `rgba(255, 255, 240, ${0.85 + specAlpha * 0.15})`;
        this.ctx.strokeStyle = `rgba(255, 215, 0, 0.9)`;
      } else {
        this.ctx.fillStyle = `rgb(${goldR}, ${goldG}, ${goldB})`;
        this.ctx.strokeStyle = 'rgba(20, 20, 20, 0.4)';
      }

      this.ctx.lineWidth = 0.8;
      this.ctx.fill();
      this.ctx.stroke();

      // Draw star flare on highest specular tiles
      if (f.specular > 0.82) {
        const cx = (f.p1.px + f.p3.px) / 2;
        const cy = (f.p1.py + f.p3.py) / 2;
        this.drawSparkle(cx, cy, 12 + f.specular * 14);
      }
    });
  }

  drawSparkle(x, y, size) {
    this.ctx.save();
    this.ctx.translate(x, y);

    const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, size);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 225, 120, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');

    this.ctx.fillStyle = gradient;

    // Cross shape
    this.ctx.beginPath();
    this.ctx.moveTo(-size, 0);
    this.ctx.quadraticCurveTo(0, 0, 0, -size);
    this.ctx.quadraticCurveTo(0, 0, size, 0);
    this.ctx.quadraticCurveTo(0, 0, 0, size);
    this.ctx.quadraticCurveTo(0, 0, -size, 0);
    this.ctx.fill();

    this.ctx.restore();
  }

  animate() {
    if (this.isVisible) {
      this.rotation += 0.008; // Smooth spinning speed
      this.draw();
    }
    this.animationId = requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new DiscoParticles('heroCanvas');
  new DiscoBall3D('discoBallCanvas');
});
