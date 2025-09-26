import Vex, {IRenderContext} from "vexflow";
import Voice = Vex.Flow.Voice;
import VF = Vex.Flow;
import Stave = Vex.Flow.Stave;
import TickContext = Vex.Flow.TickContext;
import {isStaveNote} from "./typeguard";

// TODO VF
type KeyProps = {
    key: string;
    octave: number;
    line: number;
    int_value: number;
    accidental: string;
    code: number;
    stroke: number;
    shift_right: number;
    displaced: boolean;
};

export class GridFormatter extends VF.Formatter {
    override alignRests(voices: Voice[], alignAllNotes: boolean): void {
        super.alignRests(voices, alignAllNotes);

        voices.forEach(voice => {
            voice.getTickables().forEach(currTickable => {
                if (isStaveNote(currTickable) && currTickable.isRest()) {
                    const line: number = currTickable.getLineForRest();
                    if (line === 3) { // TODO param
                        const props: KeyProps = currTickable.getKeyProps()[0];
                        props.line += 0.5; // TODO param
                        currTickable.setKeyLine(0, props.line);
                    }
                }
            });
        });
    }

    override preFormat(justifyWidth?: number, renderingContext?: IRenderContext, voicesParam?: Voice[], stave?: Stave): void {
        super.preFormat(justifyWidth, renderingContext, voicesParam, stave); // TODO nécessaire ?

        const beatTickCount: number = 4 * 4; // TODO
        const stretchFactor: number = 2;

        voicesParam?.forEach(voice => {
            voice.getTickables().forEach((currTickable, i) => {
                if (isStaveNote(currTickable)) {
                    const tickContext: TickContext = currTickable.getTickContext();
                    // const tickID: number = tickContext.getTickID(); // TODO
                    // const beatTickId: number = Math.floor(tickID / 1024);
                    const beatTickId: number = Math.floor(i);
                    if (!justifyWidth) {
                        throw new Error("Missing justifyWidth");
                    }
                    tickContext.setX(beatTickId / beatTickCount * justifyWidth * stretchFactor);
                    console.log("tickContext", tickContext);
                    // TODO il faudrait quand même calculer une width fixe pour être sûr que tout est bien aligné
                }
            });
        });
    }
}
