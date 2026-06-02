function initPetals() {
    const canvas = document.getElementById('petalCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const COLORS = ['#e8d5b0', '#c9a97a', '#b8946a', '#d4b483', '#f0dfb8', '#a07848'];
    const COUNT  = 45;
    let petals = [];

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function spawn(randomY) {
        return {
            x:          Math.random() * window.innerWidth,
            y:          randomY ? Math.random() * window.innerHeight : -Math.random() * window.innerHeight * 0.5,
            rx:         Math.random() * 5   + 3,      // x radius
            ry:         Math.random() * 3   + 1.5,    // y radius
            speed:      Math.random() * 1.0 + 0.35,   // fall speed
            sway:       Math.random() * 0.9 + 0.2,    // lateral sway amplitude
            swayPhase:  Math.random() * Math.PI * 2,
            swaySpeed:  Math.random() * 0.018 + 0.006,
            rotation:   Math.random() * Math.PI * 2,
            rotSpeed:   (Math.random() - 0.5) * 0.025,
            opacity:    Math.random() * 0.45 + 0.18,
            color:      COLORS[Math.floor(Math.random() * COLORS.length)]
        };
    }

    function init() {
        resize();
        petals = Array.from({ length: COUNT }, () => spawn(true));
    }

    function drawPetal(p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle   = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.rx, p.ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const p of petals) {
            p.y         += p.speed;
            p.x         += Math.sin(p.swayPhase) * p.sway;
            p.swayPhase += p.swaySpeed;
            p.rotation  += p.rotSpeed;

            if (p.y > canvas.height + 20) {
                Object.assign(p, spawn(false));
                p.x = Math.random() * canvas.width;
            }

            drawPetal(p);
        }

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resize();
    });

    init();
    animate();
}
