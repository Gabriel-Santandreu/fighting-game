const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background_2.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './img/shop_anim.png',
    scale: 2.75,
    framesMax: 6
})


//Registro de personajes y características
const player = new Fighter({
    position: {
        x: 0,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    offset: {
        x: 0,
        y: 0,
    },
    color: "blue",
    imageSrc: './img/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './img/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/Fall.png',
            framesMax: 2  
        },
        attack1: {
            imageSrc: './img/Attack1.png',
            framesMax: 6
        }
    }

});

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    offset: {
        x: -50,
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
    ArrowRight: {
        pressed: false,
    },
    ArrowLeft: {
        pressed: false,
    },
};

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);

    background.update()
    shop.update()
    player.update();
    //enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    //Movimiento de jugador
    if (keys.a.pressed && player.lastKey === "a") {
        player.velocity.x = -5;
        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey === "d") {
        player.velocity.x = 5;
        player.switchSprite('run');    
    } else {
        player.switchSprite('idle');
    }

    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall');

    }

    //Movimiento de enemigo
    if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
        enemy.velocity.x = -5;
    } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
        enemy.velocity.x = 5;
    }

    //Check de la hitbox del golpe
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy,
        }) &&
        player.isAttacking
    ) {
        player.isAttacking = false;
        enemy.health -= 5;
        document.querySelector("#enemyHealth").style.width = enemy.health + "%";
    }

    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player,
        }) &&
        enemy.isAttacking
    ) {
        enemy.isAttacking = false;
        player.health -= 5;
        document.querySelector("#playerHealth").style.width =
            player.health + "%";
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId });
    }
}

window.addEventListener("keydown", (event) => {
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

        case " ":
            player.attack();
            break;

        case "ArrowRight":
            keys.ArrowRight.pressed = true;
            enemy.lastKey = "ArrowRight";
            break;

        case "ArrowLeft":
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = "ArrowLeft";
            break;

        case "ArrowUp":
            enemy.velocity.y = -20;
            break;

        case "Enter":
            enemy.isAttacking = true;
            break;
    }
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
});

animate();

decreaseTimer();