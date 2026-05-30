// --- Background Stars (for all pages) ---
function createStars() {
    const sky = document.getElementById('night-sky');
    if (!sky) return;
    for (let i = 0; i < 150; i++) {
        let star = document.createElement('div');
        star.className = 'star';
        star.style.width = Math.random() * 3 + 'px';
        star.style.height = star.style.width;
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = Math.random() * 100 + 'vh';
        star.style.animationDelay = Math.random() * 2 + 's';
        star.style.animationDuration = Math.random() * 3 + 2 + 's';
        sky.appendChild(star);
    }
}
createStars();

// --- Procedural LED Generation (Circular) ---
const ledRings = document.querySelectorAll('.t-led-ring');
const allBulbs = [];
const ledColors = ['red', 'yellow', 'blue', 'green'];

function generateRings() {
    ledRings.forEach(ring => {
        // Is it the top crest or a circle?
        const isCrest = ring.classList.contains('crest-ring');
        
        if (isCrest) {
            // Crest logic: parametric ellipse
            const count = 40;
            const centerX = 200;
            const centerY = 150;
            const rX = 207.5;
            const rY = 157.5;
            for(let i=0; i<count; i++) {
                let t = (i / (count - 1)) * Math.PI;
                let x = centerX - (rX * Math.cos(t)); 
                let y = centerY - (rY * Math.sin(t));
                createBulb(ring, x + 'px', y + 'px');
            }
        } else {
            // Perfect circle
            const parentWidth = ring.parentElement.offsetWidth; 
            const centerX = (parentWidth + 6) / 2;
            const centerY = centerX;
            const radius = centerX + 6;
            
            const circumference = 2 * Math.PI * radius;
            const count = Math.floor(circumference / 12); 
            
            for(let i=0; i<count; i++) {
                let angle = (i / count) * 2 * Math.PI;
                let x = centerX + radius * Math.cos(angle);
                let y = centerY + radius * Math.sin(angle);
                createBulb(ring, x + 'px', y + 'px');
            }
        }
    });
}

function createBulb(parent, x, y) {
    let bulb = document.createElement('div');
    bulb.className = 'bulb';
    bulb.style.left = x;
    bulb.style.top = y;
    parent.appendChild(bulb);
    allBulbs.push(bulb);
}

if (ledRings.length > 0) {
    generateRings();
}


// --- Lighting Animations ---
let currentPattern = 'chasing';
let animInterval = null;

function clearBulbs() {
    allBulbs.forEach(b => {
        b.className = 'bulb'; // removes all color classes
    });
}

function runLighting() {
    if (allBulbs.length === 0) return;
    clearInterval(animInterval);
    clearBulbs();

    if (currentPattern === 'chasing') {
        let step = 0;
        animInterval = setInterval(() => {
            clearBulbs();
            allBulbs.forEach((b, i) => {
                if ((i + step) % 6 === 0) {
                    let colorIdx = Math.floor(i / 50) % 4; // Colors depend on region
                    b.classList.add(ledColors[colorIdx]);
                }
            });
            step++;
        }, 80);
    } 
    else if (currentPattern === 'breathing') {
        let phase = 0;
        animInterval = setInterval(() => {
            phase += 0.1;
            allBulbs.forEach((b, i) => {
                let intensity = (Math.sin(phase + (i * 0.01)) + 1) / 2;
                if (intensity > 0.7) {
                    let c = ledColors[i % 4];
                    if(!b.classList.contains(c)) {
                        b.className = 'bulb ' + c;
                    }
                } else {
                    b.className = 'bulb';
                }
            });
        }, 50);
    }
    else if (currentPattern === 'random') {
        animInterval = setInterval(() => {
            allBulbs.forEach(b => {
                if (Math.random() > 0.8) {
                    b.className = 'bulb ' + ledColors[Math.floor(Math.random() * 4)];
                } else {
                    b.className = 'bulb';
                }
            });
        }, 120);
    }
}

if (allBulbs.length > 0) {
    runLighting();
}

// Controls Logic
const buttons = document.querySelectorAll('.glass-btn');
buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        buttons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentPattern = e.target.id.replace('btn-', '');
        runLighting();
    });
});


