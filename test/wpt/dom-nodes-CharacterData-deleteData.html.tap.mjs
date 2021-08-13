import "./wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>CharacterData.deleteData</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-characterdata-deletedata\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-characterdata-data\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html)

function testNode(create, type) {
  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    assert_throws_dom("INDEX_SIZE_ERR", function() { node.deleteData(5, 10) })
    assert_throws_dom("INDEX_SIZE_ERR", function() { node.deleteData(5, 0) })
    assert_throws_dom("INDEX_SIZE_ERR", function() { node.deleteData(-1, 10) })
    assert_throws_dom("INDEX_SIZE_ERR", function() { node.deleteData(-1, 0) })
  }, type + ".deleteData() out of bounds")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.deleteData(0, 2)
    assert_equals(node.data, "st")
  }, type + ".deleteData() at the start")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.deleteData(2, 10)
    assert_equals(node.data, "te")
  }, type + ".deleteData() at the end")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.deleteData(1, 1)
    assert_equals(node.data, "tst")
  }, type + ".deleteData() in the middle")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.deleteData(2, 0)
    assert_equals(node.data, "test")

    node.deleteData(0, 0)
    assert_equals(node.data, "test")
  }, type + ".deleteData() with zero count")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.deleteData(2, -1)
    assert_equals(node.data, "te")
  }, type + ".deleteData() with small negative count")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.deleteData(1, -0x100000000 + 2)
    assert_equals(node.data, "tt")
  }, type + ".deleteData() with large negative count")

  test(function() {
    var node = create()
    node.data = "This is the character data test, append more 資料，更多測試資料";

    node.deleteData(40, 5);
    assert_equals(node.data, "This is the character data test, append 資料，更多測試資料");
    node.deleteData(45, 2);
    assert_equals(node.data, "This is the character data test, append 資料，更多資料");
  }, type + ".deleteData() with non-ascii data")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.data = "🌠 test 🌠 TEST"

    node.deleteData(5, 8);  // Counting UTF-16 code units
    assert_equals(node.data, "🌠 teST");
  }, type + ".deleteData() with non-BMP data")
}

testNode(function() { return document.createTextNode("test") }, "Text")
testNode(function() { return document.createComment("test") }, "Comment")
