import Vex, {IRenderContext} from "vexflow";
import {sequence} from "./utils";
import VF = Vex.Flow;

type StaveOptions = any; // TODO
type VoiceTime = any; // TODO
type BeatType = "down" | "up";

export class GridStave extends VF.Stave {

    constructor(x: number, y: number, width: number, options?: StaveOptions) {
        super(x, y, width, {
            // numLines: 4,
            ...options
        });
        this.setX(0);
        this.setNoteStartX(0);
    }

    override draw(): void {
        const ctx: IRenderContext = this.getContext();

        const voiceTime: VoiceTime = {
            numBeats: 4,
            beatValue: 4,
        };
        const upBeatValue: number = voiceTime.beatValue / 2;
        const count: number = voiceTime.numBeats * voiceTime.beatValue;
        const beatWidth: number = this.getWidth() / count;
        ctx.openGroup("stave-beats");
        sequence(count).forEach(i => {
            let beatType: BeatType | undefined;
            if (i % voiceTime.beatValue === 0) {
                beatType = "down";
            }
            if (i % voiceTime.beatValue === upBeatValue) {
                beatType = "up";
            }
            if (beatType) {
                this.drawBeat(beatWidth * i + this.getX(), beatWidth, beatType);
            }
        });
        ctx.closeGroup();

        super.draw();
    }

    private drawBeat(x: number, beatWidth: number, type: BeatType): void {
        const ctx: IRenderContext = this.getContext();

        // const lineWidth: number = this.getStyle().lineWidth ?? 1; // TODO
        const lineWidth: number = 1;
        const lineWidthCorrection: number = lineWidth % 2 === 0 ? 0 : 0.5;

        const left: number = x;
        const middle: number = left + beatWidth / 2;
        const right: number = left + beatWidth;

        const above: number = this.getYForLine(-1) + lineWidthCorrection;
        const topLine: number = this.getYForLine(0) + lineWidthCorrection;
        const bottomLine: number = this.getYForLine(3) + lineWidthCorrection;
        const below: number = this.getYForLine(4) + lineWidthCorrection;

        ctx.beginPath();
        ctx.moveTo(left, topLine);
        ctx.lineTo(left, bottomLine);
        if (type === "down") {
            ctx.lineTo(middle, below);
        }
        ctx.lineTo(right, bottomLine);
        ctx.lineTo(right, topLine);
        if (type === "up") {
            ctx.lineTo(middle, above);
        }
        this.fill({
            fill: type === "down" ? "#DDD" : "#EEE",
            stroke: "none",
        }, ctx);
    }

    private fill(param: { fill: string, stroke: string }, ctx: IRenderContext): void {
        ctx.save();
        ctx.setFillStyle(param.fill);
        ctx.setStrokeStyle(param.stroke);
        ctx.fill();
        ctx.restore();
    }
}
