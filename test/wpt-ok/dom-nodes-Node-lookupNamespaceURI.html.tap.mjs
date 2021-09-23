import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html>\n<head>\n<title>LookupNamespaceURI and IsDefaultNamespace tests</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head>\n<body>\n<h1>LookupNamespaceURI and IsDefaultNamespace</h1>\n<div id=\"log\"/>\n<script/>\n</body>\n</html>"
const document = loadDOM(html, `text/html`)

function lookupNamespaceURI(node, prefix, expected, name) {
  test(function() {
    assert_equals(node.lookupNamespaceURI(prefix), expected);
  }, name);
}

function isDefaultNamespace(node, namespace, expected, name) {
  test(function() {
    assert_equals(node.isDefaultNamespace(namespace), expected);
  }, name);
}


var frag = document.createDocumentFragment();
lookupNamespaceURI(frag, null, null, 'DocumentFragment should have null namespace, prefix null');
lookupNamespaceURI(frag, '', null, 'DocumentFragment should have null namespace, prefix ""');
lookupNamespaceURI(frag, 'foo', null, 'DocumentFragment should have null namespace, prefix "foo"');
lookupNamespaceURI(frag, 'xmlns', null, 'DocumentFragment should have null namespace, prefix "xmlns"');
isDefaultNamespace(frag, null, true, 'DocumentFragment is in default namespace, prefix null');
isDefaultNamespace(frag, '', true, 'DocumentFragment is in default namespace, prefix ""');
isDefaultNamespace(frag, 'foo', false, 'DocumentFragment is in default namespace, prefix "foo"');
isDefaultNamespace(frag, 'xmlns', false, 'DocumentFragment is in default namespace, prefix "xmlns"');

var docType = document.doctype;
lookupNamespaceURI(docType, null, null, 'DocumentType should have null namespace, prefix null');
lookupNamespaceURI(docType, '', null, 'DocumentType should have null namespace, prefix ""');
lookupNamespaceURI(docType, 'foo', null, 'DocumentType should have null namespace, prefix "foo"');
lookupNamespaceURI(docType, 'xmlns', null, 'DocumentType should have null namespace, prefix "xmlns"');
isDefaultNamespace(docType, null, true, 'DocumentType is in default namespace, prefix null');
isDefaultNamespace(docType, '', true, 'DocumentType is in default namespace, prefix ""');
isDefaultNamespace(docType, 'foo', false, 'DocumentType is in default namespace, prefix "foo"');
isDefaultNamespace(docType, 'xmlns', false, 'DocumentType is in default namespace, prefix "xmlns"');

var fooElem = document.createElementNS('fooNamespace', 'prefix:elem');
fooElem.setAttribute('bar', 'value');

lookupNamespaceURI(fooElem, null, null, 'Element should have null namespace, prefix null');
lookupNamespaceURI(fooElem, '', null, 'Element should have null namespace, prefix ""');
lookupNamespaceURI(fooElem, 'fooNamespace', null, 'Element should not have namespace matching prefix with namespaceURI value');
lookupNamespaceURI(fooElem, 'xmlns', null, 'Element should not have XMLNS namespace');
lookupNamespaceURI(fooElem, 'prefix', 'fooNamespace', 'Element has namespace URI matching prefix');
isDefaultNamespace(fooElem, null, true, 'Empty namespace is not default, prefix null');
isDefaultNamespace(fooElem, '', true, 'Empty namespace is not default, prefix ""');
isDefaultNamespace(fooElem, 'fooNamespace', false, 'fooNamespace is not default');
isDefaultNamespace(fooElem, 'http://www.w3.org/2000/xmlns/', false, 'xmlns namespace is not default');

fooElem.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:bar', 'barURI');
fooElem.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'bazURI');

lookupNamespaceURI(fooElem, null, 'bazURI', 'Element should have baz namespace, prefix null');
lookupNamespaceURI(fooElem, '', 'bazURI', 'Element should have baz namespace, prefix ""');
lookupNamespaceURI(fooElem, 'xmlns', null, 'Element does not has namespace with xlmns prefix');
lookupNamespaceURI(fooElem, 'bar', 'barURI', 'Element has bar namespace');

