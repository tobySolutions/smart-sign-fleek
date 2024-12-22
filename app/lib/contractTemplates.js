export const CONTRACT_TYPES = {
  employment: {
    name: 'Employment Contract',
    templates: {
      standard: {
        name: 'Standard Employment Contract',
        sections: [
          {
            title: 'Definitions',
            prompt: 'Generate clear definitions for key terms used in this employment contract including: Employment Period, Compensation, Benefits, Confidential Information, Intellectual Property.'
          },
          {
            title: 'Position and Duties',
            prompt: 'Describe the employee position, job responsibilities, reporting structure, and work expectations.'
          },
          {
            title: 'Compensation',
            prompt: 'Detail the compensation package including salary, bonuses, equity (if any), and payment schedule.'
          },
          {
            title: 'Benefits',
            prompt: 'List all employee benefits including health insurance, vacation days, sick leave, and other perks.'
          },
          {
            title: 'Term and Termination',
            prompt: 'Specify the employment term, notice periods, and conditions for termination by either party.'
          }
        ]
      },
      detailed: {
        name: 'Detailed Employment Contract',
        sections: [
          {
            title: 'Definitions',
            prompt: 'Generate comprehensive definitions for all terms used in this employment contract, including technical and legal terminology.'
          },
          {
            title: 'Position and Duties',
            prompt: 'Provide a detailed description of the position, including specific responsibilities, KPIs, and growth expectations.'
          },
          {
            title: 'Compensation and Benefits',
            prompt: 'Detail the complete compensation package including base salary, bonuses, equity, benefits, and all associated terms.'
          },
          {
            title: 'Intellectual Property',
            prompt: 'Specify IP ownership, assignment of rights, and protection of company intellectual property.'
          },
          {
            title: 'Confidentiality',
            prompt: 'Define confidential information and detail the obligations regarding its protection and non-disclosure.'
          },
          {
            title: 'Non-Competition',
            prompt: 'Specify non-compete terms, duration, geographical scope, and restrictions on future employment.'
          },
          {
            title: 'Term and Termination',
            prompt: 'Detail employment term, renewal conditions, termination scenarios, and associated obligations.'
          }
        ]
      }
    }
  },
  service: {
    name: 'Service Agreement',
    templates: {
      standard: {
        name: 'Standard Service Agreement',
        sections: [
          {
            title: 'Definitions',
            prompt: 'Define key terms used in this service agreement including: Services, Deliverables, Acceptance Criteria, Intellectual Property Rights.'
          },
          {
            title: 'Scope of Services',
            prompt: 'Detail the specific services to be provided, including deliverables and timelines.'
          },
          {
            title: 'Payment Terms',
            prompt: 'Specify payment amounts, schedule, invoicing process, and late payment terms.'
          },
          {
            title: 'Term and Termination',
            prompt: 'Define the agreement duration, renewal terms, and termination conditions.'
          }
        ]
      },
      detailed: {
        name: 'Detailed Service Agreement',
        sections: [
          {
            title: 'Definitions',
            prompt: 'Provide comprehensive definitions for all terms used in this service agreement.'
          },
          {
            title: 'Scope of Services',
            prompt: 'Detail all services, deliverables, milestones, and acceptance criteria.'
          },
          {
            title: 'Service Level Requirements',
            prompt: 'Specify performance standards, metrics, and remedies for non-compliance.'
          },
          {
            title: 'Payment Terms',
            prompt: 'Detail all payment terms, including fees, expenses, invoicing, and payment schedules.'
          },
          {
            title: 'Intellectual Property',
            prompt: 'Specify ownership and licensing of pre-existing and newly created IP.'
          },
          {
            title: 'Confidentiality',
            prompt: 'Define confidential information and detail protection requirements.'
          },
          {
            title: 'Term and Termination',
            prompt: 'Specify agreement duration, renewal options, and termination conditions.'
          }
        ]
      }
    }
  },
  NDA: {
    name: 'Non-Disclosure Agreement',
    templates: {
      standard: {
        name: 'Standard NDA',
        sections: [
          'Confidential Information',
          'Use Restrictions',
          'Term and Termination',
          'Return of Information'
        ]
      },
      detailed: {
        name: 'Detailed NDA',
        sections: [
          'Definitions',
          'Scope of Confidential Information',
          'Permitted Disclosures',
          'Security Measures',
          'Information Handling',
          'Term of Confidentiality',
          'Return or Destruction',
          'Breach and Remedies',
          'Exceptions',
          'Survival Terms'
        ]
      },
      simple: {
        name: 'Simple NDA',
        sections: [
          'Confidentiality',
          'Usage',
          'Duration'
        ]
      }
    }
  },
  Sales: {
    name: 'Sales Contract',
    templates: {
      standard: {
        name: 'Standard Sales',
        sections: [
          'Product Details',
          'Price and Payment',
          'Delivery Terms',
          'Warranty',
          'Return Policy'
        ]
      },
      detailed: {
        name: 'Detailed Sales',
        sections: [
          'Definitions',
          'Product Specifications',
          'Pricing Structure',
          'Payment Terms',
          'Delivery Schedule',
          'Quality Standards',
          'Inspection Rights',
          'Warranty Terms',
          'Return and Refund Policy',
          'Risk Transfer',
          'Insurance Requirements',
          'Force Majeure',
          'Dispute Resolution'
        ]
      },
      simple: {
        name: 'Simple Sales',
        sections: [
          'Product',
          'Price',
          'Delivery',
          'Terms'
        ]
      }
    }
  }
};
