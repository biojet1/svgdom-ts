import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>MutationObservers: childList mutations</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script src=\"mutationobservers.js\"/>\n</head><body><h1>MutationObservers: childList mutations</h1>\n<div id=\"log\"/>\n\n<section style=\"display: none\">\n<p id=\"dummies\">\n<span id=\"d30\">text content</span>\n<span id=\"d35\">text content</span>\n<span id=\"d40\">text content</span>\n<span id=\"d45\">text content</span>\n<span id=\"d50\">text content</span>\n<span id=\"d51\">text content</span>\n</p>\n\n</section>\n<section style=\"display: none\">\n<p id=\"n00\"><span>text content</span></p>\n\n<p id=\"n10\"><span>text content</span></p>\n<p id=\"n11\"/>\n<p id=\"n12\"/>\n<p id=\"n13\"><span>text content</span></p>\n\n<p id=\"n20\">PAS</p>\n<p id=\"n21\">CH</p>\n\n<p id=\"n30\"><span>text content</span></p>\n<p id=\"n31\"><span>text content</span></p>\n<p id=\"n32\"><span>AN</span><span>CH</span><span>GED</span></p>\n<p id=\"n33\"><span>text content</span></p>\n<p id=\"n34\"><span>text content</span></p>\n<p id=\"n35\"><span>text content</span></p>\n\n<p id=\"n40\"><span>text content</span></p>\n<p id=\"n41\"><span>text content</span></p>\n<p id=\"n42\"><span>CH</span><span>GED</span><span>AN</span></p>\n<p id=\"n43\"><span>text content</span></p>\n<p id=\"n44\"><span>text content</span></p>\n<p id=\"n45\"><span>text content</span></p>\n\n\n<p id=\"n50\"><span>text content</span></p>\n<p id=\"n51\"><span>text content</span></p>\n<p id=\"n52\"><span>NO </span><span>CHANGED</span></p>\n<p id=\"n53\"><span>text content</span></p>\n\n<p id=\"n60\"><span>text content</span></p>\n\n<p id=\"n70\"><span>NO </span><span>CHANGED</span></p>\n<p id=\"n71\">CHANN</p>\n\n<p id=\"n80\"><span>NO </span><span>CHANGED</span></p>\n<p id=\"n81\">CHANN</p>\n\n<p id=\"n90\"><span>CHA</span><span>ED</span></p>\n<p id=\"n91\">CHAE</p>\n\n<p id=\"n100\"><span id=\"s1\">CHAN</span><span id=\"s2\">GED</span></p>\n\n</section>\n\n<script/>\n\n\n</body></html>"
const document = loadDOM(html, `text/html`)
import fs from "fs";
import vm from "vm";
const src0 = `${process.env.WPT_ROOT}/dom/nodes/mutationobservers.js`;
vm.runInThisContext(fs.readFileSync(src0, "utf8"), src0)

  var dummies = document.getElementById('dummies');

  function createFragment() {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(document.createTextNode("11"));
    fragment.appendChild(document.createTextNode("22"));
    return fragment;
  }

  var n00 = document.getElementById('n00');

  runMutationTest(n00,
                  {"childList":true, "attributes":true},
                  [{type: "attributes", attributeName: "class"}],
                  function() { n00.nodeValue = ""; n00.setAttribute("class", "dummy");},
                  "childList Node.nodeValue: no mutation");

  var n10 = document.getElementById('n10');
  runMutationTest(n10,
                  {"childList":true},
                  [{type: "childList",
                    removedNodes: [n10.firstChild],
                    addedNodes: function() {return [n10.firstChild]}}],
                  function() { n10.textContent = "new data"; },
                  "childList Node.textContent: replace content mutation");

  var n11 = document.getElementById('n11');
  runMutationTest(n11,
                  {"childList":true},
                  [{type: "childList",
                    addedNodes: function() {return [n11.firstChild]}}],
                  function() { n11.textContent = "new data"; },
                  "childList Node.textContent: no previous content mutation");

  var n12 = document.getElementById('n12');
  runMutationTest(n12,
                  {"childList":true, "attributes":true},
                  [{type: "attributes", attributeName: "class"}],
                  function() { n12.textContent = ""; n12.setAttribute("class", "dummy");},
                  "childList Node.textContent: textContent no mutation");

  var n13 = document.getElementById('n13');
  runMutationTest(n13,
                  {"childList":true},
                  [{type: "childList", removedNodes: [n13.firstChild]}],
                  function() { n13.textContent = ""; },
                  "childList Node.textContent: empty string mutation");

  var n20 = document.getElementById('n20');
  n20.appendChild(document.createTextNode("S"));
  runMutationTest(n20,
                  {"childList":true},
                  [{type: "childList",
                    removedNodes: [n20.lastChild],
                    previousSibling: n20.firstChild}],
                  function() { n20.normalize(); },
                  "childList Node.normalize mutation");

  var n21 = document.getElementById('n21');
  n21.appendChild(document.createTextNode("AN"));
  n21.appendChild(document.createTextNode("GED"));
  runMutationTest(n21,
                  {"childList":true},
                  [{type: "childList",
                    removedNodes: [n21.lastChild.previousSibling],
                    previousSibling: n21.firstChild,
                    nextSibling: n21.lastChild},
                   {type: "childList",
                    removedNodes: [n21.lastChild],
                    previousSibling: n21.firstChild}],
                  function() { n21.normalize(); },
                  "childList Node.normalize mutations");

  var n30 = document.getElementById('n30');
  var d30 = document.getElementById('d30');
  runMutationTest(n30,
                  {"childList":true},
                  [{type: "childList",
                    addedNodes: [d30],
                    nextSibling: n30.firstChild}],
                  function() { n30.insertBefore(d30, n30.firstChild); },
                  "childList Node.insertBefore: addition mutation");

  var n31 = document.getElementById('n31');
  runMutationTest(n31,
                  {"childList":true},
                  [{type: "childList",
                    removedNodes: [n31.firstChild]}],
                  function() { dummies.insertBefore(n31.firstChild, dummies.firstChild); },
                  "childList Node.insertBefore: removal mutation");

  var n32 = document.getElementById('n32');
  runMutationTest(n32,
                  {"childList":true},
                  [{type: "childList",
                    removedNodes: [n32.firstChild.nextSibling],
                    previousSibling: n32.firstChild, nextSibling: n32.lastChild},
                    {type: "childList",
                    addedNodes: [n32.firstChild.nextSibling],
                    nextSibling: n32.firstChild}],
                  function() { n32.insertBefore(n32.firstChild.nextSibling, n32.firstChild); },
                  "childList Node.insertBefore: removal and addition mutations");

  var n33 = document.getElementById('n33');
  var f33 = createFragment();
  runMutationTest(n33,
                  {"childList":true},
                  [{type: "childList",
                    addedNodes: [f33.firstChild, f33.lastChild],
                    nextSibling: n33.firstChild}],
                  function() { n33.insertBefore(f33, n33.firstChild); },
                  "childList Node.insertBefore: fragment addition mutations");

  var n34 = document.getElementById('n34');
  var f34 = createFragment();
  runMutationTest(f34,
                  {"childList":true},
                  [{type: "childList",
                    removedNodes: [f34.firstChild, f34.lastChild]}],
                  function() { n34.insertBefore(f34, n34.firstChild); },
                  "childList Node.insertBefore: fragment removal mutations");

  var n35 = document.getElementById('n35');
  var d35 = document.getElementById('d35');
  runMutationTest(n35,
                  {"childList":true},
                  [{type: "childList",
                    addedNodes: [d35],
                    previousSibling: n35.firstChild}],
                  function() { n35.insertBefore(d35, null); },
                  "childList Node.insertBefore: last child addition mutation");

  var n40 = document.getElementById('n40');
  var d40 = document.getElementById('d40');
  runMutationTest(n40,
                  {"childList":true},
                  [{type: "childList",
                    addedNodes: [d40],
                    previousSibling: n40.firstChild}],
                  function() { n40.appendChild(d40); },
                  "childList Node.appendChild: addition mutation");

  var n41 = document.getElementById('n41');
  runMutationTest(n41,
                  {"childList":true},
                  [{type: "childList",
                    removedNodes: [n41.firstChild]}],
                  function() { dummies.appendChild(n41.firstChild); },
                  "childList Node.appendChild: removal mutation");

  var n42 = document.getElementById('n42');
  runMutationTest(n42,
                  {"childList":true},
                  [{type: "childList",
                    removedNodes: [n42.firstChild.nextSibling],
                    previousSibling: n42.firstChild, nextSibling: n42.lastChild},
                    {type: "childList",
                    addedNodes: [n42.firstChild.nextSibling],
                    previousSibling: n42.lastChild}],
                  function() { n42.appendChild(n42.firstChild.nextSibling); },
                  "childList Node.appendChild: removal and addition mutations");

  var n43 = document.getElementById('n43');
  var f43 = createFragment();
  runMutationTest(n43,
                  {"childList":true},
                  [{type: "childList",
                    addedNodes: [f43.firstChild, f43.lastChild],
                    previousSibling: n43.firstChild}],
                  function() { n43.appendChild(f43); },
                  "childList Node.appendChild: fragment addition mutations");

  var n44 = document.getElementById('n44');
  var f44 = createFragment();
  runMutationTest(f44,
                  {"childList":true},
                  [{type: "childList",
                    removedNodes: [f44.firstChild, f44.lastChild]}],
                  function() { n44.appendChild(f44); },
                  "childList Node.appendChild: fragment removal mutations");

  var n45 = document.createElement('p');
  var d45 = document.createElement('span');
  runMutationTest(n45,
                  {"childList":true},
                  [{type: "childList",
                    addedNodes: [d45]}],
                  function() { n45.appendChild(d45); },
                  "childList Node.appendChild: addition outside document tree mutation");

  var n50 = document.getElementById('n50');
  var d50 = document.getElementById('d50');
  runMutationTest(n50,
                  {"childList":true},
                  [{type: "childList",
                    removedNodes: [n50.firstChild],
                    addedNodes: [d50]}],
                  function() { n50.replaceChild(d50, n50.firstChild); },
                  "childList Node.replaceChild: replacement mutation");

  var n51 = document.getElementById('n51');
  var d51 = document.getElementById('d51');
  runMutationTest(n51,
                  {"childList":true},
                  [{type: "childList",
                    removedNodes: [n51.firstChild]}],
                  function() { d51.parentNode.replaceChild(n51.firstChild, d51); },
                  "childList Node.replaceChild: removal mutation");

  var n52 = document.getElementById('n52');
  runMutationTest(n52,
                  {"childList":true},
                  [{type: "childList",
                    removedNodes: [n52.lastChild],
                    previousSibling: n52.firstChild},
                   {type: "childList",
                    removedNodes: [n52.firstChild],
                    addedNodes: [n52.lastChild]}],
                  function() { n52.replaceChild(n52.lastChild, n52.firstChild); },
                  "childList Node.replaceChild: internal replacement mutation");

  var n53 = document.getElementById('n53');
  runMutationTest(n53,
                  {"childList":true},
                  [{type: "childList",
                    removedNodes: [n53.firstChild]},
                   {type: "childList",
                    addedNodes: [n53.firstChild]}],
                  function() { n53.replaceChild(n53.firstChild, n53.firstChild); },
                  "childList Node.replaceChild: self internal replacement mutation");

  var n60 = document.getElementById('n60');
  runMutationTest(n60,
                  {"childList":true},
                  [{type: "childList",
                    removedNodes: [n60.firstChild]}],
                  function() { n60.removeChild(n60.firstChild); },
                  "childList Node.removeChild: removal mutation");

  var n70 = document.getElementById('n70');
  var r70 = null;
  test(function () {
    r70 = document.createRange();
    r70.setStartBefore(n70.firstChild);
    r70.setEndAfter(n70.firstChild);
   }, "Range (r70) is created");
  runMutationTest(n70,
                  {"childList":true},
                  [{type: "childList",
                    removedNodes: [n70.firstChild],
                    nextSibling: n70.lastChild}],
                  function() { r70.deleteContents(); },
                  "childList Range.deleteContents: child removal mutation");

  var n71 = document.getElementById('n71');
  var r71 = null;
  test(function () {
    n71.appendChild(document.createTextNode("NNN"));
    n71.appendChild(document.createTextNode("NGED"));
    r71 = document.createRange();
    r71.setStart(n71.firstChild, 4);
    r71.setEnd(n71.lastChild, 1);
   }, "Range (r71) is created");
  runMutationTest(n71,
                  {"childList":true},
                  [{type: "childList",
                    removedNodes: [n71.firstChild.nextSibling],
                    previousSibling: n71.firstChild,
                    nextSibling: n71.lastChild}],
                  function() { r71.deleteContents(); },
                  "childList Range.deleteContents: child and data removal mutation");

  var n80 = document.getElementById('n80');
  var r80 = null;
  test(function () {
    r80 = document.createRange();
    r80.setStartBefore(n80.firstChild);
    r80.setEndAfter(n80.firstChild);
   }, "Range (r80) is created");
  runMutationTest(n80,
                  {"childList":true},
                  [{type: "childList",
                    removedNodes: [n80.firstChild],
                    nextSibling: n80.lastChild}],
                  function() { r80.extractContents(); },
                  "childList Range.extractContents: child removal mutation");

  var n81 = document.getElementById('n81');
  var r81 = null;
  test(function () {
    n81.appendChild(document.createTextNode("NNN"));
    n81.appendChild(document.createTextNode("NGED"));
    r81 = document.createRange();
    r81.setStart(n81.firstChild, 4);
    r81.setEnd(n81.lastChild, 1);
   }, "Range (r81) is created");
  runMutationTest(n81,
                  {"childList":true},
                  [{type: "childList",
                    removedNodes: [n81.firstChild.nextSibling],
                    previousSibling: n81.firstChild,
                    nextSibling: n81.lastChild}],
                  function() { r81.extractContents(); },
                  "childList Range.extractContents: child and data removal mutation");

  var n90 = document.getElementById('n90');
  var f90 = document.createTextNode("NG");
  var r90 = null;
  test(function () {
    r90 = document.createRange();
    r90.setStartAfter(n90.firstChild);
    r90.setEndBefore(n90.lastChild);
   }, "Range (r90) is created");
  runMutationTest(n90,
                  {"childList":true},
                  [{type: "childList",
                    addedNodes: [f90],
                    previousSibling: n90.firstChild,
                    nextSibling: n90.lastChild}],
                  function() { r90.insertNode(f90); },
                  "childList Range.insertNode: child insertion mutation");

  var n91 = document.getElementById('n91');
  var f91 = document.createTextNode("NG");
  var r91 = null;
  test(function () {
    n91.appendChild(document.createTextNode("D"));
    r91 = document.createRange();
    r91.setStart(n91.firstChild, 3);
    r91.setEnd(n91.lastChild, 0);
   }, "Range (r91) is created");
  runMutationTest(n91,
                  {"childList":true},
                  [{type: "childList",
                    addedNodes: function() { return [n91.lastChild.previousSibling]; },
                    previousSibling: n91.firstChild,
                    nextSibling: n91.lastChild},
                   {type: "childList",
                    addedNodes: [f91],
                    previousSibling: n91.firstChild,
                    nextSibling: function () { return n91.lastChild.previousSibling; } }],
                  function() { r91.insertNode(f91); },
                  "childList Range.insertNode: children insertion mutation");

  var n100 = document.getElementById('n100');
  var f100 = document.createElement("span");
  var r100 = null;
  test(function () {
    r100 = document.createRange();
    r100.setStartBefore(n100.firstChild);
    r100.setEndAfter(n100.lastChild);
   }, "Range (r100) is created");
  runMutationTest(n100,
                  {"childList":true},
                  [{type: "childList",
                    removedNodes: [n100.firstChild],
                    nextSibling: n100.lastChild},
                   {type: "childList",
                    removedNodes: [n100.lastChild]},
                   {type: "childList",
                    addedNodes: [f100] }],
                  function() { r100.surroundContents(f100); },
                  "childList Range.surroundContents: children removal and addition mutation");

