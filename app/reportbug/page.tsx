'use client'
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle, AlertCircle, Star, Bug } from 'lucide-react'; // Added Bug icon here

// --- INTERFACES ---

interface BugReportData {
  userId: string;
  username: string;
  bugType: string;
  severity: string;
  description: string;
  rating: number;
  screenshot?: string;
}

interface BugReporterCardProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  username: string;
}

// --- BUG REPORTER MODAL COMPONENT ---

const BugReporterCard = ({ isOpen, onClose, userId, username }: BugReporterCardProps) => {
  const [bugType, setBugType] = useState('Functionality');
  const [severity, setSeverity] = useState('Medium');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const cardRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside (useEffect)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Handle screenshot file upload and conversion to base64
  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || isLoading) return;

    setIsLoading(true);
    setStatus('idle');

    const bugReport: BugReportData = {
      userId,
      username,
      bugType,
      severity,
      description,
      rating,
      screenshot: screenshot || undefined,
    };

    console.log("Submitting Bug Report:", bugReport);

    try {
      // Simulation of API call
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      // Simulate success based on description length for demonstration
      if (description.length > 10) {
          setStatus('success');
      } else {
          throw new Error("Simulated API Error: Description too short.");
      }

      // Wait for a moment to show the success message, then close the card.
      setTimeout(() => {
        onClose();
      }, 1500); // Wait 1.5 seconds before closing
      
    } catch (err) {
      console.error("Submission Error:", err);
      setStatus('error');
      // Optional: Reset status after an error so user can try again
      setTimeout(() => setStatus('idle'), 3000);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        >
          <motion.div
            ref={cardRef}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={status === 'success' ? { scale: 0.75, y: -20, opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } } : { scale: 0.9, y: 20, opacity: 0 }}
            className="w-full max-w-xl p-6 bg-white rounded-xl shadow-2xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
              disabled={isLoading}
            >
              <X size={20} />
            </button>

            <AnimatePresence mode="wait">
              {status === 'success' ? (
                // Success Message View
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center justify-center text-center p-8 min-h-[300px]"
                >
                  <motion.div
                    initial={{ scale: 0.5, rotate: -90, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                  >
                    <CheckCircle size={80} className="text-green-500" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900 mt-4">Thank you!</h2>
                  <p className="text-gray-600 mt-2">Your report has been submitted successfully.</p>
                </motion.div>
              ) : (
                // Form View
                <motion.div
                  key="bug-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Report an Issue</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Logged in as: <span className="font-semibold text-gray-800">{username} ({userId})</span>
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Display Error Status if applicable */}
                    {status === 'error' && (
                        <div className="p-3 bg-red-100 text-red-700 rounded-md flex items-center text-sm">
                            <AlertCircle size={16} className="mr-2" />
                            Failed to submit report. Please try again.
                        </div>
                    )}
                    
                    {/* Bug type + Severity */}
                    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                      <div className="flex-1">
                        <label htmlFor="bugType" className="block text-sm font-medium text-gray-700 mb-1">
                          Issue Type
                        </label>
                        <select
                          id="bugType"
                          value={bugType}
                          onChange={(e) => setBugType(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 transition duration-150"
                        >
                          <option value="Functionality">Functionality Error</option>
                          <option value="UI">UI/Visual Bug</option>
                          <option value="Performance">Performance Issue</option>
                          <option value="Data">Data Problem</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
                          Severity
                        </label>
                        <select
                          id="severity"
                          value={severity}
                          onChange={(e) => setSeverity(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 transition duration-150"
                        >
                          <option value="Low">Low - Annoyance</option>
                          <option value="Medium">Medium - Affects some functionality</option>
                          <option value="High">High - Major feature is broken</option>
                          <option value="Critical">Critical - App is unusable</option>
                        </select>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="description"
                        rows={5}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 resize-none transition duration-150"
                        placeholder="e.g., The 'Generate Poster' button does not work after uploading a new image. Please include steps to reproduce."
                        required
                      />
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rate Your Experience (1=Poor, 5=Excellent)
                      </label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={28}
                            className={`cursor-pointer transition-all duration-150 ${
                              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                            } hover:text-yellow-300 hover:scale-110`}
                            onClick={() => setRating(star)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Screenshot */}
                    <div>
                      <label htmlFor="screenshot" className="block text-sm font-medium text-gray-700 mb-1">
                        Attach Screenshot (Optional)
                      </label>
                      <input
                        type="file"
                        id="screenshot"
                        accept="image/*"
                        onChange={handleScreenshotUpload}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {screenshot && (
                        <div className="mt-4 border border-gray-200 rounded-lg p-2 max-h-40 overflow-hidden">
                          <img src={screenshot} alt="Screenshot Preview" className="w-full h-auto rounded-md object-cover" />
                        </div>
                      )}
                    </div>

                    {/* Submit button */}
                    <motion.button
                      type="submit"
                      disabled={isLoading || !description.trim()}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={16} className="mr-2 animate-spin" /> Submitting...
                        </>
                      ) : (
                        'Submit Report'
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- PAGE WRAPPER COMPONENT ---

export default function ReportBugPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Placeholder identity data required by BugReporterCardProps
    const userId = "user-7890";
    const username = "Current User";

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="text-center p-8 bg-white shadow-xl rounded-2xl border border-gray-200 max-w-xl">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Feedback & Issue Reporting</h1>
                <p className="text-gray-600 mb-6">
                    Click the button below to report a technical issue or provide a rating on your recent experience.
                </p>
                
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center space-x-3 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105 ring-4 ring-indigo-200/50"
                >
                    <Bug size={20} />
                    <span>Open Reporter Tool</span>
                </button>
                <p className="text-xs text-gray-400 mt-4">
                    Identity is logged as: {username} ({userId})
                </p>
            </div>

            {/* The animated modal component */}
            <BugReporterCard
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                userId={userId}
                username={username}
            />
        </div>
    );
}