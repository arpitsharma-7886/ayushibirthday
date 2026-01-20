// Confetti Animation
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const confettiColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe', '#fd79a8', '#fdcb6e'];
// Reduce confetti count on mobile for better performance
let isMobile = window.innerWidth <= 768;
const confettiCount = isMobile ? 80 : 150;
const confetti = [];

class ConfettiPiece {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.width = Math.random() * 10 + 5;
        this.height = Math.random() * 10 + 5;
        this.speed = Math.random() * 3 + 2;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 5 - 2.5;
        this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
    }

    update() {
        this.y += this.speed;
        this.x += Math.sin(this.y * 0.01) * 2;
        this.rotation += this.rotationSpeed;

        if (this.y > canvas.height) {
            this.y = -10;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;

        if (this.shape === 'rect') {
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}

// Initialize confetti
for (let i = 0; i < confettiCount; i++) {
    confetti.push(new ConfettiPiece());
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    confetti.forEach(piece => {
        piece.update();
        piece.draw();
    });
    
    requestAnimationFrame(animateConfetti);
}

animateConfetti();

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Recalculate mobile status
    const wasMobile = isMobile;
    const nowMobile = window.innerWidth <= 768;
    // If switching between mobile/desktop, adjust confetti
    if (wasMobile !== nowMobile && confetti.length > 0) {
        const targetCount = nowMobile ? 80 : 150;
        if (confetti.length > targetCount) {
            confetti.splice(targetCount);
        } else if (confetti.length < targetCount) {
            for (let i = confetti.length; i < targetCount; i++) {
                confetti.push(new ConfettiPiece());
            }
        }
    }
});

// Add click interaction for more confetti
let clickConfetti = [];

// Touch and click support for mobile
const handleInteraction = (e) => {
    const x = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const y = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    const particleCount = isMobile ? 10 : 20;
    
    for (let i = 0; i < particleCount; i++) {
        clickConfetti.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            size: Math.random() * 8 + 4,
            life: 30
        });
    }
};

document.addEventListener('click', handleInteraction);
document.addEventListener('touchstart', handleInteraction);

function animateClickConfetti() {
    ctx.save();
    clickConfetti = clickConfetti.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.3; // gravity
        particle.life--;
        
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        return particle.life > 0;
    });
    ctx.restore();
}

function animate() {
    animateClickConfetti();
    requestAnimationFrame(animate);
}

animate();

// Add sparkle effect on name hover
const nameElement = document.querySelector('.name');
nameElement.addEventListener('mouseenter', () => {
    nameElement.style.animation = 'none';
    setTimeout(() => {
        nameElement.style.animation = 'namePulse 0.5s ease-in-out infinite';
    }, 10);
});

// Play birthday sound effect (optional - can be added if needed)
// You can add audio file for birthday song if desired

