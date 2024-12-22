"use client";

import { useState, useRef } from "react";
import {
  FileText,
  Download,
  Share2,
  Clock,
  FileCheck,
  AlertTriangle,
  CreditCard,
  XCircle,
  Upload,
  ChevronDown,
  MessageSquare,
  Send,
  Scale,
  Info,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import SignatureModal from "./SignatureModal";
import RequestChangesModal from "./RequestChangesModal";

export default function ContractViewer({ template, onStartFromTemplate }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [progress, setProgress] = useState(0);
  const [showSignature, setShowSignature] = useState(false);
  const [signatureData, setSignatureData] = useState(null);
  const [showRequestChanges, setShowRequestChanges] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
    return () => clearInterval(interval);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      await processFile(file);
    } else {
      setError("Please upload a PDF file");
    }
  };

  const processFile = async (file) => {
    setLoading(true);
    setError(null);
    const cleanup = simulateProgress();

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await fetch("/api/analyze-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setProgress(100);
      setSelectedFile(file);
      setAnalysis(data.analysis);
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.message);
    } finally {
      cleanup();
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 500);
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await processFile(file);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleStartOver = () => {
    setSelectedFile(null);
    setAnalysis(null);
    setLoading(false);
    setError(null);
    setExpandedSections({});
    setProgress(0);
    setShowSignature(false);
    setSignatureData(null);
    setShowRequestChanges(false);
    setRequestMessage("");
  };

  const renderAnalysisSection = (title, content, icon, sectionKey) => {
    if (!content) return null;

    const isExpanded = expandedSections[sectionKey] !== false;
    const severity = getSeverityLevel(sectionKey, content);

    return (
      <div className="mb-6 rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center">
            <div
              className={`p-2 rounded-full bg-white shadow-sm ${getSeverityColor(
                severity
              )}`}
            >
              {icon}
            </div>
            <div className="ml-3">
              <h4 className="font-medium text-lg">{title}</h4>
              {!isExpanded && (
                <p className="text-sm text-gray-500 mt-1">
                  {getPreviewText(content)}
                </p>
              )}
            </div>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
              isExpanded ? "transform rotate-180" : ""
            }`}
          />
        </button>

        {isExpanded && (
          <div className="p-4 bg-white">
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    );
  };

  const getSeverityLevel = (sectionKey, content) => {
    if (sectionKey === "risks" && content.toLowerCase().includes("high risk"))
      return "high";
    if (sectionKey === "risks" && content.toLowerCase().includes("medium risk"))
      return "medium";
    return "normal";
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-50";
      case "medium":
        return "bg-yellow-50";
      default:
        return "bg-white";
    }
  };

  const getPreviewText = (content) => {
    return (
      content.split("\n")[0].slice(0, 100) + (content.length > 100 ? "..." : "")
    );
  };

  const handleSignatureSave = (data) => {
    setSignatureData(data);
    setShowSignature(false);
    // Here you would typically submit the signed document
    console.log("Document signed:", data);
  };

  const renderSignedDocument = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Signed Contract</h2>
            <p className="text-sm text-gray-500 mt-1">
              Document has been signed successfully
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
            <button
              onClick={handleStartOver}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <Upload className="h-4 w-4 rotate-180" />
              <span>New Document</span>
            </button>
          </div>
        </div>

        <div className="border rounded-lg p-6 bg-white">
          {/* Original document content would go here */}
          <div className="prose max-w-none">
            {analysis &&
              Object.entries(analysis).map(([key, section]) => (
                <div key={key} className="mb-8">
                  <ReactMarkdown>{section}</ReactMarkdown>
                </div>
              ))}
          </div>

          {/* Signature section at the bottom */}
          <div className="mt-8 pt-8 border-t">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Digitally signed by:
                </p>
                <p className="text-lg font-medium mt-1">John Doe</p>
                <p className="text-sm text-gray-500">
                  Signed on {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="w-64">
                <img
                  src={signatureData}
                  alt="Digital Signature"
                  className="w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleRequestChanges = async (message) => {
    try {
      // Here you would make an API call to submit the change request
      console.log("Requesting changes:", message);
      setShowRequestChanges(false);
      // Show success message
    } catch (error) {
      console.error("Error requesting changes:", error);
      // Show error message
    }
  };

  if (template) {
    return (
      <div
        className="bg-white rounded-lg shadow-sm"
        style={{ height: "calc(100vh - 64px)", overflowY: "auto" }}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">{template.title}</h2>
              <p className="text-gray-600 mt-1">{template.description}</p>
            </div>
            <button
              onClick={() => onStartFromTemplate(template)}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Use Template
            </button>
          </div>
          <div className="mt-6 font-mono text-sm bg-gray-50 p-6 rounded-lg whitespace-pre-wrap">
            {template.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-lg shadow-sm"
      style={{ height: "calc(100vh - 64px)", overflowY: "auto" }}
    >
      <div className="fixed top-0 left-0 right-0 z-50">
        {loading && (
          <div className="w-full h-1 bg-gray-200">
            <div
              className="h-full bg-blue-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {!selectedFile ? (
        <div
          className={`flex-1 flex flex-col items-center justify-center p-12 ${
            dragActive ? "bg-gray-50" : ""
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-center w-full">
            <div
              className={`p-8 bg-white rounded-xl shadow-sm mb-6 border-2 border-dashed ${
                dragActive ? "border-black bg-gray-50" : "border-gray-300"
              } transition-all duration-200`}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Select a contract template
              </h3>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
            </div>
            {error && (
              <div className="flex items-center p-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50">
                <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-b-black"></div>
              <div className="text-center">
                <p className="text-gray-600 font-medium">
                  Analyzing your contract...
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  This may take a few moments
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <FileText className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="ml-3">
                      <span className="text-sm font-medium text-gray-900">
                        {selectedFile.name}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">PDF Document</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors tooltip"
                      title="Download"
                    >
                      <Download className="h-5 w-5 text-gray-600" />
                    </button>
                    <button
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors tooltip"
                      title="Share"
                    >
                      <Share2 className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {analysis && (
                <div className="space-y-6">
                  {signatureData ? (
                    renderSignedDocument()
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-2xl font-semibold text-gray-900">
                            Analysis Results
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            AI-powered analysis of your contract
                          </p>
                        </div>
                        <button
                          onClick={handleStartOver}
                          className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          <Upload className="h-4 w-4 mr-2 rotate-180" />
                          Start Over
                        </button>
                      </div>

                      {renderAnalysisSection(
                        "Key Dates and Deadlines",
                        analysis.keyDates,
                        <Clock className="h-5 w-5 text-blue-500" />,
                        "dates"
                      )}

                      {renderAnalysisSection(
                        "Important Clauses",
                        analysis.importantClauses,
                        <FileCheck className="h-5 w-5 text-green-500" />,
                        "clauses"
                      )}

                      {renderAnalysisSection(
                        "Potential Risks",
                        analysis.potentialRisks,
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />,
                        "risks"
                      )}

                      {renderAnalysisSection(
                        "Payment Terms",
                        analysis.paymentTerms,
                        <CreditCard className="h-5 w-5 text-purple-500" />,
                        "payment"
                      )}

                      {renderAnalysisSection(
                        "Termination Conditions",
                        analysis.terminationConditions,
                        <XCircle className="h-5 w-5 text-red-500" />,
                        "termination"
                      )}

                      {renderAnalysisSection(
                        "Enforceability",
                        analysis.enforceability,
                        <Scale className="h-5 w-5 text-indigo-500" />,
                        "enforceability"
                      )}

                      <div className="flex justify-end space-x-4 mt-8 sticky bottom-0 bg-white p-4 border-t">
                        <button
                          onClick={() => setShowSignature(true)}
                          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium transition-colors flex items-center"
                        >
                          Sign Contract
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {/* Modals */}
      <RequestChangesModal
        isOpen={showRequestChanges}
        onClose={() => setShowRequestChanges(false)}
        onSubmit={handleRequestChanges}
      />

      <SignatureModal
        isOpen={showSignature}
        onClose={() => setShowSignature(false)}
        onSave={handleSignatureSave}
      />
    </div>
  );
}
