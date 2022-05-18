export function deCamelize(s: string) {
	return String(s).replace(/([a-z])([A-Z])/g, function (m, g1, g2) {
		return g1 + '-' + g2.toLowerCase();
	});
}

class CSSMap extends Map<string, String> {}

class CSSValue extends String {
	priority?: string;
}

interface IStyleDec {
	_map: CSSMap;
	_mapq: CSSMap | undefined;
	cssText: string;
}

function parse(_map: CSSMap, css: string) {
	for (const s of css.split(/\s*;\s*/)) {
		if (s) {
			const i = s.indexOf(':');
			if (i > 0) {
				const k = s.substring(0, i).trim();
				const v = s.substring(i + 1).trim();
				if (k && v) {
					const m = v.match(/(.+)\s*!\s*(\w+)$/);
					if (m) {
						const u = new CSSValue(m[1]);
						u.priority = m[2];
						_map.set(k, u);
					} else {
						_map.set(k, v);
					}
				}
			}
		}
	}
}

function format(_map?: CSSMap) {
	if (_map) {
		const arr: string[] = [];
		for (const [key, v] of _map) {
			switch (v) {
				case null:
				case undefined:
				case '':
					break;
				default:
					if (typeof v === 'object') {
						const p = (v as CSSValue).priority;
						if (p) {
							arr.push(`${deCamelize(key)}: ${v} !${p};`);
						}
					}
					arr.push(`${deCamelize(key)}: ${v};`);
			}
		}
		return arr.join(' ');
	}
	return '';
}

export class CSSStyleDeclaration {
	val?: CSSMap;
	get _map() {
		return this.val || (this.val = new CSSMap());
	}
	get _mapq() {
		return this.val || undefined;
	}
	get cssText() {
		return format(this._mapq);
	}

	set cssText(value: string) {
		const { _map } = this;
		_map.clear();
		parse(_map, value);
	}

	static new() {
		return new Proxy<CSSStyleDeclaration>(new CSSStyleDeclaration(), handler);
	}
}

export class StyleAttr extends Attr {
	val?: CSSMap;
	_proxy?: any;

	get _map() {
		return this.val || (this.val = new CSSMap());
	}
	get _mapq() {
		return this.val || undefined;
	}

	get cssText() {
		return format(this._mapq);
	}

	set cssText(value: string) {
		const { _map } = this;
		_map.clear();
		parse(_map, value);
	}

	set value(value: string) {
		this.cssText = value;
	}

	get value() {
		return format(this._mapq);
	}

	[Symbol.iterator]() {
		const { _mapq: _map } = this;
		return _map ? _map.keys() : [].values();
	}

	get proxy() {
		return this._proxy || (this._proxy = new Proxy<StyleAttr>(this, handler));
	}

	toString() {
		return this.value;
	}

	remove() {
		const { _mapq: _map } = this;
		_map && _map.clear();
		return super.remove();
	}

	setProperty(name: string, value?: String, priority?: string) {
		return setProperty(this._map, name, value, priority);
	}
	getPropertyPriority(name: string) {
		const { _mapq: _map } = this;
		if (_map && _map.size > 0) {
			const v = _map.get(name);
			if (typeof v === 'object') {
				return (v as CSSValue).priority || '';
			}
		}
		return '';
	}
	getPropertyValue(name: string) {
		const { _mapq: _map } = this;
		return (_map && _map.size > 0 && _map.get(name)?.valueOf()) || '';
	}
	removeProperty(name: string) {
		const { _mapq: _map } = this;
		if (_map && _map.size > 0) {
			const v = _map.get(name);
			if (v !== undefined) {
				_map.delete(name);
				return v;
			}
		}
		return null;
	}

	valueOf() {
		return format(this._mapq) || null;
	}
}

