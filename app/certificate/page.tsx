"use client";

import React, { useEffect, useState } from "react";
// Assuming you have 'fontkit' and 'pdf-lib' installed and available
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb } from "pdf-lib";

import { Calendar, Cloud, Download, Check, AlertTriangle } from "lucide-react";

// --- InputComponent Definition ---

interface InputProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon?: React.ReactNode;
}

const InputComponent: React.FC<InputProps> = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon,
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        // Modern, light-theme input styling
        className="w-full bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150 ease-in-out"
      />
      {icon && (
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 pointer-events-none">
          {icon}
        </span>
      )}
    </div>
  </div>
);

// --- Main Editor Component ---

export default function Editor() {
  // State from original code
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [programName, setProgramName] = useState("Robotics Training Program");
  const [operationText, setOperationText] = useState(
    "to operate the SSI Mantra Surgical Robotic System"
  );
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const [doi, setDoi] = useState(formatDate(new Date()));
  const [certificateNo, setCertificateNo] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true); 
  const [exportStatus, setExportStatus] = useState<
    "idle" | "uploading" | "downloading" | "complete" | "error"
  >("idle");

  const handleDoiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
    if (v.length > 5) v = v.slice(0, 5) + "/" + v.slice(5, 9);
    setDoi(v);
  };

  // PDF Generation Effect
  useEffect(() => {
    let objectUrl: string | null = null;
    const generatePdf = async () => {
      setIsLoading(true);
      try {
        const existingPdfBytes = await fetch("/certificates/certificate1.pdf").then((res) =>
          res.arrayBuffer()
        );
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        pdfDoc.registerFontkit(fontkit);

        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        const soraBytes = await fetch("/fonts/Sora-Regular.ttf").then((res) => res.arrayBuffer());
        const soraFont = await pdfDoc.embedFont(soraBytes);

        const soraSemiBoldBytes = await fetch("/fonts/Sora-SemiBold.ttf").then((res) =>
          res.arrayBuffer()
        );
        const soraSemiBoldFont = await pdfDoc.embedFont(soraSemiBoldBytes);

        // PDF Drawing logic
        let y = firstPage.getHeight() - 180;
        const x = 55;
        const cap = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
        const fullName = `${cap(firstName)} ${cap(lastName)}`.trim();

        if (fullName) {
          firstPage.drawText(fullName, {
            x,
            y,
            size: 18,
            font: soraFont,
            color: rgb(0, 0, 0),
          });
        }

        if (hospitalName) {
          firstPage.drawText(hospitalName, {
            x,
            y: y - 20,
            size: 8,
            font: soraSemiBoldFont,
            color: rgb(0, 0, 0),
          });
        }

        if (programName) {
          firstPage.drawText(programName, {
            x,
            y: y - 76,
            size: 7,
            font: soraSemiBoldFont,
            color: rgb(0, 0, 0),
          });
        }

        if (operationText) {
          firstPage.drawText(operationText, {
            x,
            y: y - 100,
            size: 7,
            font: soraSemiBoldFont,
            color: rgb(0, 0, 0),
          });
        }

        if (doi) {
          const fontSize = 7;
          const margin = 40;
          const textWidth = soraSemiBoldFont.widthOfTextAtSize(doi, fontSize);
          const pageWidth = firstPage.getWidth();
          firstPage.drawText(doi, {
            x: Math.max(margin, (pageWidth - textWidth) / 2) - 65,
            y: margin + 37,
            size: fontSize,
            font: soraSemiBoldFont,
            color: rgb(0, 0, 0),
            maxWidth: pageWidth - margin * 2,
          });
        }

        if (certificateNo) {
          const fontSize = 7;
          const margin = 40;
          const textWidth = soraSemiBoldFont.widthOfTextAtSize(certificateNo, fontSize);
          const pageWidth = firstPage.getWidth();
          firstPage.drawText(certificateNo, {
            x: pageWidth - textWidth - margin - 105,
            y: margin + 38,
            size: fontSize,
            font: soraSemiBoldFont,
            color: rgb(0, 0, 0),
          });
        }
        
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([new Uint8Array(pdfBytes)], {
          type: "application/pdf",
        });
        objectUrl = URL.createObjectURL(blob);
        setPreviewUrl(objectUrl);
      } catch (error) {
        console.error("Failed to generate PDF:", error);
        setPreviewUrl("");
      } finally {
        setIsLoading(false);
      }
    };

    generatePdf();

    // Cleanup function to revoke the Blob URL
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [firstName, lastName, hospitalName, programName, operationText, doi, certificateNo]);

  // Export Logic
  const handleExport = async () => {
    if (!previewUrl) return;

    setExportStatus("uploading");
    setIsLoading(true);

    try {
      const res = await fetch(previewUrl);
      const blob = await res.blob();

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate upload

      const fileName = `${certificateNo || "certificate"}-${firstName || "user"}.pdf`;

      setExportStatus("downloading");

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setExportStatus("complete");
      setTimeout(() => setExportStatus("idle"), 2000);
    } catch (err) {
      console.error("Upload/Download error:", err);
      setExportStatus("error");
      setTimeout(() => setExportStatus("idle"), 3000); // Clear error after delay
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions for button state
  const getButtonContent = () => {
    switch (exportStatus) {
      case "uploading":
        return (
          <div className="flex items-center justify-center gap-2">
            <Cloud size={18} className="animate-pulse" />
            <span className="truncate">Uploading...</span>
          </div>
        );
      case "downloading":
        return (
          <div className="flex items-center justify-center gap-2">
            <Download size={18} className="animate-bounce" />
            <span className="truncate">Preparing Download...</span>
          </div>
        );
      case "complete":
        return (
          <div className="flex items-center justify-center gap-2">
            <Check size={18} />
            <span className="truncate">Download Complete!</span>
          </div>
        );
      case "error":
        return (
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle size={18} />
            <span className="truncate">Export Failed!</span>
          </div>
        );
      default:
        return isLoading ? "Generating Preview..." : "Export & Download PDF";
    }
  };

  const getButtonClass = () => {
    const base =
      "w-full text-white text-base font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed";

    switch (exportStatus) {
      case "uploading":
        return `${base} bg-yellow-500 hover:bg-yellow-600`;
      case "downloading":
        return `${base} bg-blue-600 hover:bg-blue-700`;
      case "complete":
        return `${base} bg-green-500 hover:bg-green-600`;
      case "error":
        return `${base} bg-red-600 hover:bg-red-700`;
      default:
        return `${base} bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300`;
    }
  };

  return (
    // Outer container: Full screen, using py-8 to reduce vertical height consumption
    <div className="min-h-screen bg-gray-50 flex justify-center p-4 sm:p-6 lg:py-8 lg:px-12">
      {/* Main Content Area: Maximum width for a wider look */}
      <div className="flex flex-col w-full max-w-full xl:max-w-screen-2xl">

        {/* Editor Layout: Responsive Flex/Grid */}
        {/* Removed height restriction. min-h-full is used to push the footer/end content if needed */}
        <div className="flex flex-col lg:flex-row w-full gap-6 lg:gap-8">
          
          {/* Left Column: Input Panel - Takes 1/3 on large screens for a wider preview area */}
          <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-xl p-6 lg:p-8 flex flex-col gap-6 border border-gray-100 shrink-0">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-2">
              Certificate Details
            </h2>
            <p className="mt-2 text-base text-gray-600">
                Instantly customize and generate a professional training certificate using the input fields below. The preview will update in real-time.
              </p>
            
            {/* Input fields container: Now wider, using a responsive grid for max horizontal spread */}
            <div className="flex flex-col gap-5 flex-grow overflow-y-auto pr-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputComponent
                  label="First Name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g., Jane"
                />
                <InputComponent
                  label="Last Name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g., Doe"
                />
              </div>

              {/* Grouped items for better vertical flow */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputComponent
                  label="Hospital/Affiliation"
                  type="text"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  placeholder="e.g., St. Jude's Hospital"
                />
                <InputComponent
                  label="Program Name"
                  type="text"
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                  placeholder="e.g., Advanced Training"
                />
              </div>

              <InputComponent
                label="Operation/Achievement Text"
                type="text"
                value={operationText}
                // Using a slightly wider text area simulation for this longer field
                onChange={(e) => setOperationText(e.target.value)}
                placeholder="e.g., successfully completed the robotic system training"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputComponent
                  label="Date of Issue (DD/MM/YYYY)"
                  type="text"
                  value={doi}
                  onChange={handleDoiChange}
                  placeholder="DD/MM/YYYY"
                  icon={<Calendar size={18} />}
                />
                <InputComponent
                  label="Certificate No."
                  type="text"
                  value={certificateNo}
                  onChange={(e) => setCertificateNo(e.target.value)}
                  placeholder="e.g., CERT-12345"
                />
              </div>
            </div>

            {/* Export Button */}
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={handleExport}
                className={getButtonClass()}
                disabled={
                  !previewUrl ||
                  isLoading ||
                  exportStatus === "uploading" ||
                  exportStatus === "downloading"
                }
              >
                {getButtonContent()}
              </button>
            </div>
          </div>

          {/* Right Column: Preview Area - Takes 2/3 on large screens */}
          <div className="w-full lg:w-2/2 bg-white rounded-xl shadow-xl flex items-center justify-center p-4 sm:p-6 lg:p-8 border border-gray-100 min-h-[60vh]">
            <div className="w-full h-full border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center bg-gray-200/50">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center text-gray-500 p-8">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                  <p className="mt-4 text-lg font-medium">
                    Generating Certificate Preview...
                  </p>
                </div>
              ) : previewUrl ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-full min-h-[500px] border-none rounded-lg shadow-inner"
                  title="Certificate Preview"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500 p-8 text-center">
                  <AlertTriangle size={32} className="text-red-500 mb-2" />
                  <p className="text-lg font-medium">
                    Preview Failed to Load.
                  </p>
                  <p className="text-sm mt-1">
                    Please ensure the PDF and font files are in your `/public` folder.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}