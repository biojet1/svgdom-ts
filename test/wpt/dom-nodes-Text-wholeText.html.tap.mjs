import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "./wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>Text - wholeText</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-text-wholetext\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script/>\n</head></html>"
const document = loadDOM(html, `text/html`)

"use strict";

test(() => {
  const parent = document.createElement("div");

  const t1 = document.createTextNode("a");
  const t2 = document.createTextNode("b");
  const t3 = document.createTextNode("c");

  assert_equals(t1.wholeText, t1.textContent);

  parent.appendChild(t1);

  assert_equals(t1.wholeText, t1.textContent);

  parent.appendChild(t2);

  assert_equals(t1.wholeText, t1.textContent + t2.textContent);
  assert_equals(t2.wholeText, t1.textContent + t2.textContent);

  parent.appendChild(t3);

  assert_equals(t1.wholeText, t1.textContent + t2.textContent + t3.textContent);
  assert_equals(t2.wholeText, t1.textContent + t2.textContent + t3.textContent);
  assert_equals(t3.wholeText, t1.textContent + t2.textContent + t3.textContent);

  const a = document.createElement("a");
  a.textContent = "I'm an Anchor";
  parent.insertBefore(a, t3);

  const span = document.createElement("span");
  span.textContent = "I'm a Span";
  parent.appendChild(document.createElement("span"));

  assert_equals(t1.wholeText, t1.textContent + t2.textContent);
  assert_equals(t2.wholeText, t1.textContent + t2.textContent);
  assert_equals(t3.wholeText, t3.textContent);
}, "wholeText returns text of all Text nodes logically adjacent to the node, in document order.");
