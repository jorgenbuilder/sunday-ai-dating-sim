import * as Phaser from "phaser";
import SceneDirector from "./SceneDirector";
import DialogueManager from "./DialogueManager";
import { BaseScene } from "./baseScene";

class OpeningSequence extends BaseScene {
  private sceneDirector!: SceneDirector;
  private dialogueManager!: DialogueManager;

  constructor() {
    super("OpeningSequenceScene");
  }

  preload() {
    // Load assets for the scene
    this.load.image("backgroundKey", "assets/images/background.png");
    this.load.image("imageKey1", "assets/images/title.png");
    this.load.image("imageKey2", "assets/images/title.png");
    this.load.image("background1", "assets/images/scenes/apartment-wide.png");
    this.load.image("background2", "assets/images/scenes/apartment-inside.png");
    this.load.image("background3", "assets/images/scenes/apartment-window.png");
    this.load.image(
      "background4",
      "assets/images/scenes/apartment-bedroom.png"
    );
    this.load.image("background5", "assets/images/scenes/moon.png");
    this.load.image("background6", "assets/images/scenes/dreams-1.png");
    this.load.image("background7", "assets/images/scenes/dreams-2.png");
    this.load.image("background8", "assets/images/scenes/fantasy-realm.png");
  }

  create(data: any) {
    super.create(data);
    console.log("OpeningSequence.create");
    this.dialogueManager = new DialogueManager(this);
    this.sceneDirector = new SceneDirector(this, this.dialogueManager, () => {
      console.log("Go to next scene!");
      console.log(this.scene.manager.scenes);
      this.sceneManager.changeScene("PullingCropsScene");
    });
    this.sceneDirector.loadScene("assets/data/scene1.json").then(() => {
      this.sceneDirector.startScene();
    });
  }
}

export default OpeningSequence;
