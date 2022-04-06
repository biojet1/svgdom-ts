const BOTH_MATCH =
	/^\s*(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)\s*(in|pt|px|mm|cm|m|km|Q|pc|yd|ft||%|em|ex|ch|rem|vw|vh|vmin|vmax|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)\s*$/i;
const CONVERSIONS: { [k: string]: number } = {
	in: 96.0,
	pt: 1.3333333333333333,
	px: 1.0,
	mm: 3.779527559055118,
	cm: 37.79527559055118,
	m: 3779.527559055118,
	km: 3779527.559055118,
	Q: 0.94488188976378,
	pc: 16.0,
	yd: 3456.0,
	ft: 1152.0,
	"": 1.0,
};

export function userUnit(src: string, default_value?: number): number {
	if (src) {
		const m = src.match(BOTH_MATCH);
		if (m) {
			const value = parseFloat(m[1]);
			const unit = m.pop();
			if (unit) {
				const mul = CONVERSIONS[unit];
				if (mul) {
					return value * mul;
				}
			} else {
				return value;
			}
			throw new Error(`Can not convert to user unit ${src}, [${m}]`);
		} else {
			throw new Error(`Invalid unit ${src}`);
		}
	} else if (default_value !== undefined) {
		return default_value;
	}
	throw new Error(`Invalid unit ${src}`);
}

const UNITS = ["", "", "%", "em", "ex", "px", "cm", "mm", "in", "pt", "pc"];
const CONVS = [0, 1, 1];

export class SVGLength {
	_unit?: number;
	_num?: number;

	constructor(value?: string) {
		// this._num = 0;
		// this._unit = 1;
		if (value) this.valueAsString = value;
	}

	get unitType() {
		const { _unit = 1 } = this;
		return _unit;
	}

	get valueInSpecifiedUnits() {
		return this._num ?? 0;
	}

	set valueInSpecifiedUnits(value: number) {
		if (isFinite(value)) {
			this._num = value;
		} else {
			throw new TypeError();
		}
	}

	get valueAsString() {
		const { _num = 0, _unit = 1 } = this;
		return `${_num}${UNITS[_unit] || ""}`;
	}

	set valueAsString(value: string) {
		const m = BOTH_MATCH.exec(value);
		if (m) {
			const num = parseFloat(m[1]);
			const unit = UNITS.indexOf((m.pop() || "").toLowerCase());
			if (unit >= 0) {
				this._num = num;
				this._unit = unit;
				return;
			}
		}
		delete this._num;
		delete this._unit;
		throw DOMException.new("SyntaxError");
	}

	get value() {
		const { _num = 0, _unit = 1 } = this;

		switch (_unit) {
			case 0:
			case 1:
			case 5:
				return _num;
			case 2: // "%"
			case 3: //  "em"
			case 4: //  "ex"
				throw DOMException.new("NotSupportedError");
			case 6:
				return (_num * 4800) / 127;
			case 7:
				return (_num * 480) / 127;
			case 8:
				return _num * 96;
			case 9:
				return (_num * 4) / 3;
			case 10:
				return _num * 16;
			default:
				throw new TypeError(`invalid ${_unit}`);
		}
	}

	set value(value: number) {
		let { _num = 0, _unit = 1 } = this;
		if (isFinite(value)) {
			switch (_unit) {
				case 0:
				case 1:
				case 5:
					this._num = value;
					return;
				case 2: // "%"
				case 3: //  "em"
				case 4: //  "ex"
					throw DOMException.new("NotSupportedError");
				case 6:
					this._num = (127 * value) / 4800;
					return;
				case 7:
					this._num = (127 * value) / 480;
					return;
				case 8:
					this._num = value / 96;
					return;
				case 9:
					this._num = (value * 3) / 4;
					return;
				case 10:
					this._num = 16 / value;
					return;
				default:
					throw new TypeError(`invalid ${_unit}`);
			}
		}
		throw new TypeError(`value=[${value}] unit=[${_unit}]`);
	}

	newValueSpecifiedUnits(unitType: number, valueInSpecifiedUnits: number) {
		if (isFinite(valueInSpecifiedUnits)) {
			this.convertToSpecifiedUnits(unitType);
			this._num = valueInSpecifiedUnits;
		} else {
			throw new TypeError();
		}
	}

	convertToSpecifiedUnits(unitType: number) {
		if (unitType > 0 && unitType < 11) {
			const { value } = this;
			this._unit = unitType;
			this.value = value;
		} else if (unitType === undefined) {
			throw new TypeError();
		} else {
			throw DOMException.new("NotSupportedError");
		}
	}

	toString() {
		return this.valueAsString;
	}

