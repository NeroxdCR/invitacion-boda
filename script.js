const btnStart = document.getElementById('btnStart');
const startScreen = document.getElementById('startScreen');
const video = document.getElementById('bgVideo');
const body = document.body;
const introText = document.getElementById('introText');
const music = document.getElementById('bgMusic');
const introContainer = document.getElementById('introContainer');

// 1. LÓGICA DE INICIO (AL HACER CLIC EN EL BOTÓN)
btnStart.addEventListener('click', () => {
    // Desvanecer pantalla de inicio
    startScreen.style.opacity = "0";
    setTimeout(() => {
        startScreen.style.display = "none";
    }, 600);

    // Configurar y reproducir video con sonido
    video.muted = false;
    video.volume = 0.3;
    video.play().catch(error => console.log("Error al reproducir video:", error));

    // Programar el fin de la intro a los 10 segundos exactos
    setTimeout(finalizarIntro, 10000);
});

// 2. FUNCIÓN PARA TERMINAR LA INTRO Y MOSTRAR LA INVITACIÓN
function finalizarIntro() {
    video.pause();
    
    // Cambiar fondo a Rojo Marvel y ocultar el elemento video
    introContainer.classList.add('portada-finalizada');
    video.style.display = "none"; 

    // Mostrar el texto de la alianza con los nuevos colores
    introText.style.opacity = "1";
    introText.style.pointerEvents = "auto";
    
    // REVELAR SECCIONES OCULTAS (Para corregir visualización en PC)
    document.querySelectorAll('.section-hidden').forEach(sec => {
        sec.style.display = "block";
        // Pequeño delay para que el IntersectionObserver las detecte bien
        setTimeout(() => {
            sec.classList.remove('section-hidden');
        }, 50);
    });

    // Liberar el scroll del navegador
    body.classList.remove('no-scroll');
    body.style.overflow = "visible";
    body.style.height = "auto";
    
    // Iniciar música de fondo
    music.volume = 0.2;
    music.play().catch(e => console.log("Audio en espera de interacción extra"));
}

// 3. CONTADOR REGRESIVO
const weddingDate = new Date("Mar 20, 2026 15:00:00").getTime();
setInterval(() => {
    const now = new Date().getTime();
    const gap = weddingDate - now;
    
    const second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24;

    const d = Math.floor(gap / day);
    const h = Math.floor((gap % day) / hour);
    const m = Math.floor((gap % hour) / minute);
    const s = Math.floor((gap % minute) / second);

    // Actualizar el DOM solo si los elementos existen
    if(document.getElementById("days")) {
        document.getElementById("days").innerText = d < 10 ? "0" + d : d;
        document.getElementById("hours").innerText = h < 10 ? "0" + h : h;
        document.getElementById("minutes").innerText = m < 10 ? "0" + m : m;
        document.getElementById("seconds").innerText = s < 10 ? "0" + s : s;
    }
}, 1000);

// 4. REVEAL SCROLL (EFECTO APARECER PANELES)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.panel').forEach(p => observer.observe(p));

// 5. MODAL RSVP
const modal = document.getElementById("rsvpModal");
const btnOpen = document.getElementById("openModal");
const btnClose = document.querySelector(".close");

if(btnOpen) {
    btnOpen.onclick = () => modal.style.display = "block";
}

if(btnClose) {
    btnClose.onclick = () => modal.style.display = "none";
}

window.onclick = (e) => { 
    if (e.target == modal) modal.style.display = "none"; 
}

// 6. INTEGRACIÓN CON GOOGLE SHEETS
const scriptURL = 'https://script.google.com/macros/s/AKfycby0Wa-v-EGbyu0cyvC2t0O8i-7zKviQAOsjjLBqIQF-tZ6sYuRVtyqLOoYymEcyydgs/exec'; // <--- PEGA AQUÍ TU URL
const form = document.getElementById('weddingForm');
const successMsg = document.getElementById('successMsg');

form.addEventListener('submit', e => {
    e.preventDefault();
    
    // Cambiar el texto del botón mientras se envía
    const submitBtn = form.querySelector('button');
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = "ENVIANDO SEÑAL...";
    submitBtn.disabled = true;

    fetch(scriptURL, { 
        method: 'POST', 
        body: new FormData(form)
    })
    .then(response => {
        // Ocultar el formulario con un efecto de desvanecimiento
        form.style.opacity = '0';
        setTimeout(() => {
            form.style.display = 'none';
            successMsg.style.display = 'block';
            successMsg.style.opacity = '0';
            // Aparece el mensaje de éxito
            setTimeout(() => { successMsg.style.opacity = '1'; }, 50);
        }, 400);
        console.log('¡Misión confirmada!');
    })
    .catch(error => {
        console.error('Error en la señal:', error.message);
        submitBtn.innerText = "REINTENTAR ENVÍO";
        submitBtn.disabled = false;
        alert("Hubo un error al enviar la señal. ¡Inténtalo de nuevo, héroe!");
    });
});