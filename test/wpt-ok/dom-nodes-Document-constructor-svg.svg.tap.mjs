import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:html=\"http://www.w3.org/1999/xhtml\" width=\"100%\" height=\"100%\" viewBox=\"0 0 800 600\">\n<title>Document constructor</title>\n<html:script src=\"/resources/testharness.js\"/>\n<html:script src=\"/resources/testharnessreport.js\"/>\n<html:script/>\n</svg>"
const document = loadDOM(html, `application/xml`)

test(function() {
  var doc = new Document();
  assert_true(doc instanceof Node, "Should be a Node");
  assert_true(doc instanceof Document, "Should be a Document");
  assert_false(doc instanceof XMLDocument, "Should not be an XMLDocument");
  assert_equals(Object.getPrototypeOf(doc), Document.prototype,
                "Document should be the primary interface");
}, "new Document(): interfaces")

test(function() {
  var doc = new Document();
  assert_equals(doc.firstChild, null, "firstChild");
  assert_equals(doc.lastChild, null, "lastChild");
  assert_equals(doc.doctype, null, "doctype");
  assert_equals(doc.documentElement, null, "documentElement");
  assert_array_equals(doc.childNodes, [], "childNodes");
}, "new Document(): children")

test(function() {
  var doc = new Document();
  assert_equals(doc.URL, "about:blank");
  assert_equals(doc.documentURI, "about:blank");
  assert_equals(doc.compatMode, "CSS1Compat");
  assert_equals(doc.characterSet, "UTF-8");
  assert_equals(doc.contentType, "application/xml");
  assert_equals(doc.createElement("DIV").localName, "DIV");
}, "new Document(): metadata")

test(function() {
  var doc = new Document();
  assert_equals(doc.characterSet, "UTF-8", "characterSet");
  assert_equals(doc.charset, "UTF-8", "charset");
  assert_equals(doc.inputEncoding, "UTF-8", "inputEncoding");
}, "new Document(): characterSet aliases")
