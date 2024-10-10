export default class Nave extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "nave", 0); // Super llama a Phaser.Sprite con el contexto, posición y textura

    // Agregar la nave a la escena y al sistema de físicas
    scene.add.existing(this); // Agrega el sprite a la escena
    scene.physics.add.existing(this); // Agrega el sprite al sistema de físicas

    this.setCollideWorldBounds(true);
    this.setAngle(90); // Rotación inicial

    // Referencias a controles del teclado
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.teclas = this.scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    // Definir animaciones
    this.scene.anims.create({
      key: "izquierda",
      frames: [{ key: "nave", frame: 1 }],
      frameRate: 20,
    });

    this.scene.anims.create({
      key: "normal",
      frames: [{ key: "nave", frame: 0 }],
      frameRate: 20,
    });

    this.scene.anims.create({
      key: "derecha",
      frames: [{ key: "nave", frame: 2 }],
      frameRate: 20,
    });
  }

  update() {
    this.setVelocity(0); // Resetea la velocidad

    if (this.cursors.left.isDown || this.teclas.left.isDown) {
      this.setVelocityX(-300);
      this.anims.play("izquierda", true);
    } else if (this.cursors.right.isDown || this.teclas.right.isDown) {
      this.setVelocityX(300);
      this.anims.play("derecha", true);
    } else if (this.cursors.up.isDown || this.teclas.up.isDown) {
      this.setVelocityY(-300);
      this.anims.play("normal", true);
    } else if (this.cursors.down.isDown || this.teclas.down.isDown) {
      this.setVelocityY(300);
      this.anims.play("normal", true);
    } else {
      this.anims.play("normal", true);
    }

    if (this.teclas.space.isDown) {
      this.dispararBala();
    }
  }

  dispararBala() {
    const tiempoActual = this.scene.time.now;

    if (tiempoActual > this.scene.siguienteDisparo) {
      const bala = this.scene.grupoBalas.get(this.x + 50, this.y);

      if (bala) {
        bala.setActive(true);
        bala.setVisible(true);
        bala.setVelocityX(500);
        this.scene.siguienteDisparo = tiempoActual + 300;

        this.scene.sonidoBala.play();
      }
    }
  }
}