const handler = {
	get(self: IStyleDec, key: string, receiver?: any) {
		switch (key) {
			case 'setProperty':
				return (name: string, value?: string, priority?: string) =>
					setProperty(self._map, name, value, priority);

			case 'getPropertyValue':
				return (name: string) => {
					const { _mapq: _map } = self;
					return (_map && _map.size > 0 && _map.get(name)?.valueOf()) || '';
				};
			case 'removeProperty':
				return (name: string) => {
					const { _mapq: _map } = self;
					if (_map && _map.size > 0) {
						const v = _map.get(name);
						if (v !== undefined) {
							_map.delete(name);
							return v;
						}
					}
					return null;
				};

			case 'getPropertyPriority':
				return (name: string) => {
					const { _mapq: _map } = self;
					if (_map && _map.size > 0) {
						const v = _map.get(name);
						if (typeof v === 'object') {
							return (v as CSSValue).priority || '';
						}
					}
					return '';
				};

			case 'length':
				return self._map.size;
			case 'cssText':
				return self.cssText;
			case 'toString':
				return () => {
					return self.cssText;
				};
		}
		if (typeof key === 'symbol') {
			if (key === Symbol.iterator) {
				return () => {
					const { _mapq: _map } = self;
					return _map ? _map.keys() : [].values();
				};
			}
			// return self[Symbol.iterator];
			// console.log(`handler: symbol ${key}`);
			return undefined;
		} else if (/^-?\d+$/.test(key)) {
			let i = parseInt(key);
			for (const v of self._map.keys()) {
				if (0 === i--) {
					return v;
				} else if (i < 0) {
					break;
				}
			}
			return undefined;
		}
		key = deCamelize(key);
		return self._map.get(key);
	},
	set(self: StyleAttr, key: string, value: string) {
		if (key in StyleAttr.prototype) {
			switch (key) {
				case 'cssText':
					self.cssText = value;
					break;
				default:
					throw new Error(`cant set "${key}"`);
			}
			// (StyleAttr.prototype as any)[key];
		} else {
			setProperty(self._map, deCamelize(key), value);
		}
		return true;
	},
};

function setProperty(_map: CSSMap, name: string, value?: String, priority?: string) {
	L1: switch (name) {
		case 'margin':
		case 'padding': {
			switch (value) {
				case undefined:
					break;
				case null:
					_map.set(name, '');
					break;
				case 'inherit':
				case 'initial':
				case 'unset':
				case 'revert':
					break L1;
				case '':
					_map.delete(`${name}-top`);
					_map.delete(`${name}-right`);
					_map.delete(`${name}-bottom`);
					_map.delete(`${name}-left`);
					break;
				default:
					const a = value.split(/\s+/);
					if (a.length > 3) {
						setProperty(_map, `${name}-top`, a[0], priority);
						setProperty(_map, `${name}-right`, a[1], priority);
						setProperty(_map, `${name}-bottom`, a[2], priority);
						setProperty(_map, `${name}-left`, a[3], priority);
					} else if (a.length > 2) {
						setProperty(_map, `${name}-top`, a[0], priority);
						setProperty(_map, `${name}-right`, a[1], priority);
						setProperty(_map, `${name}-bottom`, a[2], priority);
						setProperty(_map, `${name}-left`, a[1], priority);
					} else if (a.length > 1) {
						setProperty(_map, `${name}-top`, a[0], priority);
						setProperty(_map, `${name}-right`, a[1], priority);
						setProperty(_map, `${name}-bottom`, a[0], priority);
						setProperty(_map, `${name}-left`, a[1], priority);
					} else if (a.length > 0) {
						setProperty(_map, `${name}-top`, a[0], priority);
						setProperty(_map, `${name}-right`, a[0], priority);
						setProperty(_map, `${name}-bottom`, a[0], priority);
						setProperty(_map, `${name}-left`, a[0], priority);
					}
			}
			// return;
		}
	}
	switch (value) {
		case undefined:
			break;
		case '':
			_map.delete(name);
			break;
		case null:
			_map.set(name, '');
			break;
		default:
			const v = _map.get(name);
			if (v === undefined) {
				if (priority) {
					const v = new CSSValue(value);
					v.priority = priority;
					_map.set(name, v);
				} else {
					_map.set(name, value);
				}
			} else if (typeof v === 'object') {
				if (v.toString() == value) {
					if (priority !== (v as CSSValue).priority) {
						(v as CSSValue).priority = priority;
					}
				} else {
					if (priority) {
						const u = new CSSValue(value);
						u.priority = priority;
						_map.set(name, u);
					} else {
						_map.set(name, value);
					}
				}
			} else if (v === value) {
				if (priority) {
					const u = new CSSValue(value);
					u.priority = priority;
					_map.set(name, u);
				}
			} else {
				if (priority) {
					const u = new CSSValue(value);
					u.priority = priority;
					_map.set(name, u);
				} else {
					_map.set(name, value);
				}
			}
	}
}

import { Element } from './element.js';
import { Attr } from './attr.js';
