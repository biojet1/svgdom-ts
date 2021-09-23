import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n<title>Document.getElementsByTagName</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head>\n<body>\n<div id=\"log\"/>\n<pre id=\"x\"/>\n<script/>\n</body>\n</html>"
const document = loadDOM(html, `application/xml`)

test(function() {
  var t = document.body.appendChild(document.createElementNS("http://www.w3.org/1999/xhtml", "I"))
  this.add_cleanup(function() {document.body.removeChild(t)})
  assert_equals(t.localName, "I")
  assert_equals(t.tagName, "I")
  assert_array_equals(document.getElementsByTagName("I"), [t])
  assert_array_equals(document.getElementsByTagName("i"), [])
  assert_array_equals(document.body.getElementsByTagName("I"), [t])
  assert_array_equals(document.body.getElementsByTagName("i"), [])
}, "HTML element with uppercase tag name matches in XHTML documents")

test(function() {
  var t = document.body.appendChild(document.createElementNS("test", "st"))
  this.add_cleanup(function() {document.body.removeChild(t)})
  assert_array_equals(document.getElementsByTagName("st"), [t])
  assert_array_equals(document.getElementsByTagName("ST"), [])
}, "Element in non-HTML namespace, no prefix, lowercase name")

test(function() {
  var t = document.body.appendChild(document.createElementNS("test", "ST"))
  this.add_cleanup(function() {document.body.removeChild(t)})
  assert_array_equals(document.getElementsByTagName("ST"), [t])
  assert_array_equals(document.getElementsByTagName("st"), [])
}, "Element in non-HTML namespace, no prefix, uppercase name")

test(function() {
  var t = document.body.appendChild(document.createElementNS("test", "te:st"))
  this.add_cleanup(function() {document.body.removeChild(t)})
  assert_array_equals(document.getElementsByTagName("st"), [])
  assert_array_equals(document.getElementsByTagName("ST"), [])
  assert_array_equals(document.getElementsByTagName("te:st"), [t])
  assert_array_equals(document.getElementsByTagName("te:ST"), [])
}, "Element in non-HTML namespace, prefix, lowercase name")

test(function() {
  var t = document.body.appendChild(document.createElementNS("test", "te:ST"))
  this.add_cleanup(function() {document.body.removeChild(t)})
  assert_array_equals(document.getElementsByTagName("ST"), [])
  assert_array_equals(document.getElementsByTagName("st"), [])
  assert_array_equals(document.getElementsByTagName("te:st"), [])
  assert_array_equals(document.getElementsByTagName("te:ST"), [t])
}, "Element in non-HTML namespace, prefix, uppercase name")

test(function() {
  var t = document.body.appendChild(document.createElement("AÇ"))
  this.add_cleanup(function() {document.body.removeChild(t)})
  assert_array_equals(document.getElementsByTagName("AÇ"), [t], "All uppercase input")
  assert_array_equals(document.getElementsByTagName("aÇ"), [], "Ascii lowercase input")
  assert_array_equals(document.getElementsByTagName("aç"), [], "All lowercase input")
}, "Element in HTML namespace, no prefix, non-ascii characters in name")

test(function() {
  var t = document.body.appendChild(document.createElementNS("test", "AÇ"))
  this.add_cleanup(function() {document.body.removeChild(t)})
  assert_array_equals(document.getElementsByTagName("AÇ"), [t], "All uppercase input")
  assert_array_equals(document.getElementsByTagName("aÇ"), [], "Ascii lowercase input")
  assert_array_equals(document.getElementsByTagName("aç"), [], "All lowercase input")
}, "Element in non-HTML namespace, non-ascii characters in name")

test(function() {
  var t = document.body.appendChild(document.createElementNS("http://www.w3.org/1999/xhtml", "test:aÇ"))
  this.add_cleanup(function() {document.body.removeChild(t)})
  assert_array_equals(document.getElementsByTagName("TEST:AÇ"), [], "All uppercase input")
  assert_array_equals(document.getElementsByTagName("test:aÇ"), [t], "Ascii lowercase input")
  assert_array_equals(document.getElementsByTagName("test:aç"), [], "All lowercase input")
}, "Element in HTML namespace, prefix, non-ascii characters in name")

test(function() {
  var t = document.body.appendChild(document.createElementNS("test", "TEST:AÇ"))
  this.add_cleanup(function() {document.body.removeChild(t)})
  assert_array_equals(document.getElementsByTagName("TEST:AÇ"), [t], "All uppercase input")
  assert_array_equals(document.getElementsByTagName("test:aÇ"), [], "Ascii lowercase input")
  assert_array_equals(document.getElementsByTagName("test:aç"), [], "All lowercase input")
}, "Element in non-HTML namespace, prefix, non-ascii characters in name")

test(function() {
  var actual = document.getElementsByTagName("*");
  var expected = [];
  var get_elements = function(node) {
    for (var i = 0; i < node.childNodes.length; i++) {
      var child = node.childNodes[i];
      if (child.nodeType === child.ELEMENT_NODE) {
        expected.push(child);
        get_elements(child);
      }
    }
  }
  get_elements(document);
  assert_array_equals(actual, expected);
}, "getElementsByTagName('*')")
