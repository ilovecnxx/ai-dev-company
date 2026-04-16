// CYBERBLOG Visual Effects
// ========================================

const Effects = {
  // Particle system
  particles: null,
  particlesCtx: null,
  particleArray: [],
  animationId: null,

  initParticles() {
    this.particles = document.getElementById('particles');
    if (!this.particles) return;

    this.particlesCtx = this.particles.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.createParticles();
    this.animate();
  },

  resizeCanvas() {
    if (!this.particles) return;
    this.particles.width = window.innerWidth;
    this.particles.height = window.innerHeight;
  },

  createParticles() {
    this.particleArray = [];
    const count = Math.floor(window.innerWidth / 15);

    for (let i = 0; i < count; i++) {
      this.particleArray.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 1.5 + 0.5,
        color: Math.random() > 0.5 ? 'rgba(0, 245, 255, 0.5)' : 'rgba(168, 85, 247, 0.5)'
      });
    }
  },

  animate() {
    if (!this.particlesCtx) return;

    this.particlesCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    this.particleArray.forEach(p => {
      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0) p.x = window.innerWidth;
      if (p.x > window.innerWidth) p.x = 0;
      if (p.y < 0) p.y = window.innerHeight;
      if (p.y > window.innerHeight) p.y = 0;

      // Draw particle
      this.particlesCtx.beginPath();
      this.particlesCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.particlesCtx.fillStyle = p.color;
      this.particlesCtx.fill();
    });

    // Draw connections
    this.particleArray.forEach((p1, i) => {
      this.particleArray.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          this.particlesCtx.beginPath();
          this.particlesCtx.moveTo(p1.x, p1.y);
          this.particlesCtx.lineTo(p2.x, p2.y);
          this.particlesCtx.strokeStyle = `rgba(0, 245, 255, ${0.1 * (1 - dist / 120)})`;
          this.particlesCtx.stroke();
        }
      });
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  },

  // Typing effect for terminal text
  typeText(element, text, speed = 50) {
    return new Promise(resolve => {
      let i = 0;
      element.textContent = '';

      const type = () => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed);
        } else {
          resolve();
        }
      };

      type();
    });
  },

  // Ripple effect
  createRipple(event, element) {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      width: 10px;
      height: 10px;
      background: rgba(0, 245, 255, 0.5);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      left: ${x}px;
      top: ${y}px;
      animation: ripple 0.6s ease-out forwards;
      pointer-events: none;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  },

  // Glitch effect for titles
  glitch(element) {
    const original = element.textContent;
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';

    let iterations = 0;
    const interval = setInterval(() => {
      element.textContent = original
        .split('')
        .map((char, idx) => {
          if (idx < iterations) return original[idx];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iterations >= original.length) {
        clearInterval(interval);
        element.textContent = original;
      }
      iterations += 1 / 3;
    }, 30);
  },

  // Intersection Observer for scroll animations
  initScrollAnimations() {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.post-card, .sidebar-section').forEach(el => {
      observer.observe(el);
    });
  }
};

// Add ripple animation CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes ripple {
    from {
      transform: translate(-50%, -50%) scale(0);
      opacity: 1;
    }
    to {
      transform: translate(-50%, -50%) scale(40);
      opacity: 0;
    }
  }
`;
document.head.appendChild(rippleStyle);
