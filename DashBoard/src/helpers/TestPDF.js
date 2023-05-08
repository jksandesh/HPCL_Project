const PDFParser = require('pdf2json')
const fs = require('fs')
const pdfParser = new PDFParser(this, 1)
pdfParser.on('pdfParser_dataError', errData => console.error(errData.parserError))
pdfParser.on('pdfParser_dataReady', pdfData => {
  fs.writeFile('./test.txt', pdfParser.getRawTextContent(), () => { console.log('Done.') })
  // const keyValuePairs = extractKeyValuePairs(pdfParser.getRawTextContent())
  // console.log(pdfParser.getRawTextContent())
  var texts = pdfParser.getRawTextContent()
  console.log(texts)

  var nameRegex = /PO Number: (.*)/
  var ageRegex = /PO Date: (\d+)/
  var emailRegex = /GST Type: (\S+@\S+)/

  var name = texts.match(nameRegex)[1]
  var age = parseInt(texts.match(ageRegex)[1])
  var email = texts.match(emailRegex)[1]

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
pdfParser.loadPDF('./AA.pdf')
