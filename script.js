const btnStart = document.getElementById('btnStart');
const startScreen = document.getElementById('startScreen');
const video = document.getElementById('bgVideo');
const body = document.body;
const introText = document.getElementById('introText');
const music = document.getElementById('bgMusic');
const introContainer = document.getElementById('introContainer');

// 1. LÓGICA DE INICIO
btnStart.addEventListener('click', () => {
    startScreen.style.opacity = "0";
    setTimeout(() => {
        startScreen.style.display = "none";
    }, 600);

    video.muted = false;
    video.volume = 0.3;
    video.play().catch(error => console.log("Error al reproducir video:", error));

    setTimeout(finalizarIntro, 10000);
});

// 2. FUNCIÓN PARA TERMINAR LA INTRO
function finalizarIntro() {
    video.pause();
    introContainer.classList.add('portada-finalizada');
    video.style.display = "none"; 

    introText.style.opacity = "1";
    introText.style.pointerEvents = "auto";
    
    document.querySelectorAll('.section-hidden').forEach(sec => {
        sec.style.display = "block";
        setTimeout(() => {
            sec.classList.remove('section-hidden');
        }, 50);
    });

    // Liberar scroll inicial
    body.classList.remove('no-scroll');
    body.style.overflow = "visible";
    body.style.height = "auto";
    
    music.volume = 0.2;
    music.play().catch(e => console.log("Audio en espera"));
}

// 3. CONTADOR REGRESIVO (Se mantiene igual)
const weddingDate = new Date("Mar 20, 2026 15:00:00").getTime();
setInterval(() => {
    const now = new Date().getTime();
    const gap = weddingDate - now;
    const second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24;
    const d = Math.floor(gap / day);
    const h = Math.floor((gap % day) / hour);
    const m = Math.floor((gap % hour) / minute);
    const s = Math.floor((gap % minute) / second);

    if(document.getElementById("days")) {
        document.getElementById("days").innerText = d < 10 ? "0" + d : d;
        document.getElementById("hours").innerText = h < 10 ? "0" + h : h;
        document.getElementById("minutes").innerText = m < 10 ? "0" + m : m;
        document.getElementById("seconds").innerText = s < 10 ? "0" + s : s;
    }
}, 1000);

// 4. REVEAL SCROLL (Se mantiene igual)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.panel').forEach(p => observer.observe(p));

// 5. MODAL RSVP (AJUSTADO PARA BLOQUEO DE SCROLL Y CENTRADO)
const modal = document.getElementById("rsvpModal");
const btnOpen = document.getElementById("openModal");
const btnClose = document.querySelector(".close");

// Función centralizada para abrir
const openRSVP = () => {
    modal.style.display = "flex"; // Usamos flex para que el centrado CSS funcione
    body.classList.add('no-scroll'); // Bloqueamos el scroll del fondo
};

// Función centralizada para cerrar
const closeRSVP = () => {
    modal.style.display = "none";
    body.classList.remove('no-scroll'); // Devolvemos el scroll
};

if(btnOpen) {
    btnOpen.onclick = openRSVP;
}

if(btnClose) {
    btnClose.onclick = closeRSVP;
}

// Cerrar si hacen clic fuera del cuadrito blanco
window.onclick = (e) => { 
    if (e.target == modal) closeRSVP(); 
}

// 5.1 Form campos auto
const guestCountInput = document.getElementById('guestCount');
const dynamicContainer = document.getElementById('dynamicNamesContainer');

guestCountInput.addEventListener('input', () => {
    const count = parseInt(guestCountInput.value) || 1;
    dynamicContainer.innerHTML = ''; // Limpiar campos anteriores

    for (let i = 1; i <= count; i++) {
        const div = document.createElement('div');
        div.className = 'form-group';
        div.style.marginBottom = "15px";
        
        div.innerHTML = `
            <label>NOMBRE DEL AGENTE ${i}:</label>
            <input type="text" name="name_${i}" required placeholder="Nombre completo" class="comic-input-dynamic">
        `;
        dynamicContainer.appendChild(div);
    }
});

// 6. INTEGRACIÓN CON GOOGLE SHEETS
const scriptURL = 'https://script.google.com/macros/s/AKfycbysrvoK3eMHMHEWotPyMLVwzdhbteBW0bN4w7jl9qm8IcGRaTTxZnbWXA3yk7wvIG32/exec';
const form = document.getElementById('weddingForm');
const successMsg = document.getElementById('successMsg');

form.addEventListener('submit', e => {
    e.preventDefault();
    const submitBtn = form.querySelector('button');
    submitBtn.innerText = "ENVIANDO SEÑAL...";
    submitBtn.disabled = true;

    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => {
        form.style.opacity = '0';
        setTimeout(() => {
            form.style.display = 'none';
            successMsg.style.display = 'block';
            setTimeout(() => { 
                successMsg.style.opacity = '1';
                // Opcional: Cerrar el modal automáticamente después de 3 segundos de éxito
                // setTimeout(closeRSVP, 3000); 
            }, 50);
        }, 400);
    })
    .catch(error => {
        submitBtn.innerText = "REINTENTAR ENVÍO";
        submitBtn.disabled = false;
        alert("Hubo un error al enviar la señal.");
    });
});