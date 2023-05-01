import Phaser from "phaser";

export default class SceneManager {
  private game: Phaser.Game;

  constructor(game: Phaser.Game) {
    this.game = game;
  }

  public startScene(sceneKey: string, data?: any) {
    this.game.scene.start(sceneKey, data);
  }

  public stopScene(sceneKey: string) {
    this.game.scene.stop(sceneKey);
  }

  public pauseScene(sceneKey: string) {
    this.game.scene.pause(sceneKey);
  }

  public resumeScene(sceneKey: string, data?: any) {
    this.game.scene.resume(sceneKey, data);
  }

  public changeScene(newSceneKey: string, data?: any) {
    // Stop the current scene
    this.stopScene(this.game.scene.getScenes(true)[0].scene.key);

    // Start the new scene
    this.startScene(newSceneKey);
  }
}
