// components/dashboard/Recent.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { useRouter } from "next/navigation"; // Keep this if you plan to navigate elsewhere

interface CertificatePreview {
  _id: string;
  recipientName: string;
  certificateNo: string;
  programName: string;
  createdAt: string;
}

export default function Recent() {
  const [certificates, setCertificates] = useState<CertificatePreview[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentCertificates = async () => {
    try {
      setLoading(true);
      // Calls the App Router API endpoint
      const response = await fetch("/api/certificates/recent");
      
      // Check for a non-200 status before attempting to parse JSON
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCertificates(data.data);

    } catch (error: any) {
      console.error("Network error fetching certificates:", error.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchRecentCertificates();
  }, []);

  // Function to trigger download from the MongoDB store using the dynamic API route
  const handleDownload = (certificateNo: string) => {
    // Navigates to the dynamic App Router route to get the file
    window.open(`/api/certificates/${certificateNo}/download`, '_blank');
  };

  if (loading) {
    return <p className="text-gray-400 p-4">Loading recent certificates...</p>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Recent Certificates</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {certificates.length > 0 ? (
          certificates.map((cert) => (
            <div
              key={cert._id}
              className="p-5 rounded-xl bg-gray-900 border border-gray-700 shadow-xl flex flex-col justify-between transition-transform hover:scale-[1.02]"
            >
              <div>
                <p className="text-sm font-light text-gray-400 mb-1">Recipient</p>
                <h3 className="text-xl font-semibold text-white truncate mb-3">
                  {cert.recipientName}
                </h3>
                <p className="text-sm text-blue-400 font-medium mb-2">**{cert.programName}**</p>
                <p className="text-xs text-gray-500">
                  **Cert No:** {cert.certificateNo}
                </p>
                <p className="text-xs text-gray-500">
                  **Created:** {new Date(cert.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDownload(cert.certificateNo)}
                className="mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-[#4A90E2] to-[#BD10E0] hover:from-[#3A7ADB] hover:to-[#A30DA3] text-white font-medium py-2 rounded-lg transition-all text-sm"
              >
                <Download size={16} />
                Download PDF
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400 col-span-full">No recent certificates found. Start generating!</p>
        )}
      </div>
    </div>
  );
}