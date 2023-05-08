const PDFJS = require('pdfjs-dist')
const pdfParse = require('pdf-parse')
const fs = require('fs')

// Load the PDF file
PDFJS.getDocument('input.pdf').then(function (pdf) {
  // Get the first page of the PDF
  pdfParse(text).then(function (parsedText) {
    // Analyze the parsed text to extract relevant information
    var nameRegex = /Name: (.*)/
    var ageRegex = /Age: (\d+)/
    var emailRegex = /Email: (\S+@\S+)/

    var name = parsedText.text.match(nameRegex)[1]
    var age = parseInt(parsedText.text.match(ageRegex)[1])
    var email = parsedText.text.match(emailRegex)[1]

    // Create an object to store the key-value pairs
    var data = {
      Name: name,
      Age: age,
      Email: email
    }

    // Convert the data object to JSON and save it to a file
    var json = JSON.stringify(data)
    fs.writeFile('output.json', json, function (err) {
      if (err) {
        console.log(err)
      } else {
        console.log('Data saved to output.json')
      }
    })
  })
})
