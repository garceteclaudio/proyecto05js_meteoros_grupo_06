export default class Escena2 extends Phaser.Scene {
  constructor() {
    super({ key: "Escena 2" });
    this.jugador = null;
    this.grupoMeteoros = null;
    this.grupoBalas = null;
    this.grupoEnemigosNave = null;
    this.boss = null; 
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
    this.bossAparecido = false;
    this.bossVelocidad = 100;
    this.generarEnemigosEvento = null;
    this.bossVidas = 10;
    this.textoVidasBoss = null;
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

        //Cuando el puntaje llegue a 50 el boss aparecerá
        if (this.puntaje === 50 && !this.bossAparecido) {
          this.aparecerBoss();
      }
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
    enemigoNave.destroy();
    bala.destroy();

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
    this.boss = this.physics.add.sprite(1000, 300, "boss");
    this.bossAparecido = true;

    this.textoVidasBoss = this.add.text(16, 64, `Vidas del Boss: ${this.bossVidas}`, {
      fontSize: "24px",
      fill: "#fff",
    });

    //Manejo del evento para generar más enemigos cuando aparezca el boss
    if (this.generarEnemigosEvento) {
      this.generarEnemigosEvento.remove();
    }

    this.generarEnemigosEvento = this.time.addEvent({
      delay: 500,
      callback: this.generarEnemigosNave,
      callbackScope: this,
      loop: true,
    });

   //Configura la colisión atrasada entre las balas del jugador y el boss
    setTimeout(() => {

      this.physics.add.collider(
        this.grupoBalas,
        this.boss,
        this.destruirBoss,
        null,
        this
      );
    }, 5000);
  }

  destruirBoss(bala, boss) {
    this.bossVidas--;

    this.crearExplosion(boss.x, boss.y);

    //Regenerar el boss si sus vidas no han llegado a cero
    if (this.bossVidas > 0) {
      bala.destroy();
      boss.destroy();
      this.sonidoExplosion.play();

      this.boss = this.physics.add.sprite(400, 300, "boss");
      this.bossAparecido = true;

      this.physics.add.collider(
        this.grupoBalas,
        this.boss,
        this.destruirBoss,
        null,
        this
      );

      this.textoVidasBoss.setText(`Vidas del Boss: ${this.bossVidas}`);
    } else {
      //Destruir el boss de forma definitiva y mostrar la escena de victoria
      boss.destroy();
      bala.destroy();
      this.sonidoExplosion.play();
      this.boss = null;

      this.textoVidasBoss.destroy();
      this.textoVidasBoss = null;

      this.musicaFondo.stop();
      this.scene.start("YouWin", { puntaje: this.puntaje });
    }
  }

  //Mostrar una pequeña explosión cuanod una bala colisione con el boss
  crearExplosion(x, y) {
    const explosion = this.add.sprite(x, y, "contacto");
    explosion.setOrigin(0.5, 0.5);
    explosion.setScale(0.5);
  
    this.time.delayedCall(300, () => {
      explosion.destroy();
    });
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
    this.load.image("boss", "/public/resources/images/boss.png");
    this.load.audio("musicaFondo", "/public/resources/sounds/9.mp3");
    this.load.audio("grito", "/public/resources/sounds/grito.mp3");
    this.load.audio("balaSonido", "/public/resources/sounds/balaSonido.mp3");
    this.load.audio("sonidoExplosion","/public/resources/sounds/sonidoExplosion.mp3");
    this.load.image("contacto", "/public/resources/images/contacto.png");
  }

  create() {
    this.juegoTerminado = false;
    this.bossAparecido = false;
    this.puntaje = 0;
    this.bossVidas = 10;

    this.fondoEspacio = this.add.tileSprite(400, 300, 800, 600, "espacio");
    this.jugador = this.physics.add.sprite(100, 300, "nave", 0);
    this.jugador.setCollideWorldBounds(true);
    this.jugador.setAngle(90);

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

    this.time.addEvent({
      delay: 4000,
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

    //INICIO | Colisiones
    this.physics.add.collider(
      this.jugador,
      this.grupoMeteoros,
      (jugador, meteoro) => {
        meteoro.destroy();
        this.scene.start("GameOver", { puntaje: this.puntaje });
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

    //FIN | Colisiones
 
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

    //Manejo del movimiento de aparición del boss
    if (this.bossAparecido && this.boss) {
      if (this.boss.x > 600) {
        this.boss.x -= this.bossVelocidad * this.game.loop.delta / 1000; // Mueve el boss hacia la izquierda
      } else {
        this.boss.x = 600;
      }
    }
  }
}