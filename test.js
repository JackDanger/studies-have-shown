app = require('./Source/content_script')


function mustBe(expected, actual) {
  if (expected != actual) {
    throw("Did not match!: " + expected + " | " + actual)
  }
}

tests = [
  ["A new study from the University of Oxford has shown", "my momma "],
  ["A new study has shown", "my momma said"],
  ["Studies have shown", ""],
  ["A study has shown", ""],
  ["A study showed", ""],
  ["A new study has shown", ""],
  ["A new study showed", ""],
]

for (var i in tests) {
  var input = tests[i][0]
  var output = tests[i][1]
  app.replacements = ['my momma said'] 
  mustBe(output, app.replaceText(input))
}
