import tap from 'tap';
import { CSS } from '../dist/all.js';
import { DOMParser } from '../dist/dom-parse.js';
const parser = new DOMParser();
const document = parser.parseFromString('<html/>', 'text/html');

tap.test('CSS', function (t) {
	let div = document.createElement('div');
	const asm = div.attributeStyleMap;
	asm.set('padding-top', CSS.px(42));
	t.same(`${asm.get('padding-top')}`, '42px');
	t.same(div.style.paddingTop, '42px');
	const px = CSS.px(9);
	asm.set('padding-left', px);
	t.same(div.style.paddingLeft, '9px');
	px.value++;
	t.same(div.style.paddingLeft, '10px');
	t.end();
});
