import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><title>Tests of some tricky semantics around NamedNodeMap and the element.attributes collection</title>\n<link rel=\"author\" title=\"Domenic Denicola\" href=\"mailto:d@domenic.me\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#interface-namednodemap\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-element-attributes\"/>\n\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n\n<script/>\n</head></html>"
const document = loadDOM(html, `text/html`)

"use strict";

test(() => {

  const element = document.createElement("div");
  element.setAttribute("x", "first");

  assert_equals(element.attributes.length, 1, "one attribute");
  assert_equals(element.attributes.x.value, "first");

}, "an attribute set by setAttribute should be accessible as a field on the `attributes` field of an Element");

test(() => {

  const element = document.createElement("div");
  const map = element.attributes;

  assert_equals(map.length, 0);

  const attr1 = document.createAttribute("attr1");
  map.setNamedItem(attr1);
  assert_equals(map.attr1, attr1);
  assert_equals(map.length, 1);

  const attr2 = document.createAttribute("attr2");
  map.setNamedItem(attr2);
  assert_equals(map.attr2, attr2);
  assert_equals(map.length, 2);

  const rm1 = map.removeNamedItem("attr1");
  assert_equals(rm1, attr1);
  assert_equals(map.length, 1);

  const rm2 = map.removeNamedItem("attr2");
  assert_equals(rm2, attr2);
  assert_equals(map.length, 0);

}, "setNamedItem and removeNamedItem on `attributes` should add and remove fields from `attributes`");

test(() => {

  const element = document.createElement("div");
  const map = element.attributes;

  const fooAttribute = document.createAttribute("foo");
  map.setNamedItem(fooAttribute);

  const itemAttribute = document.createAttribute("item");
  map.setNamedItem(itemAttribute);

  assert_equals(map.foo, fooAttribute);
  assert_equals(map.item, NamedNodeMap.prototype.item);
  assert_equals(typeof map.item, "function");

  map.removeNamedItem("item");
  assert_equals(map.item, NamedNodeMap.prototype.item);
  assert_equals(typeof map.item, "function");

}, "setNamedItem and removeNamedItem on `attributes` should not interfere with existing method names");

test(() => {

  const element = document.createElement("div");
  element.setAttributeNS(null, "x", "first");

  assert_equals(element.attributes.length, 1, "one attribute");
  assert_equals(element.attributes.x.value, "first");

}, "an attribute with a null namespace should be accessible as a field on the `attributes` field of an Element");

test(() => {

  const element = document.createElement("div");
  element.setAttributeNS("foo", "x", "first");

  assert_equals(element.attributes.length, 1, "one attribute");
  assert_equals(element.attributes.x.value, "first");

}, "an attribute with a set namespace should be accessible as a field on the `attributes` field of an Element");

test(() => {

  const element = document.createElement("div");
  element.setAttributeNS("foo", "setNamedItem", "first");

  assert_equals(element.attributes.length, 1, "one attribute");
  assert_equals(typeof element.attributes.setNamedItem, "function");

}, "setting an attribute should not overwrite the methods of an `NamedNodeMap` object");

test(() => {

  const element = document.createElement("div");
  element.setAttributeNS("foo", "toString", "first");

  assert_equals(element.attributes.length, 1, "one attribute");
  assert_equals(typeof element.attributes.toString, "function");

}, "setting an attribute should not overwrite the methods defined by prototype ancestors of an `NamedNodeMap` object");

test(() => {

  const element = document.createElement("div");
  element.setAttributeNS("foo", "length", "first");

  assert_equals(element.attributes.length, 1, "one attribute");

}, "setting an attribute should not overwrite the the length property of an `NamedNodeMap` object");

