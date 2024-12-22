// app/components/dashboard/TemplateList.js
'use client'

import { useState } from 'react'
import { FileText } from 'lucide-react'

const templates = {
 employment: {
   id: 'employment',
   title: 'Employment Agreement Template',
   description: 'Standard employment contract template with AI-powered customization',
   lastUpdated: '28/11/2024',
   content: `[Employment Agreement Content]`
 },
 nda: {
   id: 'nda', 
   title: 'Non-Disclosure Agreement (NDA)',
   description: 'Confidentiality agreement template with customizable terms',
   lastUpdated: '28/11/2024',
   content: `[NDA Content]`
 },
 service: {
   id: 'service',
   title: 'Service Agreement',
   description: 'Professional services contract template with scope and terms',
   lastUpdated: '28/11/2024',
   content: `[Service Agreement Content]`
 }
}

export default function TemplateList({ onSelectTemplate }) {
 const [selectedTemplate, setSelectedTemplate] = useState(null)
 const [content, setContent] = useState('')

 const handleTemplateClick = (template) => {
   setSelectedTemplate(template)
   setContent(templates[template.id].content)
   onSelectTemplate(templates[template.id])
 }

 return (
   <div className="border-r w-80 overflow-y-auto">
     <div className="p-4 border-b">
       <h2 className="font-medium text-gray-900">Available Templates</h2>
       <p className="text-sm text-gray-500">Start with a template or create from scratch</p>
     </div>
     
     {Object.values(templates).map(template => (
       <div
         key={template.id}
         onClick={() => handleTemplateClick(template)}
         className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
           selectedTemplate?.id === template.id ? 'bg-blue-50' : ''
         }`}
       >
         <div className="flex items-center">
           <FileText className="h-5 w-5 text-gray-400 mr-2" />
           <h3 className="font-medium text-sm">{template.title}</h3>
         </div>
         
         <p className="mt-1 text-sm text-gray-600">
           {template.description}
         </p>
         
         <span className="text-xs text-gray-500 mt-2 block">
           Last updated: {template.lastUpdated}
         </span>
       </div>
     ))}
   </div>
 )
}


