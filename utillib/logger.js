const fs = require('fs')

// eslint-disable-next-line no-unused-vars
function logToFile (message) {

  // try {
  //  if (fs.existsSync('/tmp/js_log')) {
  //  file exists
//  var irandom = Math.floor(Math.random() * Math.floor(50))
  var irandom = '2021q1'
  fs.appendFile('./utillib/tmp/shoplog_' + irandom, message + '\r\n', function (err) {
    if (err) {
      return console.log(err)
    }
    console.log('The file was saved!')
  })
  // } else {
  //   }
  // } catch (err) {
  //   console.error(err)
  // }
// Or
//  fs.writeFileSync('/tmp/test-sync', 'Hey there!')
}
module.exports = { logToFile }
