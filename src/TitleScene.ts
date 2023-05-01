import Phaser from "phaser";
import { BaseScene } from "./baseScene";

export default class TitleScene extends BaseScene {
  private background!: Phaser.GameObjects.Image;
  private title!: Phaser.GameObjects.Image;
  private menuItems: string[] = ["New Game", "Options"];
  private menuTexts: Phaser.GameObjects.Text[] = [];

  constructor() {
    super("TitleScene");
  }

  preload() {
    this.load.image("background", "assets/images/background.png");
    this.load.image("title", "assets/images/title.png");
  }

  create(data: any) {
    super.create(data);
    this.background = this.add
      .image(this.scale.width / 2, 0, "background")
      .setOrigin(0.5, 0);
    this.background.setScale(this.scale.width / this.background.width);
    this.title = this.add
      .image(this.scale.width / 2, this.scale.height / 4, "title")
      .setScale(0.5);
    const desiredWidth = 300;
    const scale = desiredWidth / this.title.width;
    this.title.setScale(scale);
    this.title.setAlpha(0);

    this.cameras.main.setBackgroundColor("rgb(137, 216, 235)");

    // Check if there's a saved game and add 'Continue' to the menu if there is one
    if (false) {
      this.menuItems.unshift("Continue");
    }

    this.createMenu();

    // Animate the title and background
    this.tweens.add({
      targets: this.background,
      y: -100,
      duration: 2000,
      ease: "Expo.easeOut",
    });

    this.tweens.add({
      targets: this.title,
      alpha: 1,
      duration: 2000,
      delay: 1000,
      ease: "Expo.easeOut",
    });

    for (const text of this.menuTexts) {
      this.tweens.add({
        targets: text,
        alpha: 1,
        duration: 1000,
        delay: 1500,
        ease: "Expo.easeOut",
      });
    }
  }

  private createMenu() {
    const menuX = this.scale.width / 2;
    const menuY = this.scale.height / 2 + 150;

    this.menuItems.forEach((item, index) => {
      const text = this.add.text(menuX, menuY + 50 * index, item, {
        fontFamily: "Arial",
        fontSize: "32px",
        color: "#ffffff",
      });

      text.setOrigin(0.5);
      text.setInteractive({ useHandCursor: true });
      text.setAlpha(0);

      text.on("pointerover", () => {
        text.setColor("#ff0000");
      });

      text.on("pointerout", () => {
        text.setColor("#ffffff");
      });

      text.on("pointerup", () => {
        console.log(item);
        if (item === "New Game") {
          this.sceneManager.changeScene("OpeningSequenceScene");
        } else if (item === "Options") {
          this.sceneManager.changeScene("OptionsScene");
        } else if (item === "Continue") {
          // Load the saved game and start the appropriate scene
        }
      });

      this.menuTexts.push(text);
    });
  }
}
