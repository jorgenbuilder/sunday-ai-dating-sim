import Phaser from "phaser";

export default class DialogueManager {
  private scene: Phaser.Scene;
  private dialogueBox!: Phaser.GameObjects.Rectangle;
  private dialogueText!: Phaser.GameObjects.Text;
  private portrait?: Phaser.GameObjects.Image;
  private choiceButtons: Phaser.GameObjects.Text[] = [];
  private onChoiceCallback?: (choice: string) => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public showDialogue(
    text: string,
    character?: string,
    portrait?: string,
    onCompletion?: () => void
  ) {
    const centerX = this.scene.scale.width / 2;
    const bottomY = this.scene.scale.height;

    if (!this.dialogueBox) {
      this.dialogueBox = this.scene.add
        .rectangle(centerX, bottomY, this.scene.scale.width, 200, 0x000000, 0.8)
        .setOrigin(0.5, 1);
    }
    this.dialogueBox.setVisible(true);

    if (!this.dialogueText) {
      this.dialogueText = this.scene.add
        .text(centerX, this.scene.scale.height - 190, "", {
          fontFamily: "Arial",
          fontSize: "24px",
          color: "#ffffff",
          align: "center",
          wordWrap: { width: this.scene.scale.width - 50 },
        })
        .setOrigin(0.5, 0);
    }
    const formattedText = character ? `${character}: ${text}` : text;
    this.dialogueText.setText(formattedText);
    this.dialogueText.setVisible(true);

    this.dialogueBox
      .setInteractive()
      .off("pointerup")
      .on("pointerup", () => this.onHideDialogue(), this);

    // Character portrait display
    if (portrait) {
      if (!this.portrait) {
        this.portrait = this.scene.add.image(
          centerX - this.dialogueBox.width / 2 + 100,
          bottomY - 100,
          portrait
        );
        this.portrait.setOrigin(0.5, 1);
        this.portrait.setScale(0.5);
      } else {
        this.portrait.setTexture(portrait);
      }
      this.portrait.setVisible(true);
      this.dialogueText.setX(centerX + 50);
    } else {
      if (this.portrait) {
        this.portrait.setVisible(false);
      }
      this.dialogueText.setX(centerX);
    }

    // Set up the completion callback if provided
    if (onCompletion) {
      this.onDialogueComplete = onCompletion;
    } else {
      this.onDialogueComplete = () => {};
    }
  }

  public showChoices(choices: string[]) {
    const centerX = this.scene.scale.width / 2;
    const bottomY = this.scene.scale.height - 100;

    // Remove any existing choice buttons
    this.choiceButtons.forEach((button) => {
      button.destroy();
    });
    this.choiceButtons = [];

    const buttonSpacing = 50;
    const totalButtonHeight = (choices.length - 1) * buttonSpacing;
    const startY = bottomY - totalButtonHeight - 20;

    choices.forEach((choice, index) => {
      const buttonY = startY + index * buttonSpacing;
      const button = this.createChoiceButton(choice, centerX, buttonY);
      this.choiceButtons.push(button);
    });
  }

  hideDialogue() {
    // Hide the dialogue box and clear the dialogue text
    this.dialogueBox.setVisible(false);
    this.dialogueText.setVisible(false);

    // Clear any existing completion callback
    this.onHideDialogue = () => {};
  }

  private onDialogueComplete: () => void = () => {};

  public onHideDialogue() {
    this.onDialogueComplete();
  }

  public onChoiceSelected(callback: (choice: string) => void) {
    this.onChoiceCallback = callback;
  }

  private createChoiceButton(text: string, x: number, y: number) {
    const button = this.scene.add.text(x, y, text, {
      fontFamily: "Arial",
      fontSize: "24px",
      color: "#ffffff",
      backgroundColor: "#000000",
      padding: { left: 10, right: 10, top: 5, bottom: 5 },
    });

    button.setInteractive({ useHandCursor: true });
    button.off("pointerup");
    button.on("pointerup", () => {
      if (this.onChoiceCallback) {
        this.onChoiceCallback(text);
      }
    });

    return button;
  }
}
