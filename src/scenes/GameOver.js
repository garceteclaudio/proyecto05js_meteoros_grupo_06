export default class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: "GameOver" });
  }

  preload() {
    this.load.image(
      "fondoGameOver",
      "/public/resources/images/fondoGameOver.png"
    );
  }

  init(data) {
    this.puntaje = data.puntaje || 0;
  }

  create() {
    this.add.image(400, 300, "fondoGameOver").setOrigin(0.5);

    this.add
      .text(400, 250, `¡Has muerto! Juego Terminado.`, {
        fontSize: "30px",
        fill: "#fff",
        fontStyle: "bold",
        aling: "center",
      })
      .setOrigin(0.5);

    this.add
      .text(400, 300, `Puntaje: ${this.puntaje}`, {
        fontSize: "30px",
        fill: "#fff",
        fontStyle: "bold",
        aling: "center",
      })
      .setOrigin(0.5);

      this.add
      .text(400, 350, "Escoge una escena para intentarlo de nuevo.", {
        fontSize: "20px",
        fill: "#fff",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);
  }
}