import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>MutationObservers: takeRecords</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script src=\"mutationobservers.js\"/>\n</head><body><h1>MutationObservers: document mutations</h1>\n<div id=\"log\"/>\n\n<script id=\"s001\"/><p id=\"n00\"/><script id=\"s002\"/><script id=\"s003\"/>\n\n<p id=\"n012\"/><div id=\"d01\">\n<script id=\"s011\"/><p id=\"n01\"/></div><script id=\"s012\"/>\n</body></html>"
const document = loadDOM(html, `text/html`)
import fs from "fs";
import vm from "vm";
const src0 = `${process.env.WPT_ROOT}/dom/nodes/mutationobservers.js`;
vm.runInThisContext(fs.readFileSync(src0, "utf8"), src0)

  var setupTest = async_test("setup test");
  var insertionTest = async_test("parser insertion mutations");
  var insertionTest2 = async_test("parser script insertion mutation");
  var testCounter = 0;

  function masterMO(sequence, obs) {
    testCounter++;
    if (testCounter == 1) {
      insertionTest.step(
        function () {
          checkRecords(document, sequence,
                       [{type: "childList",
                         addedNodes: function () {
                           return [ document.getElementById("n00") ];
                         },
                         previousSibling: function () {
                           return document.getElementById("s001");
                         },
                         target: document.body},
                        {type: "childList",
                         addedNodes: function () {
                           return [ document.getElementById("s002") ];
                         },
                         previousSibling: function () {
                           return document.getElementById("n00");
                         },
                         target: document.body},
                        {type: "childList",
                         addedNodes: function () {
                           return [ document.getElementById("s002").firstChild ];
                         },
                         target: function () {
                           return document.getElementById("s002");
                         }}]);
        });
    } else if (testCounter == 2) {
      insertionTest2.step(
        function () {
          checkRecords(document, sequence,
                       [{type: "childList",
                         addedNodes: function () {
                           return [ document.getElementById("inserted_script") ];
                         },
                         target: function () {
                          return document.getElementById("n00");
                         }},
                        {type: "childList",
                         addedNodes: function () {
                           return [ document.getElementById("inserted_element") ];
                         },
                         previousSibling: function () {
                           return document.getElementById("s002");
                         },
                         target: document.body}
                        ]);
        });
    }
  }
  var document_observer;
  var newElement;
  setupTest.step(function() {
    document_observer = new MutationObserver(masterMO);
    newElement = document.createElement("span");
    document_observer.observe(document, {subtree:true,childList:true});
    newElement.id = "inserted_element";
    newElement.setAttribute("style", "display: none");
    newElement.textContent = "my new span for n00";
  });


  var newScript = document.createElement("script");
  setupTest.step(function() {
    newScript.textContent = "document.body.appendChild(newElement);";
    newScript.id = "inserted_script";
    document.getElementById("n00").appendChild(newScript);
  });
  if (testCounter < 1) {
    insertionTest.step(
      function () {
        assert_unreached("document observer did not trigger");
      });
  }


  setupTest.step(function() {
    document_observer.disconnect();
  });
  if (testCounter < 2) {
    insertionTest2.step(
      function () {
        assert_unreached("document observer did not trigger");
      });
  }
  insertionTest.done();
  insertionTest2.done();


  var removalTest = async_test("removal of parent during parsing");
  var d01 = document.getElementById("d01");
  testCounter = 0;

  function removalMO(sequence, obs) {
    testCounter++;
    if (testCounter == 1) {
      removalTest.step(
        function () {
          checkRecords(document, sequence,
                       [{type: "childList",
                         removedNodes: function () {
                           return [ d01 ];
                         },
                         previousSibling: function () {
                           return document.getElementById("n012");
                         },
                         target: document.body}]);
        });
    } else if (testCounter == 2) {
      removalTest.step(
        function () {
          checkRecords(document, sequence,
                       [{type: "childList",
                         addedNodes: function () {
                           return [ document.getElementById("s012") ];
                         },
                         previousSibling: function () {
                           return document.getElementById("n012");
                         },
                         target: document.body},
                        {type: "childList",
                          addedNodes: function () {
                            return [ document.getElementById("s012").firstChild ];
                          },
                          target: function () {
                            return document.getElementById("s012");
                          }}]);
        });
    }
  }
  var document2_observer;
  setupTest.step(function() {
    document2_observer = new MutationObserver(removalMO);
    document2_observer.observe(document, {subtree:true,childList:true});
    d01.parentNode.removeChild(d01);
  });


  setupTest.step(function() {
    document2_observer.disconnect();
  });
  if (testCounter < 2) {
    removalTest.step(
      function () {
        assert_unreached("document observer did not trigger");
      });
  }
  removalTest.done();
  setupTest.done();
