'use client'

import { useState, useRef } from 'react'
import { X, Upload, FileText, Loader, Edit2, Check, ChevronDown, Download, Eye } from 'lucide-react'
import { CONTRACT_TYPES } from '@/app/lib/contractTemplates'
import { saveAs } from 'file-saver'
import { pdf } from '@react-pdf/renderer'
import { ContractPDF } from '../pdf/ContractPDF'

const ContractSection = ({ title, content, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)

  const handleSave = () => {
    onEdit(title, editedContent)
    setIsEditing(false)
  }

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          {isEditing ? <Check onClick={handleSave} /> : <Edit2 size={18} />}
        </button>
      </div>
      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
        />
      ) : (
        <div className="text-gray-600 whitespace-pre-wrap">{content}</div>
      )}
    </div>
  );
};

const PartyInfo = ({ party, role, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedParty, setEditedParty] = useState(party)

  const handleSave = () => {
    onEdit(role.toLowerCase(), editedParty)
    setIsEditing(false)
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-700">{role}:</span>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          {isEditing ? <Check onClick={handleSave} /> : <Edit2 size={18} />}
        </button>
      </div>
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={editedParty.name}
            onChange={(e) => setEditedParty({ ...editedParty, name: e.target.value })}
            placeholder="Name"
            className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
          />
          <input
            type="text"
            value={editedParty.role}
            onChange={(e) => setEditedParty({ ...editedParty, role: e.target.value })}
            placeholder="Role/Title"
            className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
          />
        </div>
      ) : (
        <div className="text-sm space-y-1">
          <div className="text-gray-600">{party.name}</div>
          <div className="text-gray-500">{party.role}</div>
        </div>
      )}
    </div>
  );
};