	static SVG_LENGTHTYPE_UNKNOWN = 0;
	static SVG_LENGTHTYPE_NUMBER = 1;
	static SVG_LENGTHTYPE_PERCENTAGE = 2;
	static SVG_LENGTHTYPE_EMS = 3;
	static SVG_LENGTHTYPE_EXS = 4;
	static SVG_LENGTHTYPE_PX = 5;
	static SVG_LENGTHTYPE_CM = 6;
	static SVG_LENGTHTYPE_MM = 7;
	static SVG_LENGTHTYPE_IN = 8;
	static SVG_LENGTHTYPE_PT = 9;
	static SVG_LENGTHTYPE_PC = 10;
}

export class SVGLengthList extends Array<SVGLength> {
	clear() {
		this.splice(0);
	}
	initialize(newItem: SVGLength) {
		if (newItem instanceof SVGLength) {
			this.clear();
			this.push(newItem);
			return newItem;
		}
		throw TypeError();
	}

	getItem(i: number) {
		return this[i];
	}

	removeItem(i: number) {
		const m = this[i];
		this.splice(i, 1);
		return m;
	}
	appendItem(newItem: SVGLength) {
		this.push(newItem);
		return newItem;
	}
	insertItemBefore(newItem: SVGLength, i: number) {
		let j;
		while ((j = this.indexOf(newItem)) >= 0) {
			this.splice(j, 1);
		}
		if (newItem instanceof SVGLength) {
			this.splice(i, 0, newItem);
			return newItem;
		} else {
			const n = new SVGLength(newItem);
			this.splice(i, 0, n);
			return n;
		}
	}
	replaceItem(newItem: SVGLength, i: number) {
		let j;
		while ((j = this.indexOf(newItem)) >= 0) {
			this.splice(j, 1);
			--i;
		}
		this.splice(i, 0, newItem);
	}

	toString() {
		return this.join(" ");
	}
	get numberOfItems() {
		return this.length;
	}

	public static parse(d: string): SVGLengthList {
		const tl = new SVGLengthList();
		// console.log("parse:static", d);
		for (const str of d.split(/[\s,]+/)) {
			// console.log("str", str);
			tl.appendItem(new SVGLength(str.trim()));
		}
		return tl;
	}
	parse(d: string): SVGLengthList {
		this.clear();
		// console.log("parse", d);
		for (const str of d.split(/[\s,]+/)) {
			// console.log("str", str);
			this.appendItem(new SVGLength(str.trim()));
		}
		return this;
	}
}

export class SVGLengthAttr extends Attr {
	_var?: SVGLength | string;

	set value(value: string) {
		const { _var } = this;
		if (_var instanceof SVGLength) {
			try {
				_var.valueAsString = value;
			} catch (err) {
				console.error(err);
				// this._var = value;
			}
		} else {
			this._var = value;
		}
	}

	get value() {
		const { _var } = this;
		if (_var instanceof SVGLength) {
			return _var.valueAsString;
		}
		return _var || "";
	}

	get baseVal() {
		const { _var } = this;
		if (_var instanceof SVGLength) {
			return _var;
		} else {
			return (this._var = new SVGLength(_var));
		}
	}

	valueOf() {
		const { _var } = this;
		if (_var instanceof SVGLength) {
			return _var.valueAsString;
		} else {
			return _var?.toString();
		}
	}
}

export class SVGLengthListAttr extends Attr {
	_var?: SVGLengthList | string;

	set value(value: string) {
		const { _var } = this;
		if (_var instanceof SVGLengthList) {
			_var.parse(value);
		} else {
			this._var = value;
		}
	}

	get value() {
		const { _var } = this;
		if (_var instanceof SVGLengthList) {
			return _var.toString() || "";
		}
		return _var ?? "";
	}

	get baseVal() {
		const { _var } = this;
		if (_var instanceof SVGLengthList) {
			return _var;
		} else if (_var) {
			return (this._var = SVGLengthList.parse(_var));
		} else {
			return (this._var = new SVGLengthList());
		}
	}

	valueOf() {
		return this._var?.toString();
	}
}

export class SVGRectAttr extends Attr {
	_var?: Box | string;

	set value(value: string) {
		const { _var } = this;
		if (_var instanceof Box) {
			const v = value.split(/[\s,]+/).map(parseFloat);
			_var.x = v[0];
			_var.y = v[1];
			_var.width = v[2];
			_var.height = v[3];
		} else {
			this._var = value;
		}
	}

	get value() {
		const { _var } = this;
		if (_var instanceof Box) {
			const { x, y, width, height } = _var;
			return `${x} ${y} ${width} ${height}`;
		}
		return _var || "";
	}

	get baseVal() {
		const { _var } = this;
		if (_var instanceof Box) {
			return _var;
		} else {
			return (this._var = Box.new(_var));
		}
	}

	valueOf() {
		const { _var } = this;
		if (_var instanceof Box) {
			const { x, y, width, height } = _var;
			return `${x} ${y} ${width} ${height}`;
		} else {
			return _var?.toString();
		}
	}
}

import { Box } from "svggeom";
import { Attr } from "../attr.js";
import { DOMException } from "../event-target.js";
