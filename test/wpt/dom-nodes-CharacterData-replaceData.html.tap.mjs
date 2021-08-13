import "./wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>CharacterData.replaceData</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-characterdata-replacedata\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-characterdata-data\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html)

function testNode(create, type) {
  // Step 2.
  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    assert_throws_dom("IndexSizeError", function() { node.replaceData(5, 1, "x") })
    assert_throws_dom("IndexSizeError", function() { node.replaceData(5, 0, "") })
    assert_throws_dom("IndexSizeError", function() { node.replaceData(-1, 1, "x") })
    assert_throws_dom("IndexSizeError", function() { node.replaceData(-1, 0, "") })
    assert_equals(node.data, "test")
  }, type + ".replaceData() with invalid offset")

  // Step 3.
  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.replaceData(2, 10, "yo")
    assert_equals(node.data, "teyo")
  }, type + ".replaceData() with clamped count")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.replaceData(2, -1, "yo")
    assert_equals(node.data, "teyo")
  }, type + ".replaceData() with negative clamped count")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.replaceData(0, 0, "yo")
    assert_equals(node.data, "yotest")
  }, type + ".replaceData() before the start")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.replaceData(0, 2, "y")
    assert_equals(node.data, "yst")
  }, type + ".replaceData() at the start (shorter)")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.replaceData(0, 2, "yo")
    assert_equals(node.data, "yost")
  }, type + ".replaceData() at the start (equal length)")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.replaceData(0, 2, "yoa")
    assert_equals(node.data, "yoast")
  }, type + ".replaceData() at the start (longer)")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.replaceData(1, 2, "o")
    assert_equals(node.data, "tot")
  }, type + ".replaceData() in the middle (shorter)")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.replaceData(1, 2, "yo")
    assert_equals(node.data, "tyot")
  }, type + ".replaceData() in the middle (equal length)")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.replaceData(1, 1, "waddup")
    assert_equals(node.data, "twaddupst")
    node.replaceData(1, 1, "yup")
    assert_equals(node.data, "tyupaddupst")
  }, type + ".replaceData() in the middle (longer)")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.replaceData(1, 20, "yo")
    assert_equals(node.data, "tyo")
  }, type + ".replaceData() at the end (shorter)")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.replaceData(2, 20, "yo")
    assert_equals(node.data, "teyo")
  }, type + ".replaceData() at the end (same length)")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.replaceData(4, 20, "yo")
    assert_equals(node.data, "testyo")
  }, type + ".replaceData() at the end (longer)")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.replaceData(0, 4, "quux")
    assert_equals(node.data, "quux")
  }, type + ".replaceData() the whole string")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.replaceData(0, 4, "")
    assert_equals(node.data, "")
  }, type + ".replaceData() with the empty string")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.data = "This is the character data test, append 資料，更多資料";

    node.replaceData(33, 6, "other");
    assert_equals(node.data, "This is the character data test, other 資料，更多資料");
    node.replaceData(44, 2, "文字");
    assert_equals(node.data, "This is the character data test, other 資料，更多文字");
  }, type + ".replaceData() with non-ASCII data")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.data = "🌠 test 🌠 TEST"

    node.replaceData(5, 8, "--");  // Counting UTF-16 code units
    assert_equals(node.data, "🌠 te--ST");
  }, type + ".replaceData() with non-BMP data")
}

testNode(function() { return document.createTextNode("test") }, "Text")
testNode(function() { return document.createComment("test") }, "Comment")