// --- Apple Glass Modal Logic ---
const modal = document.getElementById('glass-modal');
const closeModal = document.querySelector('.glass-close');
const modalTitle = document.getElementById('modal-title');
const modalText = document.getElementById('modal-text');

if (modal) {
    const circles = document.querySelectorAll('.t-circle');
    circles.forEach(circle => {
        circle.addEventListener('click', () => {
            const sceneId = circle.getAttribute('data-scene');
            // storyData is defined in the HTML file's <script> block
            if (window.storyData && window.storyData[sceneId]) {
                modalTitle.innerText = window.storyData[sceneId].title;
                modalText.innerText = window.storyData[sceneId].desc;
                modal.classList.add('show');
            }
        });
    });

    closeModal.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
}

// --- Corner Elements & Mouse Interactivity ---
const boContainer = document.getElementById('bo-leaves-container');
const lanternContainer = document.getElementById('lanterns-container');
const interactables = [];

if (boContainer) {
    for(let i=0; i<15; i++) {
        let leaf = document.createElement('div');
        leaf.className = 'bo-leaf';
        leaf.style.width = (Math.random() * 20 + 30) + 'px';
        leaf.style.height = leaf.style.width;
        leaf.style.left = (Math.random() * 150) + 'px';
        leaf.style.top = (Math.random() * 200 - 50) + 'px';
        leaf.dataset.rot = (Math.random() * 90);
        leaf.style.transform = `rotate(${leaf.dataset.rot}deg)`;
        boContainer.appendChild(leaf);
        interactables.push({el: leaf, type: 'leaf', rot: parseFloat(leaf.dataset.rot)});
    }
}

if (lanternContainer) {
    for(let i=0; i<4; i++) {
        let lantern = document.createElement('div');
        lantern.className = 'lantern';
        lantern.style.right = (Math.random() * 100 + 20) + 'px';
        lantern.style.top = (Math.random() * 50 + 50) + 'px';
        lanternContainer.appendChild(lantern);
        interactables.push({
            el: lantern, 
            type: 'lantern', 
            angle: 0, 
            velocity: 0, 
            targetAngle: 0
        });
    }
}

document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    interactables.forEach(item => {
        const rect = item.el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distX = mouseX - centerX;
        const distY = mouseY - centerY;
        const distance = Math.sqrt(distX * distX + distY * distY);
        
        if (item.type === 'leaf') {
            if (distance < 200) {
                let force = (200 - distance) / 200; 
                let moveX = -(distX / distance) * force * 50;
                let moveY = -(distY / distance) * force * 50;
                let newRot = item.rot + (force * 60);
                item.el.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${newRot}deg)`;
            } else {
                item.el.style.transform = `translate(0, 0) rotate(${item.rot}deg)`;
            }
        } else if (item.type === 'lantern') {
            if (distance < 250) {
                let force = (250 - distance) / 250; 
                item.targetAngle = -(distX / distance) * force * 45; 
            } else {
                item.targetAngle = 0;
            }
        }
    });
});

// --- Lantern Physics Loop ---
function updatePhysics() {
    interactables.forEach(item => {
        if (item.type === 'lantern') {
            // Spring force towards targetAngle
            let force = (item.targetAngle - item.angle) * 0.05; 
            item.velocity += force;
            
            // Damping for a natural ~3s swing decay
            item.velocity *= 0.975; 
            item.angle += item.velocity;
            
            item.el.style.transform = `rotate(${item.angle}deg)`;
        }
    });
    requestAnimationFrame(updatePhysics);
}
updatePhysics();

// --- Footer Injection ---
const footer = document.createElement('div');
footer.className = 'glass-footer';
footer.innerHTML = `
    <span>Developed by Senila</span>
    <a href="https://github.com/bexonsr" target="_blank" title="GitHub">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
    </a>
    <a href="https://deviantart.com/senilad" target="_blank" title="DeviantArt" style="font-weight: 800; font-size: 0.9rem; font-family: sans-serif; letter-spacing: -1px;">
        DA
    </a>
`;
document.body.appendChild(footer);
