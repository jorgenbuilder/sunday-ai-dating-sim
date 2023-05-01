import * as Phaser from "phaser";

declare module "phaser" {
  interface Scene {
    sceneManager: SceneManager;
  }
}
