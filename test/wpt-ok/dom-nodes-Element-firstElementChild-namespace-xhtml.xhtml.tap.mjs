import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:pickle=\"http://ns.example.org/pickle\">\n<head>\n<title>firstElementChild with namespaces</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head>\n<body>\n<h1>Test of firstElementChild with namespaces</h1>\n<div id=\"parentEl\">\n  <pickle:dill id=\"first_element_child\"/>\n</div>\n<div id=\"log\"/>\n<p id=\"parentEl\">The result of this test is\n<span id=\"first_element_child\" style=\"font-weight:bold;\">logged above.</span></p>\n<script/>\n</body>\n</html>"
const document = loadDOM(html, `application/xml`)

test(function() {
  var parentEl = document.getElementById("parentEl");
  var fec = parentEl.firstElementChild;
  assert_true(!!fec)
  assert_equals(fec.nodeType, 1)
  assert_equals(fec.getAttribute("id"), "first_element_child")
  assert_equals(fec.localName, "dill")
})
