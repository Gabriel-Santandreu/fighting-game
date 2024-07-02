const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

//Template sobre la que se crean los sprites
class Sprite {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.height = 150;
        this.lastKey; //variable que registra la última tecla pulsada de cada jugador (sprite)
    }

    draw() {
        c.fillStyle = "red";
        c.fillRect(this.position.x, this.position.y, 50, this.height);
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        } else {
            this.velocity.y += gravity;
        }
    }
}

//Registro de personajes y características
const player = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0,
    },
});

const enemy = new Sprite({
    position: {
        x: 400,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0,
    },
});

//Registro de teclas
const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    w: {
        pressed: false,
    },
};

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);

    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    //Movimiento de jugador
    if (keys.a.pressed && player.lastKey === "a") {
        player.velocity.x = -5;
    } else if (keys.d.pressed && player.lastKey === "d") {
        player.velocity.x = 5;
    }

    //Movimiento de enemigo
    if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
        player.velocity.x = -5;
    } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
        player.velocity.x = 5;
    }
}

window.addEventListener("keydown", (event) => {
    console.log(event.key);
    switch (event.key) {
        case "d":
            keys.d.pressed = true;
            player.lastKey = "d";
            break;

        case "a":
            keys.a.pressed = true;
            player.lastKey = "a";
            break;

        case "w":
            player.velocity.y = -20;
            break;

        case "ArrowRight":
            keys.ArrowRight.pressed = true;
            enemy.lastkey = "ArrowRight";
            break;

        case "ArrowLeft":
            keys.ArrowLeft.pressed = true;
            enemy.lastkey = "ArrowLeft";
            break;

        case "ArrowUp":
            enemy.velocity.y = -20;
            break;
    }
    console.log(event.key);
});

window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "d":
            keys.d.pressed = false;
            break;

        case "a":
            keys.a.pressed = false;
            break;

        case "ArrowRight":
            keys.ArrowRight.pressed = false;
            break;

        case "ArrowLeft":
            keys.ArrowLeft.pressed = false;
            break;
    }
    console.log(event.key);
});

console.log(player);

animate();
