import { scrubProperties } from "./object-utils";

describe("Object Utility Functions", () => {

    it("scrubProperties removes properties with null or undefined values", () => {
        const inputObject = {
            a: true,
            b: 1,
            c: "some string",
            d: ["one", "two"],
            e: [],
            f: null,
            g: undefined
        };

        scrubProperties(inputObject);

        const keys = Object.keys(inputObject);
        expect(keys.length).toEqual(5);
        
        expect(keys).toContain("a");
        expect(keys).toContain("b");
        expect(keys).toContain("c");
        expect(keys).toContain("d");
        expect(keys).toContain("e");

        expect(inputObject["a"]).toEqual(true);
        expect(inputObject["b"]).toEqual(1);
        expect(inputObject["c"]).toEqual("some string");
        expect(inputObject["d"]).toEqual(["one", "two"]);
        expect(inputObject["e"]).toEqual([]);
    });

});
