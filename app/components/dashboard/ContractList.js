'use client'

import { FileText } from 'lucide-react'

export default function ContractList({ templates, onSelectTemplate }) {
  return (
    <div className="w-80 border-r overflow-y-auto bg-white">
      <div className="p-4 border-b">
        <h2 className="font-medium text-gray-900">Available Templates</h2>
        <p className="text-sm text-gray-500 mt-1">Start with a template or create from scratch</p>
      </div>
      
      {templates.map((template) => (
        <div
          key={template.id}
          onClick={() => onSelectTemplate(template)}
          className="p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="font-medium text-sm">{template.title}</h3>
          </div>
          
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {template.description}
          </p>
          
          <span className="text-xs text-gray-500 mt-2 block">
            Last updated: {new Date(template.lastUpdated).toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            })}
          </span>
        </div>
      ))}

      {templates.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          No templates available
        </div>
      )}
    </div>
  )
}