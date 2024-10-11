export default class Escena2 extends Phaser.Scene {
  constructor() {
    super({ key: "Escena 2" });
    this.jugador = null;
    this.grupoMeteoros = null;
    this.grupoBalas = null;
    this.grupoEnemigosNave = null;
    this.cursors = null;
    this.teclas = null;
    this.puntaje = 0;
    this.textoDePuntaje = null;
    this.juegoTerminado = false;
    this.musicaFondo = null;
    this.sonidoGrito = null;
    this.siguienteDisparo = 0;
    this.sonidoBala = null;
    this.sonidoExplosion = null;
    this.fondoEspacio = null;
    this.boss = null; // Boss enemy
    this.grupoBalasBoss = null; // Group for boss bullets
    this.siguienteDisparoBoss = 0; // Next bullet firing time for the boss
  }
  generarMeteoros() {
    if (this.juegoTerminado) return;

    const y = Phaser.Math.Between(0, 600);
    const meteoro = this.grupoMeteoros.create(800, y, "meteoro");
    meteoro.setVelocityX(-200);
  }

  dispararBala() {
    const tiempoActual = this.time.now;

    if (tiempoActual > this.siguienteDisparo) {
      const bala = this.grupoBalas.get(this.jugador.x + 50, this.jugador.y);

      if (bala) {
        bala.setActive(true);
        bala.setVisible(true);
        bala.setVelocityX(500);
        this.siguienteDisparo = tiempoActual + 300;

        this.sonidoBala.play();
      }
    }
  }
  destruirMeteoro(bala, meteoro) {
    meteoro.destroy();
    bala.destroy();
    this.sonidoExplosion.play();
  }

  incrementarPuntaje() {
    if (!this.juegoTerminado) {
      this.puntaje += 1;
      this.textoDePuntaje.setText(`Puntaje: ${this.puntaje}`);
    }
  }

  generarEnemigosNave() {
    if (this.juegoTerminado) return;

    const y = Phaser.Math.Between(50, 550);
    const enemigoNave = this.grupoEnemigosNave.create(800, y, "enemigoNave");
    enemigoNave.setVelocityX(-150);
    enemigoNave.vidas = 3;
  }

  colisionBalaEnemigo(bala, enemigoNave) {
    /* enemigoNave.vidas -= 1; // Reducir una vida por disparo
    bala.destroy();

    if (enemigoNave.vidas <= 0) {
      enemigoNave.destroy();
      this.sonidoExplosion.play();
    }*/
    // Destruir meteoro y bala
    enemigoNave.destroy();
    bala.destroy();

    // Reproducir el sonido de la bala
    this.sonidoExplosion.play();
  }

  colisionJugadorEnemigo(jugador, enemigoNave) {
    this.scene.start("GameOver", { puntaje: this.puntaje });
    this.musicaFondo.stop();
    this.puntaje = 0;
    this.juegoTerminado = true;
    enemigoNave.destroy();
  }

  aparecerBoss() {
    this.boss = this.physics.add.sprite(
      800,
      Phaser.Math.Between(50, 550),
      "boss"
    );
    this.boss.setVelocityX(-200); // Move the boss left
    this.grupoBalasBoss = this.physics.add.group(); // Initialize the bullets group

    // Start shooting bullets every second
    this.time.addEvent({
      delay: 100,
      callback: this.dispararBalaBoss,
      callbackScope: this,
      loop: true,
    });
  }

  dispararBalaBoss() {
    const tiempoActual = this.time.now;

    if (tiempoActual > this.siguienteDisparoBoss) {
      // Get a bullet from the existing grupoBalas
      const balaBoss = this.grupoBalasBoss.get(this.boss.x - 50, this.boss.y);

      if (balaBoss) {
        balaBoss.setActive(true);
        balaBoss.setVisible(true);
        balaBoss.setVelocityX(-200); // Bullet moves to the left
        this.siguienteDisparoBoss = tiempoActual + 500; // Next shot in 1 second
        //this.sonidoBala.play(); // Optional: Play the bullet sound
      }
    }
  }

  colisionJugadorBoss(jugador, boss) {
    // Handle player collision with boss
    this.scene.start("GameOver", { puntaje: this.puntaje });
    this.musicaFondo.stop();
    this.puntaje = 0;
    this.juegoTerminado = true;
  }

  preload() {
    this.load.image("espacio", "/public/resources/images/espacio.png");
    this.load.spritesheet("nave", "/public/resources/images/nave.png", {
      frameWidth: 60,
      frameHeight: 60,
    });
    this.load.image("meteoro", "/public/resources/images/meteoro.png");
    this.load.image("bala2", "/public/resources/images/balaHorizontal.png");
    this.load.image("enemigoNave", "/public/resources/images/enemigoNave.png");
    this.load.audio("musicaFondo", "/public/resources/sounds/9.mp3");
    this.load.audio("grito", "/public/resources/sounds/grito.mp3");
    this.load.audio("balaSonido", "/public/resources/sounds/balaSonido.mp3");
    this.load.audio(
      "sonidoExplosion",
      "/public/resources/sounds/sonidoExplosion.mp3"
    );
    this.load.image("boss", "/public/resources/images/boss.png");
  }

  create() {
    // Reiniciar variables importantes
    this.juegoTerminado = false;
    this.puntaje = 0;

    // Crear fondo como tileSprite
    this.fondoEspacio = this.add.tileSprite(400, 300, 800, 600, "espacio");
    this.jugador = this.physics.add.sprite(100, 300, "nave", 0);
    this.jugador.setCollideWorldBounds(true);
    this.jugador.setAngle(90);

    this.time.delayedCall(3000, this.aparecerBoss, [], this);

    this.grupoBalas = this.physics.add.group({
      defaultKey: "bala2",
      maxSize: 50,
    });

    this.grupoMeteoros = this.physics.add.group();
    this.grupoEnemigosNave = this.physics.add.group();

    this.anims.create({
      key: "izquierda",
      frames: [{ key: "nave", frame: 1 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "normal",
      frames: [{ key: "nave", frame: 0 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "derecha",
      frames: [{ key: "nave", frame: 2 }],
      frameRate: 20,
    });

    // Generar enemigosNave periódicamente
    this.time.addEvent({
      delay: 1000,
      callback: this.generarEnemigosNave,
      callbackScope: this,
      loop: true,
    });

    this.time.addEvent({
      delay: 1000,
      callback: this.generarMeteoros,
      callbackScope: this,
      loop: true,
    });
    this.incrementoPuntajeEvento = this.time.addEvent({
      delay: 100,
      callback: this.incrementarPuntaje,
      callbackScope: this,
      loop: true,
    });
    this.cursors = this.input.keyboard.createCursorKeys();

    this.teclas = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    // Colisiones
    this.physics.add.collider(
      this.jugador,
      this.grupoMeteoros,
      (jugador, meteoro) => {
        meteoro.destroy();
        this.scene.start("GameOver", { puntaje: this.puntaje }); // Inicia la escena GameOver y pasa el puntaje
        this.musicaFondo.stop();
        this.puntaje = 0;
      },
      null,
      this
    );
    this.physics.add.collider(
      this.grupoBalas,
      this.grupoMeteoros,
      this.destruirMeteoro,
      null,
      this
    );

    this.physics.add.collider(
      this.jugador,
      this.grupoEnemigosNave,
      this.colisionJugadorEnemigo,
      null,
      this
    );

    this.physics.add.collider(
      this.grupoBalas,
      this.grupoEnemigosNave,
      this.colisionBalaEnemigo,
      null,
      this
    );
    /*
    this.physics.add.collider(
      this.jugador,
      this.grupoBalasBoss,
      this.colisionJugadorBalaBoss,
      null,
      this
    );
*/
    // FIN COLISIONES
    this.textoDePuntaje = this.add.text(16, 16, "Puntaje: 0", {
      fontSize: "32px",
      fill: "#fff",
    });

    this.musicaFondo = this.sound.add("musicaFondo", { loop: true });
    this.musicaFondo.play();
    this.sonidoGrito = this.sound.add("grito");
    this.sonidoBala = this.sound.add("balaSonido");
    this.sonidoExplosion = this.sound.add("sonidoExplosion");
  }

  update() {
    if (this.juegoTerminado) return;

    // Mover el fondo hacia la izquierda
    this.fondoEspacio.tilePositionX -= 2;

    this.jugador.setVelocity(0);

    if (this.cursors.left.isDown || this.teclas.left.isDown) {
      this.jugador.setVelocityX(-300);
      this.jugador.anims.play("izquierda", true);
    } else if (this.cursors.right.isDown || this.teclas.right.isDown) {
      this.jugador.setVelocityX(300);
      this.jugador.anims.play("derecha", true);
    } else if (this.cursors.up.isDown || this.teclas.up.isDown) {
      this.jugador.setVelocityY(-300);
      this.jugador.anims.play("normal", true);
    } else if (this.cursors.down.isDown || this.teclas.down.isDown) {
      this.jugador.setVelocityY(300);
      this.jugador.anims.play("normal", true);
    } else {
      this.jugador.anims.play("normal", true);
    }

    if (this.teclas.space.isDown) {
      this.dispararBala();
    }
  }
}
