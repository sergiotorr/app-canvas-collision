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
    this.dx = (Math.random() * 2 - 1) * this.speed; // Movimiento lateral aleatorio
    this.dy = -Math.abs(this.speed); // Movimiento hacia arriba
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

    // Rebote en los bordes laterales
    if (this.posX + this.radius > canvas.width || this.posX - this.radius < 0) {
      this.dx = -this.dx;
    }

    // Cuando el círculo llega al tope superior, regresa al margen inferior
    if (this.posY - this.radius < 0) {
      this.posY = canvas.height - this.radius - 1; // Reiniciar justo antes del margen inferior
    }
  }

  checkCollision(otherCircle) {
    const distX = this.posX - otherCircle.posX;
    const distY = this.posY - otherCircle.posY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < this.radius + otherCircle.radius) {
      this.color = '#0000FF';
      otherCircle.color = '#0000FF';
      let tempDx = this.dx;
      let tempDy = this.dy;
      this.dx = otherCircle.dx;
      this.dy = otherCircle.dy;
      otherCircle.dx = tempDx;
      otherCircle.dy = tempDy;
    } else {
      this.color = this.originalColor;
      otherCircle.color = otherCircle.originalColor;
    }
  }

  // Método para verificar si el mouse hizo clic en el círculo
  isClicked(mouseX, mouseY) {
    const distX = this.posX - mouseX;
    const distY = this.posY - mouseY;
    const distance = Math.sqrt(distX * distX + distY * distY);
    return distance < this.radius;
  }
}

let circles = [];

// Generar círculos aleatorios que inicien justo antes del margen inferior
function generateCircles(n) {
  for (let i = 0; i < n; i++) {
    let radius = Math.random() * 30 + 20; // Radio entre 20 y 50
    let x = Math.random() * (canvas.width - radius * 2) + radius;
    let y = canvas.height - radius - 1; // Posición inicial justo antes del margen inferior
    let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    let speed = Math.random() * 2 + 1; // Velocidad entre 1 y 3
    let text = `C${i + 1}`;
    circles.push(new Circle(x, y, radius, color, text, speed));
  }
}

// Función para eliminar el círculo al hacer clic
function removeCircleAt(mouseX, mouseY) {
  circles = circles.filter(circle => !circle.isClicked(mouseX, mouseY));
}

// Detección del clic del mouse
canvas.addEventListener('click', function(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  removeCircleAt(mouseX, mouseY);
});

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
