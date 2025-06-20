import React, { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";

const PDFToolsPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [operation, setOperation] = useState<"merge" | "compress" | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      setOutputUrl(null);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const resetFiles = () => {
    setFiles([]);
    setOutputUrl(null);
  };

  // Funzione per unire i PDF
  const handleMerge = async () => {
    if (files.length < 1) return;

    setLoading(true);
    setOperation("merge");
    setProgress(0);

    try {
      const mergedPdf = await PDFDocument.create();
      const totalFiles = files.length;

      // Aggiungi una pagina di copertina
      const coverPage = mergedPdf.addPage();
      const { width, height } = coverPage.getSize();
      coverPage.drawText("Documenti Uniti", {
        x: 50,
        y: height / 2,
        size: 30,
        color: rgb(0, 0, 0),
      });

      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        try {
          const bytes = await file.arrayBuffer();
          const pdf = await PDFDocument.load(bytes);
          const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          pages.forEach((page) => mergedPdf.addPage(page));

          setProgress(Math.round(((i + 1) / totalFiles) * 100));
        } catch (err) {
          console.error(`Error processing file ${file.name}:`, err);
        }
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: "application/pdf" });
      setOutputUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error("Merge error:", err);
      alert("Errore durante l'unione dei PDF. Controlla che tutti i file siano validi.");
    } finally {
      setLoading(false);
      setOperation(null);
    }
  };

  // Funzione per comprimere PDF
  const handleCompress = async () => {
    if (files.length === 0) return;

    setLoading(true);
    setOperation("compress");
    setProgress(0);

    try {
      const compressedPdf = await PDFDocument.create();
      const totalFiles = files.length;

      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        try {
          const bytes = await file.arrayBuffer();
          const pdf = await PDFDocument.load(bytes, {
            ignoreEncryption: true,
          });

          // Ottimizzazione
          pdf.setTitle("");
          pdf.setAuthor("");
          pdf.setSubject("");
          pdf.setKeywords([]);
          pdf.setProducer("");
          pdf.setCreator("");

          const pages = await compressedPdf.copyPages(pdf, pdf.getPageIndices());
          pages.forEach((page) => compressedPdf.addPage(page));

          setProgress(Math.round(((i + 1) / totalFiles) * 100));
        } catch (err) {
          console.error(`Error processing file ${file.name}:`, err);
        }
      }

      const compressedBytes = await compressedPdf.save({
        useObjectStreams: false,
        // Altre opzioni di compressione
        // useCompression: true,
        // throwOnInvalidObject: false,
      });

      const blob = new Blob([compressedBytes], { type: "application/pdf" });
      setOutputUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error("Compress error:", err);
      alert("Errore durante la compressione. Controlla che tutti i file siano validi.");
    } finally {
      setLoading(false);
      setOperation(null);
    }
  };

  // Funzione per unire e poi comprimere
  const handleMergeAndCompress = async () => {
    if (files.length < 1) return;

    setLoading(true);
    setOperation("merge");
    setProgress(0);

    try {
      // Prima unisci i PDF
      const mergedPdf = await PDFDocument.create();
      const totalFiles = files.length;

      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        try {
          const bytes = await file.arrayBuffer();
          const pdf = await PDFDocument.load(bytes);
          const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          pages.forEach((page) => mergedPdf.addPage(page));

          setProgress(Math.round(((i + 1) / totalFiles) * 50)); // Prima metà per merge
        } catch (err) {
          console.error(`Error processing file ${file.name}:`, err);
        }
      }

      // Poi comprimi il risultato
      setOperation("compress");
      const compressedBytes = await mergedPdf.save({
        useObjectStreams: false,
        // Altre opzioni di compressione
      });

      setProgress(100);
      const blob = new Blob([compressedBytes], { type: "application/pdf" });
      setOutputUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error("Merge and compress error:", err);
      alert("Errore durante l'unione e compressione. Controlla che tutti i file siano validi.");
    } finally {
      setLoading(false);
      setOperation(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">PDF Tools</h1>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">Carica PDF (puoi selezionare più file)</label>
        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          disabled={loading}
        />
      </div>

      {files.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">File selezionati ({files.length})</h3>
            <button onClick={resetFiles} className="text-sm text-red-600 hover:text-red-800">
              Rimuovi tutti
            </button>
          </div>
          <ul className="border rounded-md divide-y divide-gray-200 max-h-60 overflow-y-auto">
            {files.map((file, index) => (
              <li key={index} className="px-4 py-2 flex justify-between items-center">
                <span className="text-sm truncate max-w-xs">{file.name}</span>
                <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700" disabled={loading}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {loading && (
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">{operation === "merge" ? "Unione in corso..." : "Compressione in corso..."}</span>
            <span className="text-sm font-medium text-gray-700">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={handleMerge}
          disabled={files.length < 1 || loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300 hover:bg-blue-700 transition-colors">
          Unisci PDF
        </button>
        <button
          onClick={handleCompress}
          disabled={files.length === 0 || loading}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-300 hover:bg-green-700 transition-colors">
          Comprimi PDF
        </button>
        <button
          onClick={handleMergeAndCompress}
          disabled={files.length < 1 || loading}
          className="px-4 py-2 bg-purple-600 text-white rounded disabled:bg-gray-300 hover:bg-purple-700 transition-colors">
          Unisci e Comprimi
        </button>
      </div>

      {outputUrl && (
        <div className="mt-6">
          <a
            href={outputUrl}
            download={files.length === 1 ? files[0].name.replace(".pdf", "") + "_compressed.pdf" : "documenti_uniti.pdf"}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
            Scarica PDF
          </a>
        </div>
      )}

      <div className="text-sm text-gray-500 mt-6 space-y-2">
        <p>• Carica uno o più PDF per unirli, comprimerli o entrambi.</p>
        <p>• L'unione crea un unico file con tutte le pagine in ordine.</p>
        <p>• La compressione riduce le dimensioni rimuovendo metadati e ottimizzando il contenuto.</p>
      </div>
    </div>
  );
};

export default PDFToolsPage;
