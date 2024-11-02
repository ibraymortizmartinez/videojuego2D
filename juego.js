const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = 600;
canvas.width = 800;
canvas.style.background = "#000000";

let score = 0;
let timeRemaining = 30;
let timerInterval;
let circles = [];
let obstacles = [];

// Cargar imágenes
const backgroundImage = new Image();
backgroundImage.src = 'assets/img/fondo2.jpeg';
const circleImage = new Image();
circleImage.src = 'assets/img/balon.png';
const obstacleImage = new Image();
obstacleImage.src = 'assets/img/tarjetas.png';

// Función para generar círculos y obstáculos
function generateCircles(n) {
    circles = []; // Reiniciar el array
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20;
        let x = Math.random() * (window_width - radius * 2) + radius;
        let speed = Math.random() * 6 + 2;
        circles.push(new Circle(x, radius, '#FFFFFF', circleImage, speed));
    }
}

function generateObstacles(n) {
    obstacles = []; // Reiniciar el array
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20;
        let x = Math.random() * (window_width - radius * 2) + radius;
        obstacles.push(new Obstacle(x, radius, obstacleImage));
    }
}

// Clase para representar círculos
class Circle {
    constructor(x, radius, color, image, speed) {
        this.posX = x;
        this.posY = window_height - radius - 5; 
        this.radius = radius;
        this.color = color;
        this.image = image;
        this.speed = speed;
        this.dx = (Math.random() < 0.5 ? -1 : 1) * this.speed; // Movimiento horizontal aleatorio
        this.dy = -Math.random() * 2 - 1; // Movimiento hacia arriba (negativo) con velocidad aleatoria
    }

    draw(context) {
        context.drawImage(this.image, this.posX - this.radius, this.posY - this.radius, this.radius * 2, this.radius * 2);
    }

    update(context) {
        this.draw(context);
        this.posX += this.dx;
        if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
            this.dx = -this.dx;
        }
        this.posY += this.dy;
        if (this.posY - this.radius < 0) {
            this.posY = window_height - this.radius - 5;
            this.posX = Math.random() * (window_width - this.radius * 2) + this.radius;
        }
    }
}

// Clase para representar obstáculos
class Obstacle {
    constructor(x, radius, image) {
        this.posX = x;
        this.posY = window_height; // Comienza desde la parte inferior
        this.radius = radius;
        this.image = image; // Imagen del obstáculo
        this.dy = -Math.random() * 2 - 1; // Movimiento hacia arriba
    }

    draw(context) {
        context.drawImage(this.image, this.posX - this.radius, this.posY - this.radius, this.radius * 2, this.radius * 2);
    }

    update(context) {
        this.draw(context);
        this.posY += this.dy;
        if (this.posY + this.radius < 0) {
            this.posY = window_height;
            this.posX = Math.random() * (window_width - this.radius * 2) + this.radius;
        }
    }
}

// Función para dibujar puntuación y temporizador
function drawUI() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Fondo semitransparente
    ctx.fillRect(0, 0, canvas.width, 40); // Dibuja un rectángulo
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Puntuación: " + score, 10, 30);
    ctx.fillText("Tiempo: " + timeRemaining, canvas.width - 100, 30);
}

// Función para animar los círculos y obstáculos
function animate() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // Dibuja el fondo
    circles.forEach(circle => {
        circle.update(ctx); // Actualizar cada círculo
    });
    obstacles.forEach(obstacle => {
        obstacle.update(ctx); // Actualizar cada obstáculo
    });
    drawUI(); // Dibujar puntuación y temporizador
    requestAnimationFrame(animate); // Repetir la animación
}

// Función para detectar clics y eliminar círculos
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    for (let i = 0; i < circles.length; i++) {
        const circle = circles[i];
        const distance = Math.sqrt((mouseX - circle.posX) ** 2 + (mouseY - circle.posY) ** 2);
        
        if (distance < circle.radius) {
            score++; // Aumentar la puntuación
            circles.splice(i, 1); // Eliminar el círculo
            break; // Salir del bucle
        }
    }

    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        const distance = Math.sqrt((mouseX - obstacle.posX) ** 2 + (mouseY - obstacle.posY) ** 2);
        
        if (distance < obstacle.radius) {
            score--; // Penalizar la puntuación
            obstacles.splice(i, 1); // Eliminar el obstáculo
            break; // Salir del bucle
        }
    }
});

// Función para iniciar el temporizador
function startTimer() {
    timerInterval = setInterval(() => {
        timeRemaining--;
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            alert("¡Tiempo terminado! Tu puntuación final es: " + score);
            // Aquí puedes añadir lógica para reiniciar el juego
        }
    }, 1000);
}

// Función para reiniciar el juego
function restartGame() {
    score = 0;
    timeRemaining = 30; // Ajusta el tiempo si es necesario
    generateCircles(10); // Genera círculos nuevamente
    generateObstacles(5); // Genera obstáculos nuevamente
    startTimer(); // Reiniciar el temporizador
    animate(); // Comenzar la animación nuevamente
}

// Evento del botón de reiniciar
document.getElementById("restartButton").addEventListener("click", restartGame);

// Generar círculos y obstáculos y comenzar el juego
generateCircles(10); // Cambia el número de círculos aquí
generateObstacles(5); // Cambia el número de obstáculos aquí
startTimer(); // Comenzar el temporizador
animate(); // Comenzar la animación
