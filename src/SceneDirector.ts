import * as Phaser from "phaser";
import DialogueManager from "./DialogueManager";

interface SceneEvent {
  type: string;
  [key: string]: any;
}

export interface SceneData {
  background: string;
  events: SceneEvent[];
}

class SceneDirector {
  private scene: Phaser.Scene;
  private sceneData: SceneData | null = null;
  private images: { [id: string]: Phaser.GameObjects.Image } = {};
  private eventIndex = 0;
  private dialogueManager: DialogueManager;
  private background!: Phaser.GameObjects.Image;
  private endHandler!: () => void;

  constructor(
    scene: Phaser.Scene,
    dialogueManager: DialogueManager,
    endHandler: () => void
  ) {
    this.scene = scene;
    this.dialogueManager = dialogueManager;
    this.endHandler = endHandler;
  }

  public async loadScene(sceneJsonPath: string): Promise<void> {
    console.log(`Loading scene ${sceneJsonPath}`);
    const response = await fetch(sceneJsonPath);
    this.sceneData = (await response.json()) as SceneData;
    this.eventIndex = 0;
  }

  public async startScene(): Promise<void> {
    console.log("Starting scene");
    if (!this.sceneData) {
      console.error("No scene data loaded");
      return;
    }

    // Set background image
    this.background = this.scene.add
      .image(0, 0, this.sceneData.background)
      .setOrigin(0, 0);
    this.background.setScale(this.scene.scale.width / this.background.width);
    console.log(this.sceneData.background);

    this.scene.tweens.add({
      targets: this.background,
      y: -200,
      scale: 0.9,
      duration: 20000,
    });

    // Process events
    this.processNextEvent();
  }

  private async processNextEvent(): Promise<void> {
    console.log(`Processing event ${this.eventIndex}`);
    if (!this.sceneData || this.eventIndex >= this.sceneData.events.length) {
      console.log("No more events");
      this.endHandler();
      return;
    }

    const event = this.sceneData.events[this.eventIndex];
    this.eventIndex++;

    switch (event.type) {
      case "setBackground":
        console.log(
          `setting background ${event.background}`,
          this.scene.textures.list
        );
        this.background.setTexture(event.background);
        this.scene.tweens.add({
          targets: this.background,
          y: -200,
          scale: 0.9,
          duration: 20000,
        });
        this.processNextEvent();
        break;
      case "displayImage":
        this.displayImage(event.id, event.imageKey, event.x, event.y, event.w);
        this.processNextEvent();
        break;
      case "updateImage":
        this.updateImage(event.id, event.imageKey);
        this.processNextEvent();
        break;
      case "clearImage":
        this.clearImage(event.id);
        this.processNextEvent();
        break;
      case "clearAllImages":
        this.clearAllImages();
        this.processNextEvent();
        break;
      case "dialogue":
        const speaker = event.speaker;
        const text = event.text;
        this.dialogueManager.showDialogue(text, speaker, undefined, () => {
          this.processNextEvent();
        });
        break;
      default:
        console.error(`Unknown event type: ${event.type}`);
        this.processNextEvent();
        break;
    }
  }

  private displayImage(
    id: string,
    imageKey: string,
    x: number,
    y: number,
    w?: number
  ): void {
    const image = this.scene.add.image(x, y, imageKey);
    if (w) {
      const scale = w / image.width;
      image.setScale(scale);
    }
    this.images[id] = image;
  }

  private updateImage(id: string, imageKey: string): void {
    const image = this.images[id];
    if (image) {
      image.setTexture(imageKey);
    } else {
      console.error(`Image with id '${id}' not found`);
    }
  }

  private clearImage(id: string): void {
    const image = this.images[id];
    if (image) {
      image.destroy();
      delete this.images[id];
    } else {
      console.error(`Image with id '${id}' not found`);
    }
  }

  private clearAllImages(): void {
    for (const id in this.images) {
      this.images[id].destroy();
    }
    this.images = {};
  }
}

export default SceneDirector;
