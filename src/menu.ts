import { HexGrid } from './hexGrid';
import { Button } from './util';


let tutorialTexts = [
    "Place trios of hexes to grow your town\noutward from the TOWN CENTER\n\n\nTry to get the highest score you can!",
    "STREET hexes are worth 1 point each\nif they're connected to the Town Center\n\nAdditionally, every PORT that you\nconnect to the Town Center with\nStreets is worth 3 points!",
    "WIND TURBINES are worth 1 point if\nthey're not adjacent to any other\nWind Turbines\n\nIf they're also placed on a HILL,\nthey're worth 3 points!",
    "Those are PARKS!\n\nEach group of connected Park hexes is\nworth 5 points for every 3 hexes in it",
    "Yep! To recap:\n- Streets want to connect Ports to\nthe Town Center\n- Wind Turbines want to be alone and\non Hills\n- Parks want to be grouped together\nin multiples of 3"
]

let tutorialTypes = [
    [1, 2, 3, 4, 5],
    [3, 4, 5],
    [1],
    [2],
    [1, 2, 3, 4, 5]
];

export class MenuScene extends Phaser.Scene {

    menu: Phaser.GameObjects.Group;
    background: Phaser.GameObjects.Image;
    tutorialGrid: HexGrid;
    tutorialText: Phaser.GameObjects.BitmapText;
    tutorialPage: number;
    tutorialButton: Button;

    constructor() {
        super('menu');
    }

    create() {


        
        this.cameras.main.setBounds(0, 0, 2560, 720);
        this.menu = this.add.group();

        this.background = this.add.image(720, 360, 'page');

        this.add.image(920, 360, 'blue');

        let title = this.add.bitmapText(50, 100, 'font', 'SIX-SIDED STREETS', 70);
        // title.setOrigin(0.5);
        this.menu.add(title);

        let byline = this.add.bitmapText(50, 190, 'font', 'a tile-laying game by Chris Klimowski', 40);
        // byline.setOrigin(0.5);
        this.menu.add(byline);

        let playButton = new Button(this, 300, 400, 'play-button', this.play.bind(this));
        this.menu.add(playButton);

        let howToPlayButton = new Button(this, 300, 550, 'how-to-play-button', this.howToPlay.bind(this));
        this.menu.add(howToPlayButton);

        let grid = new HexGrid(this, 3, 0, 700, 100);
        grid.grid.get(2, 2).setHill(true);
        grid.grid.get(4, 5).setHill(true);

        let tutorialGrid = [
            [null, null, null, 5,  3,  2,  5],
                [null, null, 2,  3,  2,  1,  3],
                    [null, 2,  1,  3,  2,  3,  3],
                        [5,  3,  2,  4,  2,  1,  5],
                          [2,  2,  2,  3,  3,  1, null],
                            [2,  2,  3,  1,  2, null, null],
                              [5,  3,  3,  5, null, null, null]
        ];

        this.tutorialPage = 0;
        this.tutorialText = this.add.bitmapText(1280, 200, 'font', tutorialTexts[0], 40);
        this.tutorialButton = new Button(this, 1265, 550, 'tutorial-button', this.nextTutorialPage.bind(this));
        this.tutorialButton.setOrigin(0, 0.5);

        for (let r = 0; r < tutorialGrid.length; r++) {
            for (let c = 0; c < tutorialGrid.length; c++) {
                if (grid.grid.has(r, c)) {
                    grid.grid.get(r, c).setType(tutorialGrid[r][c]);
                }
            }
        }

        grid.grid.get(0, 3).upgrade();
        grid.grid.get(0, 4).upgrade();
        grid.grid.get(0, 5).upgrade();
        grid.grid.get(1, 3).upgrade();
        grid.grid.get(1, 4).upgrade();
        grid.grid.get(1, 5).counted = true;
        grid.grid.get(2, 2).counted = true;
        grid.grid.get(2, 3).upgrade();
        grid.grid.get(2, 4).upgrade();
        grid.grid.get(3, 2).upgrade();
        grid.grid.get(4, 0).upgrade();
        grid.grid.get(4, 1).upgrade();
        grid.grid.get(4, 2).upgrade();
        grid.grid.get(4, 3).upgrade();
        grid.grid.get(4, 4).upgrade();
        grid.grid.get(5, 0).upgrade();
        grid.grid.get(5, 1).upgrade();
        grid.grid.get(5, 2).upgrade();
        grid.grid.get(5, 3).counted = true;
        grid.grid.get(6, 0).upgrade();
        grid.grid.get(6, 1).upgrade();
        grid.grid.get(6, 2).upgrade();
        grid.grid.get(6, 3).upgrade();

        grid.grid.get(0, 6).setVisible(false);
        grid.grid.get(3, 0).setVisible(false);
        grid.grid.get(3, 6).setVisible(false);

        grid.updateEdges();

        this.tutorialGrid = grid;
    }

    play() {
        this.scene.start('main');
    }

    howToPlay() {
        this.tutorialPage = -1;
        this.nextTutorialPage();
        this.cameras.main.pan(1270, 0, 1000, 'Power2');

        this.tutorialGrid.grid.get(0, 6).setVisible(true);
        this.tutorialGrid.grid.get(3, 0).setVisible(true);
        this.tutorialGrid.grid.get(3, 6).setVisible(true);
    }

    nextTutorialPage() {
        this.tutorialPage += 1;
        if (this.tutorialPage >= 5) {
            this.cameras.main.pan(0, 0, 1000, 'Power2');
            this.tutorialGrid.grid.get(0, 6).setVisible(false);
            this.tutorialGrid.grid.get(3, 0).setVisible(false);
            this.tutorialGrid.grid.get(3, 6).setVisible(false);
        } else {
            this.tutorialButton.setFrame(this.tutorialPage);
            this.tutorialText.setText(tutorialTexts[this.tutorialPage]);
            for (let hex of this.tutorialGrid.hexes) {
                hex.setSketchy(tutorialTypes[this.tutorialPage].indexOf(hex.hexType) === -1);
            }
        }
    }

    update(time: number, delta: number) {
        for (let hex of this.tutorialGrid.hexes) {
            hex.update(time, delta);
        }
    }
}