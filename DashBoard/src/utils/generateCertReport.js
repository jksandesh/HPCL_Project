import {jsPDF} from "jspdf";
import JSZip from 'jszip';
import '@/assets/Poppins-normal'

const pdfjsLib = require('pdfjs-dist/webpack');
/*const pdfjsLib = require('pdfjs-dist/build/pdf.js');
const PdfjsWorker = require('pdfjs-dist/build/pdf.worker.js');

pdfjsLib.GlobalWorkerOptions.workerSrc = PdfjsWorker;*/
const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getCurrentDateStr = function() {
    const date = new Date();
    return `${date.getDate()}-${shortMonths[date.getMonth()]}-${date.getFullYear()}`
}

const readAsArrayBuffer = async function(file) {
    return await new Promise((resolve) => {
        let fileReader = new FileReader();
        fileReader.onload = (e) => resolve(fileReader.result);
        fileReader.readAsArrayBuffer(file);
    });
};
const getPDFFromZip = async function(zipFile) {
    const zipContent = await readAsArrayBuffer(zipFile);
    const zip = await JSZip.loadAsync(zipContent);
    let filePath = "";
    zip.forEach((relativePath, zipEntry) => {
        if (zipEntry.name.endsWith('.key.pdf')) {
             //do nothing for key pdf.
        } else if (zipEntry.name.endsWith('.pdf')) {
            filePath = relativePath;
        }
    });
    const content = await zip.file(filePath).async('uint8array');
    return await pdfjsLib.getDocument(content).promise;
};

const getPDFFromFile = async function(pdfFile) {
    const content = await readAsArrayBuffer(pdfFile);
    return await pdfjsLib.getDocument(new Uint8Array(content)).promise;
}

const PDFToImage = async function(pdf, pageNum) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({scale: 1.2});
    const canvas = document.getElementById('cert_canvas') , ctx = canvas.getContext('2d');
    const renderContext = { canvasContext: ctx, viewport: viewport };

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    await page.render(renderContext).promise;
    ctx.fillStyle = "#f32f2f";
    const overlayFactor = 2;
    const borderThickness = 3;
    const borderLength = 80;
    //top left
    ctx.fillRect(overlayFactor, overlayFactor, borderThickness, borderLength);
    ctx.fillRect(overlayFactor, overlayFactor, borderLength, borderThickness);
    //bottom left
    ctx.fillRect(overlayFactor, canvas.height - borderLength - overlayFactor, borderThickness, borderLength);
    ctx.fillRect(overlayFactor, canvas.height - borderThickness - overlayFactor, borderLength, borderThickness);
    //bottom right
    ctx.fillRect(canvas.width - borderLength - overlayFactor, canvas.height - borderThickness - overlayFactor, borderLength, borderThickness);
    ctx.fillRect(canvas.width - borderThickness - overlayFactor, canvas.height - borderLength - overlayFactor, borderThickness, borderLength);
    //top right
    ctx.fillRect(canvas.width - borderThickness - overlayFactor, overlayFactor, borderThickness, borderLength);
    ctx.fillRect(canvas.width - borderLength - overlayFactor, overlayFactor, borderLength, borderThickness);
    return canvas;
};

const exportPage = async function(doc, certImg, address) {

    const headerImg = document.getElementById("report_header");
    const secSignature = document.getElementById("sec_signature");
    doc.setLineHeightFactor(1.5);

    doc.setFont("Poppins");
    doc.addImage(headerImg, "PNG", 47, 10, 501.12, 91.2);

    const docWidth = doc.internal.pageSize.getWidth();
    const imgWidth = docWidth * 0.8;
    const imgHeight = certImg.height*imgWidth/certImg.width;
    doc.addImage(certImg, "JPEG", docWidth*0.1, 209, imgWidth, imgHeight, undefined,'FAST');


    doc.setFontSize(9);
    doc.text("Date: "+getCurrentDateStr(), 468, 114);

    doc.setFontSize(8);
    const fAddress = !address || address.trim() === "" ? "To whom it may concern," : ("To,\n" + address);
    doc.text(fAddress, 53, 124);

    doc.setFontSize(9);
    const contentText = "This is to certify that the above certificate is issued by UNP Education and " +
        "the contents of the above\n certificate are true.";
    doc.text(contentText, docWidth * 0.1 + 10, 209 + imgHeight + 20);

    const footerText = "Website:  www.unp.education          Telephone:  +91 9819111171               Email:  reachout@unp.education";
    doc.text(footerText, 84, 824);
     doc.circle(227, 821, 2.5, "F");
     doc.circle(375, 821, 2.5, "F");


    doc.setFontSize(10);
    doc.text("/s/ Amarendra Vajjhala", 400, 722);
    doc.setFontSize(12);
    doc.text("(AMARENDRA VAJJHALA)", 390, 741);
    doc.text("Director", 434, 756);
    doc.setFontSize(9);
    doc.setLineHeightFactor(1.2);
    doc.text("UNP Education\n" +
        "Kolkata, West Bengal, India - 700006", 464, 769, 'center');
};

const exportPDF = async function(address, {certZip, certPdf}) {
    const doc = new jsPDF("p", "pt", "a4");
    const fileName = certZip ? certZip.name : certPdf.name;
    const certPDF = certZip ? (await getPDFFromZip(certZip)): (await getPDFFromFile(certPdf));
    for(let i = 1; i <= certPDF.numPages; i++) {
        const certImg = await PDFToImage(certPDF, i);
        await exportPage(doc, certImg, address);
        if(i !== certPDF.numPages) {
            doc.addPage();
        }
    }

    //doc.autoPrint();
    // window.open(doc.output('bloburl')) //Dpesn't work on ie-11
    //doc.output('arraybuffer');

    /*const canvas = document.getElementById('msbsde-report-canvas');
    const context = canvas.getContext('2d');
    const scale = 1;

    const pdf = await pdfjsLib.getDocument(doc.output('arraybuffer')).promise;

    const page = await pdf.getPage(1);
    const viewport = page.getViewport({scale});
    // changing canvas.width and/or canvas.height auto-clears the canvas
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({canvasContext: context, viewport: viewport}).promise;
    //window.open(doc.output('bloburl'))
    pdf.destroy();*/
    certPDF.destroy();
    doc.save(fileName.split(".")[0]+"_report.pdf");
};

export default exportPDF;
