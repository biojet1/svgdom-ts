import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>MutationObservers: characterData mutations</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script src=\"mutationobservers.js\"/>\n</head><body><h1>MutationObservers: characterData mutations</h1>\n<div id=\"log\"/>\n\n<section style=\"display: none\">\n\n<p id=\"n\">text content</p>\n\n<p id=\"n00\">text content</p>\n\n<p id=\"n10\">CHAN</p>\n<p id=\"n11\">CHANGED</p>\n<p id=\"n12\">CHANGED</p>\n\n<p id=\"n20\">CHGED</p>\n<p id=\"n21\">CHANGED</p>\n<p id=\"n22\">CHANGED</p>\n\n<p id=\"n30\">CCCHANGED</p>\n<p id=\"n31\">CHANGED</p>\n\n<p id=\"n40\">CCCHANGED</p>\n<p id=\"n41\">CHANGED</p>\n\n<p id=\"n50\"><?processing data??></p>\n\n<p id=\"n60\"><!-- data --></p>\n\n<p id=\"n70\">CHANN</p>\n<p id=\"n71\">CHANN</p>\n\n<p id=\"n80\">CHANN</p>\n<p id=\"n81\">CHANN</p>\n\n<p id=\"n90\">CHANN</p>\n\n</section>\n\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)
import fs from "fs";
import vm from "vm";
const src0 = `${process.env.WPT_ROOT}/dom/nodes/mutationobservers.js`;
vm.runInThisContext(fs.readFileSync(src0, "utf8"), src0)

  var n = document.getElementById('n').firstChild;
runMutationTest(n,
                  {"characterData":true},
                  [{type: "characterData"}],
                  function() { n.data = "NEW VALUE"; },
                  "characterData Text.data: simple mutation without oldValue");

  var n00 = document.getElementById('n00').firstChild;
runMutationTest(n00,
                  {"characterData":true,"characterDataOldValue":true},
                  [{type: "characterData", oldValue: "text content" }],
                  function() { n00.data = "CHANGED"; },
                  "characterData Text.data: simple mutation");

  var n10 = document.getElementById('n10').firstChild;
runMutationTest(n10,
                  {"characterData":true,"characterDataOldValue":true},
                  [{type: "characterData", oldValue: "CHAN" }],
                  function() { n10.appendData("GED"); },
                  "characterData Text.appendData: simple mutation");

  var n11 = document.getElementById('n11').firstChild;
runMutationTest(n11,
                  {"characterData":true,"characterDataOldValue":true},
                  [{type: "characterData", oldValue: "CHANGED" }],
                  function() { n11.appendData(""); },
                  "characterData Text.appendData: empty string mutation");

  var n12 = document.getElementById('n12').firstChild;
runMutationTest(n12,
                  {"characterData":true,"characterDataOldValue":true},
                  [{type: "characterData", oldValue: "CHANGED" }],
                  function() { n12.appendData(null); },
                  "characterData Text.appendData: null string mutation");

  var n20 = document.getElementById('n20').firstChild;
runMutationTest(n20,
                  {"characterData":true,"characterDataOldValue":true},
                  [{type: "characterData", oldValue: "CHGED" }],
                  function() { n20.insertData(2, "AN"); },
                  "characterData Text.insertData: simple mutation");

  var n21 = document.getElementById('n21').firstChild;
runMutationTest(n21,
                  {"characterData":true,"characterDataOldValue":true},
                  [{type: "characterData", oldValue: "CHANGED" }],
                  function() { n21.insertData(2, ""); },
                  "characterData Text.insertData: empty string mutation");

  var n22 = document.getElementById('n22').firstChild;
runMutationTest(n22,
                  {"characterData":true,"characterDataOldValue":true},
                  [{type: "characterData", oldValue: "CHANGED" }],
                  function() { n22.insertData(2, null); },
                  "characterData Text.insertData: null string mutation");

  var n30 = document.getElementById('n30').firstChild;
runMutationTest(n30,
                  {"characterData":true,"characterDataOldValue":true},
                  [{type: "characterData", oldValue: "CCCHANGED" }],
                  function() { n30.deleteData(0, 2); },
                  "characterData Text.deleteData: simple mutation");

  var n31 = document.getElementById('n31').firstChild;
runMutationTest(n31,
                  {"characterData":true,"characterDataOldValue":true},
                  [{type: "characterData", oldValue: "CHANGED" }, {type: "characterData", oldValue: "CHANGED" }],
                  function() { n31.deleteData(0, 0); n31.data = "n31"; },
                  "characterData Text.deleteData: empty mutation");

  var n40 = document.getElementById('n40').firstChild;
