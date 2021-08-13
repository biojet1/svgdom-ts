import "./wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>CharacterData.insertData</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-characterdata-insertdata\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-characterdata-data\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html)

function testNode(create, type) {
  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    assert_throws_dom("INDEX_SIZE_ERR", function() { node.insertData(5, "x") })
    assert_throws_dom("INDEX_SIZE_ERR", function() { node.insertData(5, "") })
  }, type + ".insertData() out of bounds")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    assert_throws_dom("INDEX_SIZE_ERR", function() { node.insertData(-1, "x") })
    assert_throws_dom("INDEX_SIZE_ERR", function() { node.insertData(-0x100000000 + 5, "x") })
  }, type + ".insertData() negative out of bounds")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.insertData(-0x100000000 + 2, "X")
    assert_equals(node.data, "teXst")
  }, type + ".insertData() negative in bounds")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.insertData(0, "")
    assert_equals(node.data, "test")
  }, type + ".insertData('')")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.insertData(0, "X")
    assert_equals(node.data, "Xtest")
  }, type + ".insertData() at the start")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.insertData(2, "X")
    assert_equals(node.data, "teXst")
  }, type + ".insertData() in the middle")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.insertData(4, "ing")
    assert_equals(node.data, "testing")
  }, type + ".insertData() at the end")

  test(function() {
    var node = create()
    node.data = "This is the character data, append more 資料，測試資料";

    node.insertData(26, " test");
    assert_equals(node.data, "This is the character data test, append more 資料，測試資料");
    node.insertData(48, "更多");
    assert_equals(node.data, "This is the character data test, append more 資料，更多測試資料");
  }, type + ".insertData() with non-ascii data")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.data = "🌠 test 🌠 TEST"

    node.insertData(5, "--");  // Counting UTF-16 code units
    assert_equals(node.data, "🌠 te--st 🌠 TEST");
  }, type + ".insertData() with non-BMP data")
}

testNode(function() { return document.createTextNode("test") }, "Text")
testNode(function() { return document.createComment("test") }, "Comment")
