const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: "./img/background_2.png",
});

const shop = new Sprite({
    position: {
        x: 600,
        y: 128,
    },
    imageSrc: "./img/shop_anim.png",
    scale: 2.75,
    framesMax: 6,
});

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
    imageSrc: "./img/Player1/Idle.png",
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157,
    },
    sprites: {
        idle: {
            imageSrc: "./img/Player1/Idle.png",
            framesMax: 8,
        },
        run: {
            imageSrc: "./img/Player1/Run.png",
            framesMax: 8,
        },
        jump: {
            imageSrc: "./img/Player1/Jump.png",
            framesMax: 2,
        },
        fall: {
            imageSrc: "./img/Player1/Fall.png",
            framesMax: 2,
        },
        attack1: {
            imageSrc: "./img/Player1/Attack1.png",
            framesMax: 6,
        },
        takeHit: {
            imageSrc: "./img/Player1/TakeHit_whiteSilhouette.png",
            framesMax: 4,
        },
        death: {
            imageSrc: "./img/Player1/Death.png",
            framesMax: 6,
        },
    },
    attackBox: {
        offset: {
            x: 100,
            y: 0,
        },
        width: 160,
        height: 150,
    },
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
    imageSrc: "./img/Player2/Idle.png",
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 170,
    },
    sprites: {
        idle: {
            imageSrc: "./img/Player2/Idle.png",
            framesMax: 4,
        },
        run: {
            imageSrc: "./img/Player2/Run.png",
            framesMax: 8,
        },
        jump: {
            imageSrc: "./img/Player2/Jump.png",
            framesMax: 2,
        },
        fall: {
            imageSrc: "./img/Player2/Fall.png",
            framesMax: 2,
        },
        attack1: {
            imageSrc: "./img/Player2/Attack1.png",
            framesMax: 4,
        },
        takeHit: {
            imageSrc: "./img/Player2/Take_hit.png",
            framesMax: 3,
        },
        death: {
            imageSrc: "./img/Player2/Death.png",
            framesMax: 7,
        },
    },
    attackBox: {
        offset: {
            x: -150,
            y: 0,
        },
        width: 160,
        height: 150,
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

    background.update();
    shop.update();
    c.fillStyle = "rgba(255, 255, 255, 0.15)";
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    //Movimiento de jugador
    if (keys.a.pressed && player.lastKey === "a") {
        player.velocity.x = -5;
        player.switchSprite("run");
    } else if (keys.d.pressed && player.lastKey === "d") {
        player.velocity.x = 5;
        player.switchSprite("run");
    } else {
        player.switchSprite("idle");
    }

    if (player.velocity.y < 0) {
        player.switchSprite("jump");
    } else if (player.velocity.y > 0) {
        player.switchSprite("fall");
    }

    //Movimiento de enemigo
    if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
        enemy.velocity.x = -5;
        enemy.switchSprite("run");
    } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
        enemy.velocity.x = 5;
        enemy.switchSprite("run");
    } else {
        enemy.switchSprite("idle");
    }

    if (enemy.velocity.y < 0) {
        enemy.switchSprite("jump");
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite("fall");
    }

    //Check de la hitbox del golpe
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy,
        }) &&
        player.isAttacking &&
        player.framesCurrent === 4
    ) {
        enemy.takeHit();
        player.isAttacking = false;

        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
    }

    //Si el jugador falla
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false;
    }

    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player,
        }) &&
        enemy.isAttacking &&
        enemy.framesCurrent === 2
    ) {
        player.takeHit();
        enemy.isAttacking = false;

        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
    }

    //Si el jugador falla
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId });
    }
}

window.addEventListener("keydown", (event) => {
    if (!player.dead && timer > 0) {
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
                if (player.position.y >= 300)
                player.velocity.y = -20;
                break;

            case " ":
                player.attack();
                break;
        }
    }

    if (!enemy.dead && timer > 0) {
        switch (event.key) {
            case "ArrowRight":
                keys.ArrowRight.pressed = true;
                enemy.lastKey = "ArrowRight";
                break;

            case "ArrowLeft":
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = "ArrowLeft";
                break;

            case "ArrowUp":
                if (enemy.position.y >= 300)
                enemy.velocity.y = -20;
                break;

            case "Enter":
                enemy.attack();
                break;
        }
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
