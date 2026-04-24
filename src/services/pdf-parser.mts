import PDFParser from 'pdf2json';

const safeDecode = (str: string) => {
  try {
    return decodeURIComponent(str);
  } catch (e) {
    return str;
  }
};

export const parseSubjectCombinationsPDF = (filePath: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      const results: any[] = [];
      
      pdfData.Pages.forEach((page: any) => {
        const rows = new Map<number, any[]>();
        
        page.Texts.forEach((textItem: any) => {
          const y = Math.round(textItem.y * 10);
          if (!rows.has(y)) {
            rows.set(y, []);
          }
          rows.get(y)!.push(textItem);
        });

        const sortedY = Array.from(rows.keys()).sort((a, b) => a - b);
        
        for (const y of sortedY) {
          const rowTexts = rows.get(y)!;
          rowTexts.sort((a, b) => a.x - b.x);

          let pathway = "";
          let track = "";
          let subjects = "";

          for (const t of rowTexts) {
            const textValue = safeDecode(t.R[0].T).trim();
            if (textValue === 'S/No.' || textValue === 'PATHWAY' || textValue === 'TRACK' || textValue === 'SUBJECTS') {
              continue;
            }
            
            if (t.x > 3.0 && t.x < 8.0) pathway = textValue;
            if (t.x >= 8.0 && t.x < 15.0) track = textValue;
            if (t.x >= 15.0) {
              subjects += (subjects ? " " : "") + textValue;
            }
          }

          if (pathway && track && subjects) {
            results.push({ pathway, track, subjects });
          }
        }
      });
      
      resolve(results);
    });

    pdfParser.loadPDF(filePath);
  });
};

export const parseSchoolsPDF = (filePath: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      // Used for Deduplication, Validation, Enrichment
      resolve(pdfData);
    });

    pdfParser.loadPDF(filePath);
  });
};
