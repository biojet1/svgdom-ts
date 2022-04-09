import tap from "tap";
import { Document, SVGDocument } from "../dist/document.js";
import { ParentNode } from "../dist/parent-node.js";
import { DOMParser } from "../dist/dom-parse.js";
import { SVGLength } from "../dist/svg/element.js";
import { Path } from "svggeom";
import fs from "fs";

const parser = new DOMParser();

tap.test("Use", function (t) {
	const doc = parser.parseFromString(`
<svg viewBox="0 0 30 10" xmlns="http://www.w3.org/2000/svg">
  <circle id="myCircle" cx="5" cy="5" r="4" stroke="blue"/>
  <use id="use1" href="#myCircle" x="10" fill="blue"/>
  <use id="use2" href="#myCircle" x="20" fill="white" stroke="red"/>
  <!--
stroke="red" will be ignored here, as stroke was already set on myCircle.
Most attributes (except for x, y, width, height and (xlink:)href)
do not override those set in the ancestor.
That's why the circles have different x positions, but the same stroke value.
  -->
</svg>
		`);
	const top = doc.documentElement;
	const myCircle = doc.getElementById("myCircle");
	const use1 = doc.getElementById("use1");
	const use2 = doc.getElementById("use2");

	t.same(use1.refElement().id, "myCircle");
	t.same(use2.refElement().id, "myCircle");
	t.same(use2.refElement().id, "myCircle");

	t.same(myCircle.shapeBox().toArray(), [5 - 4, 5 - 4, 4 * 2, 4 * 2]);
	t.same(use1.shapeBox().toArray(), [11, 1, 8, 8]);
	t.same(use2.shapeBox().toArray(), [21, 1, 8, 8]);

	t.end();
});

tap.test("size", function (t) {
	const doc = parser.parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" width="2in" height="3in"/>`);
	const top = doc.documentElement;
	t.same(top.shapeBox().toArray(), [0, 0, 2*96, 3*96]);
	t.end();
});

tap.test("Use+Symbol", function (t) {
	const doc = parser.parseFromString(
		fs.readFileSync("test/res/symbol.svg", { encoding: "utf-8" })
	);
	const top = doc.documentElement;
	const myDot = doc.getElementById("myDot");
	const U1 = doc.getElementById("U1");
	const U2 = doc.getElementById("U2");
	const U3 = doc.getElementById("U3");
	const U4 = doc.getElementById("U4");
	const U5 = doc.getElementById("U5");
	t.same(U1.refElement().id, "myDot");
	t.same(U5.refElement().id, "myDot");
	t.same(U1.shapeBox().toArray(), [5, 5, 10, 10]);
	t.same(U2.shapeBox().toArray(), [20, 5, 10, 10]);
	t.same(U3.shapeBox().toArray(), [35, 5, 10, 10]);
	t.same(U4.shapeBox().toArray(), [50, 5, 10, 10]);
	t.same(U5.shapeBox().toArray(), [65, 5, 10, 10]);
	t.end();
});


