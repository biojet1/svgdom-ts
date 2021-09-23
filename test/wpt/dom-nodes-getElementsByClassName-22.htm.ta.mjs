import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "./wpthelp.mjs"
const html = "<html><head>\n        <title>getElementsByClassName</title>\n        <meta content=\"move item in collection order\" name=\"description\"/>\n    <link href=\"https://dom.spec.whatwg.org/#dom-document-getelementsbyclassname\" rel=\"help\"/>\n    <script src=\"/resources/testharness.js\"/>\n    <script src=\"/resources/testharnessreport.js\"/>\n</head>\n    <body>\n        <div id=\"log\"/>\n        <div>\n            <div>\n                <a class=\"text link\" href=\"#foo\">test link #foo</a>\n            </div>\n            <b class=\"text\">text</b>\n        </div>\n        <table>\n            <caption class=\"text caption\">text caption</caption>\n            <thead>\n                <tr>\n                    <td class=\"TEXT head\">TEXT head</td>\n                </tr>\n            </thead>\n            <tbody>\n                <tr>\n                    <td class=\"td text1\">td text1</td>\n                </tr>\n                <tr>\n                    <td class=\"td text\">td text</td>\n                </tr>\n                <tr>\n                    <td class=\"td te xt\">td te xt</td>\n                </tr>\n            </tbody>\n            <tfoot>\n                <tr>\n                    <td class=\"TEXT foot\">TEXT foot</td>\n                </tr>\n            </tfoot>\n        </table>\n        <div class=\"xt te\">xt te</div>\n\n        <script type=\"text/javascript\"/>\n</body></html>"
const document = loadDOM(html, `text/html`)

            test(function()
            {
                var collection = document.getElementsByClassName("text");
                assert_equals(collection.length, 4);
                var boldText = document.getElementsByTagName("b")[0];
                document.getElementsByTagName("table")[0].tBodies[0].rows[0].cells[0].appendChild(boldText);

                assert_equals(collection.length, 4);
                assert_equals(collection[0].parentNode.nodeName, "DIV");
                assert_equals(collection[1].parentNode.nodeName, "TABLE");
                assert_equals(collection[2].parentNode.nodeName, "TD");
                assert_equals(collection[3].parentNode.nodeName, "TR");
            }, "move item in collection order");
        