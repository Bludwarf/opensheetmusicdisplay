import Vex from "vexflow";
import StaveNote = Vex.Flow.StaveNote;

/**
 * Use instead of `instanceof` as a more flexible type guard.
 * @param obj check if this object's CATEGORY matches the provided category.
 * @param constructorFcnName a string representing a category of VexFlow objects.
 * @param checkAncestors defaults to `true`, so we walk up the prototype chain to look for a matching `CATEGORY`.
 *        If `false`, we do not check the superclass or other ancestors.
 * @returns true if `obj` has a static `CATEGORY` property that matches `category`.
 */
export function isCategory<T>(obj: any, constructorFcnName: string, checkAncestors: boolean = true): obj is T {
    // obj is undefined, a number, a primitive string, or null.
    if (typeof obj !== "object" || obj === null) {
        return false;
    }

    // `obj.constructor` is a reference to the constructor function that created the `obj` instance.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor
    let constructorFcn: Function = obj.constructor;

    if (checkAncestors) {
        // Walk up the prototype chain to look for a matching obj.constructor.CATEGORY.
        while (obj !== null) {
            constructorFcn = obj.constructor;
            if (constructorFcn.name === constructorFcnName) {
                return true;
            }
            obj = Object.getPrototypeOf(obj);
        }
        return false;
    } else {
        // Do not walk up the prototype chain. Just check this particular object's static .CATEGORY string.
        return constructorFcn.name === constructorFcnName;
    }
}

export const isStaveNote: (obj: unknown) => obj is Vex.Flow.StaveNote = (obj: unknown): obj is StaveNote => isCategory(obj, StaveNote.name);
