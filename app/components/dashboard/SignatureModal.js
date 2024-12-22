'use client'

import { useState, useRef } from 'react'
import SignaturePad from 'react-signature-canvas'
import { PenTool, Type, Upload, X, Trash2, Download } from 'lucide-react'

export default function SignatureModal({ isOpen, onClose, onSave }) {
  const [signatureType, setSignatureType] = useState('draw')
  const [signature, setSignature] = useState('')
  const [selectedFont, setSelectedFont] = useState('dancing-script')
  const sigPadRef = useRef(null)

  const fonts = [
    { name: 'Dancing Script', value: 'dancing-script' },
    { name: 'Homemade Apple', value: 'homemade-apple' },
    { name: 'Alex Brush', value: 'alex-brush' }
  ]

  const signingMethods = [
    {
      id: 'draw',
      title: 'Draw Signature',
      icon: <PenTool className="h-6 w-6" />,
      description: 'Draw your signature using mouse or touch'
    },
    {
      id: 'type',
      title: 'Type Signature',
      icon: <Type className="h-6 w-6" />,
      description: 'Type and choose a signature style'
    },
    {
      id: 'upload',
      title: 'Upload Signature',
      icon: <Upload className="h-6 w-6" />,
      description: 'Upload an image of your signature'
    }
  ]

  const clearSignature = () => {
    if (signatureType === 'draw' && sigPadRef.current) {
      sigPadRef.current.clear()
    } else {
      setSignature('')
    }
  }

  const handleSave = () => {
    let signatureData
    if (signatureType === 'draw' && sigPadRef.current) {
      signatureData = sigPadRef.current.toDataURL()
    } else {
      signatureData = signature
    }
    onSave(signatureData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add Your Signature</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Signing Methods */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {signingMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSignatureType(method.id)}
              className={`p-4 rounded-lg border transition-all ${
                signatureType === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-2 text-gray-600">{method.icon}</div>
                <h3 className="font-medium mb-1">{method.title}</h3>
                <p className="text-xs text-gray-500">{method.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Signature Area */}
        <div className="border rounded-lg p-4 mb-6">
          {signatureType === 'draw' && (
            <div className="h-64 border rounded-lg bg-gray-50">
              <SignaturePad
                ref={sigPadRef}
                canvasProps={{
                  className: 'w-full h-full rounded-lg',
                  style: { backgroundColor: 'rgb(249 250 251)' }
                }}
              />
            </div>
          )}

          {signatureType === 'type' && (
            <div className="space-y-4">
              <select
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {fonts.map(font => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                className={`w-full p-4 border rounded-lg text-3xl text-center font-${selectedFont} focus:ring-2 focus:ring-blue-500`}
                placeholder="Type your signature"
              />
            </div>
          )}

          {signatureType === 'upload' && (
            <div className="text-center p-8">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = (e) => setSignature(e.target.result)
                    reader.readAsDataURL(file)
                  }
                }}
                className="hidden"
                id="signature-upload"
              />
              <label
                htmlFor="signature-upload"
                className="cursor-pointer inline-flex flex-col items-center"
              >
                <Upload className="h-12 w-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Click to upload signature image</span>
              </label>
              {signature && (
                <div className="mt-4">
                  <img src={signature} alt="Uploaded signature" className="max-h-32 mx-auto" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={clearSignature}
            className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </button>
          <div className="space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Apply Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}