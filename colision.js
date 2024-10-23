const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Dimensiones del canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Circle {
  constructor(x, y, radius, color, text, speed) {
    this.posX = x;
    this.posY = y;
    this.radius = radius;
    this.color = color;
    this.originalColor = color;
    this.text = text;
    this.speed = speed;
    this.dx = (Math.random() * 2 - 1) * this.speed; // Dirección aleatoria en X
    this.dy = (Math.random() * 2 - 1) * this.speed; // Dirección aleatoria en Y
  }

  draw(context) {
    context.beginPath();
    context.strokeStyle = this.color;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "20px Arial";
    context.fillText(this.text, this.posX, this.posY);
    context.lineWidth = 2;
    context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
    context.stroke();
    context.closePath();
  }

  update() {
    this.posX += this.dx;
    this.posY += this.dy;

    // Rebote en los bordes del canvas
    if (this.posX + this.radius > canvas.width || this.posX - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.posY + this.radius > canvas.height || this.posY - this.radius < 0) {
      this.dy = -this.dy;
    }
  }

  checkCollision(otherCircle) {
    const distX = this.posX - otherCircle.posX;
    const distY = this.posY - otherCircle.posY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    // Verificar si los círculos están en colisión
    if (distance < this.radius + otherCircle.radius) {
      this.color = '#0000FF'; // Cambia a color azul durante la colisión
      otherCircle.color = '#0000FF';
      
      // Rebote: intercambiar velocidades para simular colisión elástica
      let tempDx = this.dx;
      let tempDy = this.dy;
      this.dx = otherCircle.dx;
      this.dy = otherCircle.dy;
      otherCircle.dx = tempDx;
      otherCircle.dy = tempDy;
    } else {
      // Restaurar color original después de la colisión
      this.color = this.originalColor;
      otherCircle.color = otherCircle.originalColor;
    }
  }
}

let circles = [];

// Generar círculos aleatorios
function generateCircles(n) {
  for (let i = 0; i < n; i++) {
    let radius = Math.random() * 30 + 20; // Radio entre 20 y 50
    let x = Math.random() * (canvas.width - radius * 2) + radius;
    let y = Math.random() * (canvas.height - radius * 2) + radius;
    let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Color aleatorio
    let speed = Math.random() * 2 + 1; // Velocidad entre 1 y 3
    let text = `C${i + 1}`; // Etiqueta del círculo
    circles.push(new Circle(x, y, radius, color, text, speed));
  }
}

// Función para animar los círculos
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas

  circles.forEach(circle => {
    circle.update();
    circle.draw(ctx);
    circles.forEach(otherCircle => {
      if (circle !== otherCircle) {
        circle.checkCollision(otherCircle);
      }
    });
  });

  requestAnimationFrame(animate); // Repetir la animación
}

// Generar 10 círculos y comenzar la animación
generateCircles(10);
animate();