isDefaultNamespace(fooElem, null, false, 'Empty namespace is not default on fooElem, prefix null');
isDefaultNamespace(fooElem, '', false, 'Empty namespace is not default on fooElem, prefix ""');
isDefaultNamespace(fooElem, 'barURI', false, 'bar namespace is not default');
isDefaultNamespace(fooElem, 'bazURI', true, 'baz namespace is default');

var comment = document.createComment('comment');
fooElem.appendChild(comment);

lookupNamespaceURI(comment, null, 'bazURI', 'Comment should inherit baz namespace');
lookupNamespaceURI(comment, '', 'bazURI', 'Comment should inherit  baz namespace');
lookupNamespaceURI(comment, 'prefix', 'fooNamespace', 'Comment should inherit namespace URI matching prefix');
lookupNamespaceURI(comment, 'bar', 'barURI', 'Comment should inherit bar namespace');

isDefaultNamespace(comment, null, false, 'For comment, empty namespace is not default, prefix null');
isDefaultNamespace(comment, '', false, 'For comment, empty namespace is not default, prefix ""');
isDefaultNamespace(comment, 'fooNamespace', false, 'For comment, fooNamespace is not default');
isDefaultNamespace(comment, 'http://www.w3.org/2000/xmlns/', false, 'For comment, xmlns namespace is not default');
isDefaultNamespace(comment, 'barURI', false, 'For comment, inherited bar namespace is not default');
isDefaultNamespace(comment, 'bazURI', true, 'For comment, inherited baz namespace is default');

var fooChild = document.createElementNS('childNamespace', 'childElem');
fooElem.appendChild(fooChild);

lookupNamespaceURI(fooChild, null, 'childNamespace', 'Child element should inherit baz namespace');
lookupNamespaceURI(fooChild, '', 'childNamespace', 'Child element should have null namespace');
lookupNamespaceURI(fooChild, 'xmlns', null, 'Child element should not have XMLNS namespace');
lookupNamespaceURI(fooChild, 'prefix', 'fooNamespace', 'Child element has namespace URI matching prefix');

isDefaultNamespace(fooChild, null, false, 'Empty namespace is not default for child, prefix null');
isDefaultNamespace(fooChild, '', false, 'Empty namespace is not default for child, prefix ""');
isDefaultNamespace(fooChild, 'fooNamespace', false, 'fooNamespace is not default for child');
isDefaultNamespace(fooChild, 'http://www.w3.org/2000/xmlns/', false, 'xmlns namespace is not default for child');
isDefaultNamespace(fooChild, 'barURI', false, 'bar namespace is not default for child');
isDefaultNamespace(fooChild, 'bazURI', false, 'baz namespace is default for child');
isDefaultNamespace(fooChild, 'childNamespace', true, 'childNamespace is default for child');

document.documentElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:bar', 'barURI');
document.documentElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'bazURI');

lookupNamespaceURI(document, null, 'http://www.w3.org/1999/xhtml', 'Document should have xhtml namespace, prefix null');
lookupNamespaceURI(document, '', 'http://www.w3.org/1999/xhtml', 'Document should have xhtml namespace, prefix ""');
lookupNamespaceURI(document, 'prefix', null, 'Document has no namespace URI matching prefix');
lookupNamespaceURI(document, 'bar', 'barURI', 'Document has bar namespace');

isDefaultNamespace(document, null, false, 'For document, empty namespace is not default, prefix null');
isDefaultNamespace(document, '', false, 'For document, empty namespace is not default, prefix ""');
isDefaultNamespace(document, 'fooNamespace', false, 'For document, fooNamespace is not default');
isDefaultNamespace(document, 'http://www.w3.org/2000/xmlns/', false, 'For document, xmlns namespace is not default');
isDefaultNamespace(document, 'barURI', false, 'For document, bar namespace is not default');
isDefaultNamespace(document, 'bazURI', false, 'For document, baz namespace is not default');
isDefaultNamespace(document, 'http://www.w3.org/1999/xhtml', true, 'For document, xhtml namespace is default');

var comment = document.createComment('comment');
document.appendChild(comment);
lookupNamespaceURI(comment, 'bar', null, 'Comment does not have bar namespace');

