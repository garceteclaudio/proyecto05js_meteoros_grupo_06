export default class AdminEscenas {
  constructor(game) {
    this.game = game;

    this.boton1 = document.getElementById("boton-1");
    this.boton2 = document.getElementById("boton-2");

    this.boton1.addEventListener("click", () => {
      this.cambiarEscena("Escena 1");
    });

    this.boton2.addEventListener("click", () => {
      this.cambiarEscena("Escena 2");
    });
  }

  pausarMusicaFondo() {
    const escenasActivas = this.game.scene.getScenes(true);
    escenasActivas.forEach((escena) => {
      if (escena.musicaFondo && escena.musicaFondo.isPlaying) {
        escena.musicaFondo.stop();
      }
    });
  }

  detenerEscenasActivas() {
    const escenasActivas = this.game.scene.getScenes(true);
    escenasActivas.forEach((escena) => {
      this.game.scene.stop(escena.scene.key);
    });
  }

  cambiarEscena(escenaKey) {
    this.pausarMusicaFondo();
    this.detenerEscenasActivas();
    this.game.scene.start(escenaKey);
  }
}
