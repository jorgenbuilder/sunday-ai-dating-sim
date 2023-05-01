import { BaseScene } from "./baseScene";

export default class PullingCropsScene extends BaseScene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private crops?: Phaser.Physics.Arcade.Group;
  private score: number = 0;
  private timer!: Phaser.Time.TimerEvent;
  private proximityThreshold: number = 50;
  private scoreText!: Phaser.GameObjects.Text;
  private activeCrops: number = 0;
  private isMoving: boolean = false;
  private target!: [number, number];
  private readonly minCropDistance: number = 100;

  constructor() {
    super("PullingCropsScene");
  }

  preload() {
    this.load.image("playerSprite", "assets/images/player.png");
    this.load.image("cropSprite", "assets/images/crop.png");
  }

  create() {
    // Create player avatar sprite
    this.player = this.physics.add.sprite(400, 300, "playerSprite");
    this.player.setScale(0.1, 0.1);
    this.player.setInteractive();

    // Register click input event
    this.input.on("pointerup", (pointer: any) => {
      this.isMoving = true;
      this.physics.moveTo(this.player, pointer.x, pointer.y, 200);
      this.target = [pointer.x, pointer.y];
    });

    // Set up crop spawning timer
    this.timer = this.time.addEvent({
      delay: 2000, // Spawn every 2 seconds
      loop: true,
      callback: this.spawnCrop,
      callbackScope: this,
    });

    this.scoreText = this.add
      .text(this.scale.width - 20, 20, "Score: 0", {
        fontSize: "20px",
        color: "#ffffff",
      })
      .setOrigin(1, 0.5);

    // Set up timer
    let gameDurationSeconds = 30;
    const timerText = this.add.text(20, 20, `Time: ${gameDurationSeconds}`, {
      fontSize: "20px",
      color: "#ffffff",
    });
    this.timer = this.time.addEvent({
      delay: 1000, // Update every second
      loop: true,
      callback: () => {
        gameDurationSeconds--;
        timerText.setText(`Time: ${gameDurationSeconds}`);

        if (gameDurationSeconds <= 0) {
          this.timer.remove(false);
          this.endGame();
        }
      },
      callbackScope: this,
    });
  }

  spawnCrop() {
    if (!this.crops) {
      this.crops = this.physics.add.group();
    }

    if (this.activeCrops >= 4) {
      return; // Exit the method if the maximum number of crops is already active
    }

    let isOverlap = true;
    let x, y;

    // Generate random position within the game bounds
    // Keep generating new coordinates until the crop is not overlapping with existing crops
    while (isOverlap) {
      isOverlap = false;
      x = Phaser.Math.Between(100, this.cameras.main.width - 100);
      y = Phaser.Math.Between(100, this.cameras.main.height - 100);

      // Check the distance between the new crop and existing crops
      for (const existingCrop of this.crops.getChildren() as Phaser.GameObjects.Sprite[]) {
        const distance = Phaser.Math.Distance.Between(
          x,
          y,
          existingCrop.x,
          existingCrop.y
        );
        if (distance < this.minCropDistance) {
          isOverlap = true;
          break;
        }
      }
    }

    // Create a crop sprite at the generated position
    const crop = this.crops.create(x, y, "cropSprite");
    crop.setScale(0.05, 0.05);
    crop.setInteractive();

    const clicksRequired = Phaser.Math.Between(5, 10); // Generate a random number of clicks required

    crop.clicksRemaining = clicksRequired; // Store the remaining clicks required in the crop object

    const numberText = this.add.text(
      crop.x,
      crop.y - 50,
      crop.clicksRemaining.toString(),
      {
        fontSize: "24px",
        color: "#ffffff",
        align: "center",
      }
    );
    numberText.setAlpha(0);
    numberText.setOrigin(0.5);

    crop.numberText = numberText; // Store the reference to the number text in the crop object

    // Increase the active crops count
    this.activeCrops++;

    // Register tap input event for crop interaction
    crop.on("pointerdown", () => {
      // Calculate the distance between the player and the crop
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        crop.x,
        crop.y
      );

      // Update the text value
      if (distance <= this.proximityThreshold && crop.clicksRemaining > 0) {
        crop.clicksRemaining--;
        crop.numberText.setText(crop.clicksRemaining.toString());
        if (crop.clicksRemaining === 0) {
          crop.numberText.destroy();
          crop.destroy();
          this.score++;
          this.updateScoreText();
          this.activeCrops--; // Decrement the active crops count
        }
      } else {
        crop.numberText.setAlpha(1).setPosition(crop.x, crop.y - 50);
      }
    });
  }

  updateScoreText() {
    this.scoreText.setText(`Score: ${this.score}`);
  }

  endGame() {
    // Game over logic
    console.log(`Game over! Score: ${this.score}`);
  }

  update() {
    if (this.isMoving) {
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.target[0],
        this.target[1]
      );
      if (distance < 5) {
        this.player.body!.reset(this.player.x, this.player.y);
        this.isMoving = false;
      }
    }
  }
}