runMutationTest(n40,
                  {"characterData":true,"characterDataOldValue":true},
                  [{type: "characterData", oldValue: "CCCHANGED" }],
                  function() { n40.replaceData(0, 2, "CH"); },
                  "characterData Text.replaceData: simple mutation");

  var n41 = document.getElementById('n41').firstChild;
runMutationTest(n41,
                  {"characterData":true,"characterDataOldValue":true},
                  [{type: "characterData", oldValue: "CHANGED" }],
                  function() { n41.replaceData(0, 0, "CH"); },
                  "characterData Text.replaceData: empty mutation");

  var n50 = document.getElementById('n50').firstChild;
runMutationTest(n50,
                  {"characterData":true,"characterDataOldValue":true},
                  [{type: "characterData", oldValue: "?processing data?" },{type: "characterData", oldValue: "CHANGED" },{type: "characterData", oldValue: "CHANGED" }],
                  function() {
                    n50.data = "CHANGED";
                    n50.deleteData(0, 0);
                    n50.replaceData(0, 2, "CH"); },
                  "characterData ProcessingInstruction: data mutations");

  var n60 = document.getElementById('n60').firstChild;
runMutationTest(n60,
                  {"characterData":true,"characterDataOldValue":true},
                  [{type: "characterData", oldValue: " data " },{type: "characterData", oldValue: "CHANGED" },{type: "characterData", oldValue: "CHANGED" }],
                  function() {
                    n60.data = "CHANGED";
                    n60.deleteData(0, 0);
                    n60.replaceData(0, 2, "CH"); },
                  "characterData Comment: data mutations");

  var n70 = document.getElementById('n70');
  var r70 = null;
  test(function () {
    n70.appendChild(document.createTextNode("NNN"));
    n70.appendChild(document.createTextNode("NGED"));
    r70 = document.createRange();
    r70.setStart(n70.firstChild, 4);
    r70.setEnd(n70.lastChild, 1);
   }, "Range (r70) is created");
runMutationTest(n70.firstChild,
                  {"characterData":true,"characterDataOldValue":true},
                  [{type: "characterData", oldValue: "CHANN" }],
                  function() { r70.deleteContents(); },
                  "characterData Range.deleteContents: child and data removal mutation");

  var n71 = document.getElementById('n71');
  var r71 = null;
  test(function () {
    n71.appendChild(document.createTextNode("NNN"));
    n71.appendChild(document.createTextNode("NGED"));
    r71 = document.createRange();
    r71.setStart(n71.firstChild, 4);
    r71.setEnd(n71.lastChild, 1);
   }, "Range (r71) is created");
runMutationTest(n71.lastChild,
                  {"characterData":true,"characterDataOldValue":true},
                  [{type: "characterData", oldValue: "NGED"}],
                  function() { r71.deleteContents(); },
                  "characterData Range.deleteContents: child and data removal mutation (2)");

  var n80 = document.getElementById('n80');
  var r80 = null;
  test(function () {
    n80.appendChild(document.createTextNode("NNN"));
    n80.appendChild(document.createTextNode("NGED"));
    r80 = document.createRange();
    r80.setStart(n80.firstChild, 4);
    r80.setEnd(n80.lastChild, 1);
   }, "Range (r80) is created");
runMutationTest(n80.firstChild,
                  {"characterData":true,"characterDataOldValue":true},
                  [{type: "characterData", oldValue: "CHANN" }],
                  function() { r80.extractContents(); },
                  "characterData Range.extractContents: child and data removal mutation");

  var n81 = document.getElementById('n81');
  var r81 = null;
  test(function () {
    n81.appendChild(document.createTextNode("NNN"));
    n81.appendChild(document.createTextNode("NGED"));
    r81 = document.createRange();
    r81.setStart(n81.firstChild, 4);
    r81.setEnd(n81.lastChild, 1);
   }, "Range (r81) is created");
runMutationTest(n81.lastChild,
                  {"characterData":true,"characterDataOldValue":true},
                  [{type: "characterData", oldValue: "NGED" }],
                  function() { r81.extractContents(); },
                  "characterData Range.extractContents: child and data removal mutation (2)");

  var n90 = document.getElementById('n90').firstChild;
runMutationTest(n90,
                  {"characterDataOldValue":true},
                  [{type: "characterData", oldValue: "CHANN" }],
                  function() { n90.data = "CHANGED"; },
                  "characterData/characterDataOldValue alone Text.data: simple mutation");
