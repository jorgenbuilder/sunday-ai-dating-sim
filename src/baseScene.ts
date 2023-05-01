import * as Phaser from "phaser";
import SceneManager from "./SceneManager";

export class BaseScene extends Phaser.Scene {
  sceneManager!: SceneManager;

  create(data: any) {
    this.sceneManager = new SceneManager(this.game);
  }
}
