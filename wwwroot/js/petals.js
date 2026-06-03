function initPetals() {
    const canvas = document.getElementById('petalCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    // Botanical green & cream palette to match the parchment/floral theme
    const COLORS = ['#8fb88a', '#6b9e62', '#a5c9a0', '#4a7c42', '#c8dbc5', '#d6e8d3', '#b5ceb2'];
    const COUNT  = 40;
    let petals = [];

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function spawn(randomY) {
        return {
            x:          Math.random() * window.innerWidth,
            y:          randomY ? Math.random() * window.innerHeight : -Math.random() * window.innerHeight * 0.5,
            rx:         Math.random() * 5   + 2.5,
            ry:         Math.random() * 3   + 1.2,
            speed:      Math.random() * 0.9 + 0.3,
            sway:       Math.random() * 0.8 + 0.15,
            swayPhase:  Math.random() * Math.PI * 2,
            swaySpeed:  Math.random() * 0.016 + 0.005,
            rotation:   Math.random() * Math.PI * 2,
            rotSpeed:   (Math.random() - 0.5) * 0.022,
            opacity:    Math.random() * 0.4 + 0.12,
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

    window.addEventListener('resize', resize);

    init();
    animate();
}