export default function NewContractModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const editorRef = useRef(null);
  const initialState = {
    type: '',
    template: '',
    details: {
      party1: { name: '', role: '' },
      party2: { name: '', role: '' },
      effectiveDate: ''
    },
    content: null,
  };
  const [contractData, setContractData] = useState(initialState);

  // Format text with markdown-style formatting
  const formatText = (text) => {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  };

  const startEditing = (index, content) => {
    setEditingSection(index);
    setEditedContent(content);
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = formatText(content);
    // Extract text with formatting
    const formattedText = tempDiv.innerHTML;
    setEditedContent(formattedText);
  };

  const saveEdit = () => {
    if (editingSection !== null) {
      const content = editedContent;
      setContractData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          sections: prev.content.sections.map((section, i) => 
            i === editingSection ? { ...section, content } : section
          )
        }
      }));
      setEditingSection(null);
      setEditedContent('');
    }
  };

  const handleClose = () => {
    setStep(1);
    setLoading(false);
    setEditingSection(null);
    setEditedContent('');
    setContractData(initialState);
    onClose();
  };

  const handleInputChange = (field, value) => {
    setContractData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        [field]: value
      }
    }));
  };

  const handlePartyChange = (party, field, value) => {
    setContractData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        [party]: {
          ...prev.details[party],
          [field]: value
        }
      }
    }));
  };

  const handleTemplateChange = (e) => {
    const selectedTemplate = e.target.value;
    setContractData(prev => ({
      ...prev,
      template: selectedTemplate
    }));
  };

  const handleDateChange = (date) => {
    setContractData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        effectiveDate: date
      }
    }));
  };

  const handleSignatureDateChange = (party, date) => {
    setContractData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        signatures: {
          ...prev.content.signatures,
          [party]: {
            ...prev.content.signatures[party],
            date: date
          }
        }
      }
    }));
  };

  const generateContract = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: contractData.type,
          template: contractData.template,
          details: contractData.details,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate contract');
      }

      setContractData(prev => ({
        ...prev,
        content: data.contract
      }));
      setStep(2);
    } catch (error) {
      console.error('Error generating contract:', error);
      // You might want to show an error message to the user here
    } finally {
      setLoading(false);
    }
  };

  const renderTemplateOptions = () => {
    if (!contractData.type || !CONTRACT_TYPES[contractData.type]) return null;

    return Object.entries(CONTRACT_TYPES[contractData.type].templates).map(([key, template]) => (
      <option key={key} value={key}>
        {template.name}
      </option>
    ));
  };

  const renderContractPreview = () => {
    const contract = contractData.content;
    if (!contract) return null;

    return (
      <div className="space-y-8 print:space-y-6">
        {/* Contract Header */}
        <div className="text-center border-b pb-6">
          <h3 className="text-2xl font-bold mb-4">{contract.title}</h3>
          <div className="text-gray-600 flex items-center justify-center space-x-2">
            <span>Effective Date:</span>
            <input
              type="date"
              value={contract.effectiveDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="border-none bg-transparent focus:ring-0 cursor-pointer hover:text-black transition-colors"
            />
          </div>
        </div>

        {/* Parties */}
        <div className="grid grid-cols-2 gap-8 bg-gray-50 p-6 rounded-lg">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">First Party</h4>
            <p className="font-medium">{contract.parties.party1.name}</p>
            <p className="text-gray-600">{contract.parties.party1.role}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Second Party</h4>
            <p className="font-medium">{contract.parties.party2.name}</p>
            <p className="text-gray-600">{contract.parties.party2.role}</p>
          </div>
        </div>

        {/* Contract Sections */}
        <div className="space-y-6">
          {contract.sections.map((section, index) => (
            <div key={index} className="group relative border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                {editingSection === index ? (
                  <>
                    <button
                      onClick={saveEdit}
                      className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                      title="Save changes"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditingSection(null)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      title="Cancel editing"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => startEditing(index, section.content)}
                    className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Edit section"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <h4 className="text-lg font-semibold mb-3 text-gray-800">{section.title}</h4>
              {editingSection === index ? (
                <div className="space-y-4">
                  <div 
                    className="min-h-[200px] p-4 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-black focus-within:border-transparent prose prose-sm max-w-none"
                    contentEditable
                    dangerouslySetInnerHTML={{ __html: editedContent }}
                    onInput={(e) => setEditedContent(e.currentTarget.innerHTML)}
                    ref={editorRef}
                    style={{ 
                      outline: 'none',
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'break-word'
                    }}
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        document.execCommand('bold', false, null);
                        editorRef.current?.focus();
                      }}
                      className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Bold"
                      type="button"
                    >
                      <strong>B</strong>
                    </button>
                    <button
                      onClick={() => {
                        document.execCommand('italic', false, null);
                        editorRef.current?.focus();
                      }}
                      className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Italic"
                      type="button"
                    >
                      <em>I</em>
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ 
                    __html: formatText(section.content)
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Termination */}
        <div className="border-t pt-6">
          <h4 className="text-lg font-semibold mb-2 text-gray-800">Termination</h4>
          <p className="text-gray-700">{contract.termination}</p>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 border-t pt-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-4">First Party Signature</h4>
            <div className="space-y-2">
              <p className="font-medium">{contract.signatures.party1.name}</p>
              <p className="text-gray-600">{contract.signatures.party1.title}</p>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Date:</span>
                <input
                  type="date"
                  value={contract.signatures.party1.date.replace('[Date]', '')}
                  onChange={(e) => handleSignatureDateChange('party1', e.target.value)}
                  className="text-sm text-gray-500 border-none bg-transparent focus:ring-0 cursor-pointer hover:text-black transition-colors"
                />
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-4">Second Party Signature</h4>
            <div className="space-y-2">
              <p className="font-medium">{contract.signatures.party2.name}</p>
              <p className="text-gray-600">{contract.signatures.party2.title}</p>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Date:</span>
                <input
                  type="date"
                  value={contract.signatures.party2.date.replace('[Date]', '')}
                  onChange={(e) => handleSignatureDateChange('party2', e.target.value)}
                  className="text-sm text-gray-500 border-none bg-transparent focus:ring-0 cursor-pointer hover:text-black transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const downloadPDF = async () => {
    try {
      // Pre-format all sections for PDF
      const formattedSections = contractData.content.sections.map(section => ({
        ...section,
        content: formatText(section.content)
      }));

      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${contractData.content.title}</title>
          <style>
            @media print {
              @page {
                margin: 1in;
              }
            }
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 8.5in;
              margin: 0 auto;
              padding: 0.5in;
            }
            .header {
              text-align: center;
              margin-bottom: 1.5em;
              padding-bottom: 1.5em;
              border-bottom: 1px solid #eee;
            }
            .header h1 {
              font-size: 24px;
              margin: 0 0 0.5em 0;
              color: #000;
            }
            .parties {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 2em;
              margin: 1.5em 0;
              padding: 1em;
              background: #f8f8f8;
              border-radius: 4px;
            }
            .parties h3 {
              margin: 0 0 0.5em 0;
              color: #333;
              font-size: 16px;
            }
            .section {
              margin: 1.5em 0;
              page-break-inside: avoid;
            }
            .section h2 {
              font-size: 18px;
              margin: 0 0 0.75em 0;
              color: #000;
            }
            .section p {
              margin: 0.5em 0;
            }
            .signatures {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 2em;
              margin-top: 3em;
              padding-top: 2em;
              border-top: 1px solid #eee;
              page-break-inside: avoid;
            }
            .signature-block {
              text-align: left;
            }
            .signature-block p {
              margin: 0.25em 0;
            }
            .signature-line {
              margin-top: 2em;
              border-top: 1px solid #000;
              width: 200px;
            }
            strong {
              font-weight: 600;
              color: #000;
            }
            em {
              font-style: italic;
            }
            p {
              orphans: 3;
              widows: 3;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${contractData.content.title}</h1>
            <p>Effective Date: ${contractData.content.effectiveDate}</p>
          </div>

          <div class="parties">
            <div>
              <h3>First Party</h3>
              <p><strong>${contractData.content.parties.party1.name}</strong></p>
              <p>${contractData.content.parties.party1.role}</p>
            </div>
            <div>
              <h3>Second Party</h3>
              <p><strong>${contractData.content.parties.party2.name}</strong></p>
              <p>${contractData.content.parties.party2.role}</p>
            </div>
          </div>

          ${formattedSections.map(section => `
            <div class="section">
              <h2>${section.title}</h2>
              <div>${section.content}</div>
            </div>
          `).join('')}

          <div class="section">
            <h2>Termination</h2>
            <p>${formatText(contractData.content.termination)}</p>
          </div>

          <div class="signatures">
            <div class="signature-block">
              <p><strong>${contractData.content.signatures.party1.name}</strong></p>
              <p>${contractData.content.signatures.party1.title}</p>
              <p>Date: ${contractData.content.signatures.party1.date}</p>
              <div class="signature-line"></div>
              <p style="margin-top: 0.25em; font-size: 0.875em; color: #666;">Signature</p>
            </div>
            <div class="signature-block">
              <p><strong>${contractData.content.signatures.party2.name}</strong></p>
              <p>${contractData.content.signatures.party2.title}</p>
              <p>Date: ${contractData.content.signatures.party2.date}</p>
              <div class="signature-line"></div>
              <p style="margin-top: 0.25em; font-size: 0.875em; color: #666;">Signature</p>
            </div>
          </div>
        </body>
        </html>
      `);

      // Wait for styles to load
      setTimeout(() => {
        printWindow.document.close();
        printWindow.print();
      }, 250);

    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  return (
    isOpen ? (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Create New Contract</h2>
          <button 
            onClick={handleClose} 
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {step === 1 ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contract Type
              </label>
              <select
                value={contractData.type}
                onChange={(e) => setContractData(prev => ({ ...prev, type: e.target.value, template: '' }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              >
                <option value="">Select contract type</option>
                {Object.entries(CONTRACT_TYPES).map(([key, type]) => (
                  <option key={key} value={key}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {contractData.type && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template
                </label>
                <select
                  value={contractData.template}
                  onChange={handleTemplateChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                >
                  <option value="">Select template</option>
                  {renderTemplateOptions()}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Party 1 Name
                </label>
                <input
                  type="text"
                  value={contractData.details.party1?.name || ''}
                  onChange={(e) => handlePartyChange('party1', 'name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  placeholder="Enter party 1 name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Party 1 Role
                </label>
                <input
                  type="text"
                  value={contractData.details.party1?.role || ''}
                  onChange={(e) => handlePartyChange('party1', 'role', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  placeholder="Enter party 1 role"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Party 2 Name
                </label>
                <input
                  type="text"
                  value={contractData.details.party2?.name || ''}
                  onChange={(e) => handlePartyChange('party2', 'name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  placeholder="Enter party 2 name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Party 2 Role
                </label>
                <input
                  type="text"
                  value={contractData.details.party2?.role || ''}
                  onChange={(e) => handlePartyChange('party2', 'role', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  placeholder="Enter party 2 role"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Effective Date
              </label>
              <input
                type="date"
                value={contractData.details.effectiveDate || ''}
                onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              />
            </div>

            <button
              onClick={generateContract}
              disabled={!contractData.type || !contractData.template || !contractData.details.party1?.name || !contractData.details.party2?.name}
              className="w-full px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-black/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? <Loader className="h-5 w-5 animate-spin" /> : 'Generate Contract'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-full p-6 border border-gray-300 rounded-lg overflow-y-auto bg-white">
              {renderContractPreview()}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={downloadPDF}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-black/90 transition-colors flex items-center space-x-2"
              >
                <Download className="h-5 w-5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    ) : null
  );
}