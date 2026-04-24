import PDFParser from "pdf2json";
import fs from "fs";

const pdfParser = new PDFParser();

pdfParser.on("pdfParser_dataError", (errData) => console.error(errData.parserError));
pdfParser.on("pdfParser_dataReady", (pdfData) => {
  fs.writeFileSync("/Users/quing/projects/cbc-intelligence/pdf_dump.json", JSON.stringify(pdfData, null, 2));
  console.log("PDF parsed and saved to pdf_dump.json");
});

pdfParser.loadPDF("/Users/quing/projects/cbc-intelligence/subject-combinations-senior-schools.pdf");
