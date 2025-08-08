import React from 'react';
import { LoadingSpinner, WarningIcon } from './Icons';

interface ResponseDisplayProps {
  response: string;
  isLoading: boolean;
  error: string | null;
}

interface MedicationInfo {
  medicineName: string;
  purpose: string;
  dosage: string;
  frequency: string;
  usage: string;
  duration: string;
  disease: string;
}

const parseMedicationInfo = (text: string): MedicationInfo[] => {
  const medications: MedicationInfo[] = [];
  
  // Remove disclaimer first
  const disclaimerIndex = text.indexOf("Disclaimer:");
  const mainContent = disclaimerIndex !== -1 ? text.substring(0, disclaimerIndex) : text;
  
  // Split by medicine sections or try to extract info
  const lines = mainContent.split('\n').filter(line => line.trim());
  
  let currentMed: Partial<MedicationInfo> = {};
  let hasData = false;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Remove asterisks and clean up the line
    const cleanLine = trimmedLine.replace(/^\*+\s*/, '').replace(/\*+$/, '').trim();
    
    if (cleanLine.toLowerCase().includes('medicine name:') || cleanLine.toLowerCase().includes('medication:')) {
      // If we have previous medication data, save it
      if (hasData && currentMed.medicineName) {
        medications.push({
          medicineName: currentMed.medicineName || '',
          purpose: currentMed.purpose || '',
          dosage: currentMed.dosage || '',
          frequency: currentMed.frequency || '',
          usage: currentMed.usage || '',
          duration: currentMed.duration || '',
          disease: currentMed.disease || ''
        });
      }
      
      currentMed = {};
      currentMed.medicineName = cleanLine.split(':')[1]?.trim() || '';
      hasData = true;
    } else if (cleanLine.toLowerCase().includes('purpose:') || cleanLine.toLowerCase().includes('indication:')) {
      currentMed.purpose = cleanLine.split(':')[1]?.trim() || '';
    } else if (cleanLine.toLowerCase().includes('dosage:') || cleanLine.toLowerCase().includes('dose:')) {
      currentMed.dosage = cleanLine.split(':')[1]?.trim() || '';
    } else if (cleanLine.toLowerCase().includes('frequency:') || cleanLine.toLowerCase().includes('how often:')) {
      currentMed.frequency = cleanLine.split(':')[1]?.trim() || '';
    } else if (cleanLine.toLowerCase().includes('usage:') || cleanLine.toLowerCase().includes('instructions:')) {
      currentMed.usage = cleanLine.split(':')[1]?.trim() || '';
    } else if (cleanLine.toLowerCase().includes('duration:') || cleanLine.toLowerCase().includes('period:')) {
      currentMed.duration = cleanLine.split(':')[1]?.trim() || '';
    } else if (cleanLine.toLowerCase().includes('disease:') || cleanLine.toLowerCase().includes('condition:')) {
      currentMed.disease = cleanLine.split(':')[1]?.trim() || '';
    }
  }
  
  // Add the last medication if exists
  if (hasData && currentMed.medicineName) {
    medications.push({
      medicineName: currentMed.medicineName || '',
      purpose: currentMed.purpose || '',
      dosage: currentMed.dosage || '',
      frequency: currentMed.frequency || '',
      usage: currentMed.usage || '',
      duration: currentMed.duration || '',
      disease: currentMed.disease || ''
    });
  }
  
  return medications;
};

const StructuredResponse: React.FC<{ text: string }> = ({ text }) => {
  const medications = parseMedicationInfo(text);
  
  // Get disclaimer
  const disclaimerIndex = text.indexOf("Disclaimer:");
  const disclaimerContent = disclaimerIndex !== -1 ? text.substring(disclaimerIndex) : '';
  
  if (medications.length === 0) {
    // Fallback to original formatting if parsing fails
    return (
      <div className="text-base text-slate-600 whitespace-pre-wrap font-sans">
        {text.split('\n').map((line, index) => {
          const cleanLine = line.replace(/^\*+\s*/, '').replace(/\*+$/, '').trim();
          if (cleanLine.startsWith('Disclaimer:')) {
            return (
              <div key={index} className="mt-6 pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500 italic">{cleanLine}</p>
              </div>
            );
          }
          return <p key={index} className="mb-2">{cleanLine}</p>;
        })}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {medications.map((med, index) => (
        <div key={index} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-300 pb-2">
            {med.medicineName || `Medication ${index + 1}`}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {med.purpose && (
              <div className="bg-white p-3 rounded-lg">
                <h4 className="font-medium text-slate-700 text-sm mb-1">Purpose</h4>
                <p className="text-slate-600 text-sm">{med.purpose}</p>
              </div>
            )}
            
            {med.dosage && (
              <div className="bg-white p-3 rounded-lg">
                <h4 className="font-medium text-slate-700 text-sm mb-1">Dosage</h4>
                <p className="text-slate-600 text-sm">{med.dosage}</p>
              </div>
            )}
            
            {med.frequency && (
              <div className="bg-white p-3 rounded-lg">
                <h4 className="font-medium text-slate-700 text-sm mb-1">Frequency</h4>
                <p className="text-slate-600 text-sm">{med.frequency}</p>
              </div>
            )}
            
            {med.usage && (
              <div className="bg-white p-3 rounded-lg">
                <h4 className="font-medium text-slate-700 text-sm mb-1">Usage Instructions</h4>
                <p className="text-slate-600 text-sm">{med.usage}</p>
              </div>
            )}
            
            {med.duration && (
              <div className="bg-white p-3 rounded-lg">
                <h4 className="font-medium text-slate-700 text-sm mb-1">Duration</h4>
                <p className="text-slate-600 text-sm">{med.duration}</p>
              </div>
            )}
            
            {med.disease && (
              <div className="bg-white p-3 rounded-lg">
                <h4 className="font-medium text-slate-700 text-sm mb-1">Disease/Condition</h4>
                <p className="text-slate-600 text-sm">{med.disease}</p>
              </div>
            )}
          </div>
        </div>
      ))}
      
      {disclaimerContent && (
        <div className="mt-6 pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 italic">{disclaimerContent}</p>
        </div>
      )}
    </div>
  );
};

export const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ response, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500">
        <LoadingSpinner className="w-10 h-10" />
        <p className="mt-4 text-lg">Analyzing your prescription...</p>
        <p className="text-sm">Please wait a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-600 bg-red-50 p-4 rounded-lg">
        <WarningIcon className="w-10 h-10 mb-3" />
        <p className="font-semibold text-center">{error}</p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <p className="text-center">Your prescription analysis will appear here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-none">
      <StructuredResponse text={response} />
    </div>
  );
};
