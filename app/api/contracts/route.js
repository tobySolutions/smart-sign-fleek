import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { CONTRACT_TYPES } from '@/app/lib/contractTemplates';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

// Cache for storing generated contracts
const contractCache = new Map();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

// Cache for storing system messages
const systemMessageCache = new Map();

// Generate cache key from request data
function generateCacheKey(type, template, details) {
  return `${type}-${template}-${JSON.stringify(details)}`;
}

// Check if cache entry is valid
function isValidCache(entry) {
  return entry && (Date.now() - entry.timestamp) < CACHE_DURATION;
}

// Generate system message with template sections
function getSystemMessage(contractType, template) {
  const cacheKey = `${contractType}-${template}`;
  if (systemMessageCache.has(cacheKey)) {
    return systemMessageCache.get(cacheKey);
  }

  const sections = template.sections.map(section => `"${section}"`).join(', ');
  const sectionExamples = template.sections.map(section => {
    switch(section) {
      case 'Definitions':
        return `{ "title": "Definitions", "content": "Clear definitions of key terms used in the contract" }`;
      case 'Scope of Work':
        return `{ "title": "Scope of Work", "content": "Detailed description of services or work to be performed" }`;
      case 'Payment Terms':
        return `{ "title": "Payment Terms", "content": "Payment schedule, amounts, and methods" }`;
      default:
        return `{ "title": "${section}", "content": "Detailed content for ${section}" }`;
    }
  }).join(',\n      ');

  const message = {
    role: "system",
    content: `You are a legal contract expert. Generate a professional ${CONTRACT_TYPES[contractType].name} contract using the "${template}" template.
    Return ONLY a JSON object with NO additional text.
    Required sections: ${sections}
    
    Format your response EXACTLY as follows, including ALL required sections:
    {
      "title": "Clear, specific ${CONTRACT_TYPES[contractType].name} contract title",
      "parties": {
        "party1": { "name": "[Party 1 Name]", "role": "[Party 1 Role]" },
        "party2": { "name": "[Party 2 Name]", "role": "[Party 2 Role]" }
      },
      "sections": [
        ${sectionExamples}
      ],
      "effectiveDate": "YYYY-MM-DD",
      "termination": "Specific conditions and process for contract termination",
      "signatures": {
        "party1": { "name": "[Party 1 Name]", "date": "YYYY-MM-DD", "title": "[Title]" },
        "party2": { "name": "[Party 2 Name]", "date": "YYYY-MM-DD", "title": "[Title]" }
      }
    }`
  };

  systemMessageCache.set(cacheKey, message);
  return message;
}

// Validate contract structure
function validateContract(contract, template) {
  try {
    const requiredSections = new Set(template.sections);
    const generatedSections = new Set(contract.sections.map(s => s.title));
    
    const missingSections = [...requiredSections].filter(section => !generatedSections.has(section));
    if (missingSections.length > 0) {
      throw new Error(`Missing required sections: ${missingSections.join(', ')}`);
    }

    // Validate basic structure
    if (!contract.title) throw new Error('Missing contract title');
    if (!contract.parties?.party1?.name || !contract.parties?.party2?.name) {
      throw new Error('Missing party information');
    }
    if (!contract.effectiveDate) throw new Error('Missing effective date');
    if (!contract.termination) throw new Error('Missing termination conditions');
    if (!contract.signatures) throw new Error('Missing signature section');

    return true;
  } catch (error) {
    console.error('Contract validation failed:', error);
    throw error;
  }
}

export async function POST(req) {
  try {
    const { type, template, details } = await req.json();

    // Get the contract template
    const contractType = CONTRACT_TYPES[type];
    if (!contractType) {
      return NextResponse.json({ error: 'Invalid contract type' }, { status: 400 });
    }

    const selectedTemplate = contractType.templates[template];
    if (!selectedTemplate) {
      return NextResponse.json({ error: 'Invalid template' }, { status: 400 });
    }

    // Generate content for each section using AI
    const sectionPromises = selectedTemplate.sections.map(async (section) => {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a legal expert. Generate legally sound content for this contract section like a lawyer. Don't add signature in between sections. Do not include any extra text under than the section text. Be mindful that this text will be processed in the frontend so just the needed text should be returned. Do not include ending text"
          },
          {
            role: "user",
            content: `${section.prompt}\n\nContract details: ${JSON.stringify(details, null, 2)}`
          }
        ],
        temperature: 0.5,
        max_tokens: 1000,
      });

      return {
        title: section.title,
        content: completion.choices[0].message.content.trim()
      };
    });

    const sections = await Promise.all(sectionPromises);

    // Construct the complete contract
    const contract = {
      title: `${contractType.name} - ${selectedTemplate.name}`,
      parties: {
        party1: { 
          name: details.party1?.name || "[Party 1 Name]",
          role: details.party1?.role || "[Party 1 Role]"
        },
        party2: { 
          name: details.party2?.name || "[Party 2 Name]",
          role: details.party2?.role || "[Party 2 Role]"
        }
      },
      sections,
      effectiveDate: details.effectiveDate || new Date().toISOString().split('T')[0],
      termination: "This agreement may be terminated by either party with written notice as specified in the Term and Termination section.",
      signatures: {
        party1: { 
          name: details.party1?.name || "[Party 1 Name]",
          date: "[Date]",
          title: details.party1?.role || "[Title]"
        },
        party2: { 
          name: details.party2?.name || "[Party 2 Name]",
          date: "[Date]",
          title: details.party2?.role || "[Title]"
        }
      }
    };

    return NextResponse.json({ success: true, contract });
  } catch (error) {
    console.error('Error generating contract:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}