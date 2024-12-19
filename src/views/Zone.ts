import { lego } from '@armathai/lego';
import { Container, Point, Sprite, Texture } from 'pixi.js';
import { Images } from '../assets';
import { BoardEvents } from '../events/MainEvents';
import { ZoneModel } from '../models/ZoneModel';
import { makeSprite } from '../utils';

export class Zone extends Container {
    private plus: Sprite;
    private line: Sprite;
    private furniture: Sprite;

    constructor(private config: ZoneModel) {
        super();

        this.build();
    }

    get zoneNumber(): number {
        return this.config.zoneNumber;
    }

    get uuid(): string {
        return this.config.uuid;
    }

    public enableInteractive(): void {
        this.line.interactive = true;
    }

    public disableInteractive(): void {
        this.line.interactive = false;
    }

    public buildFurniture({ x, y, type }): void {
        const itemName = `zone_${this.zoneNumber}_${type}`;
        const texture = Images[`interior/${itemName}`];

        if (this.furniture) {
            this.furniture.texture = Texture.from(texture);
        } else {
            this.furniture = makeSprite({
                texture,
                anchor: new Point(0.5, 0.5),
            });
            this.furniture.position.set(x, y);
        }
        this.addChild(this.furniture);
    }

    private build(): void {
        this.buildLines();

        this.config.selectedItem ? this.buildFurniture(this.config.selectedItem) : this.buildPlus();
    }

    private buildLines(): void {
        this.line = makeSprite({ texture: Images[`lines/line${this.zoneNumber}`], anchor: new Point(0.5, 0.5) });
        this.line.interactive = true;
        this.line.on('pointerdown', () => {
            lego.event.emit(BoardEvents.ZoneClicked, this.zoneNumber);
        });
        this.addChild(this.line);
    }

    private buildPlus(): void {
        this.plus = makeSprite({ texture: Images['ui/plus'], anchor: new Point(0.5, 0.5) });
        this.plus.scale.set(1.2);
        this.addChild(this.plus);
    }
}