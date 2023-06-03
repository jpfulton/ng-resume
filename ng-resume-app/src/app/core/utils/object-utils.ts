/* eslint-disable jsdoc/require-param-type */

/**
 * Utility function to remove properties from an object that have either
 * a null or undefined value.
 * @param obj Input object for scrubbing.
 */
export function scrubProperties(obj: { [x: string]: unknown; }) : void {
    Object.keys(obj)
        .forEach(key => {
            if (obj[key] === null || obj[key] === undefined) {
                delete obj[key];
            }
    });
}