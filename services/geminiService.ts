import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const systemInstruction = `You are an advanced medical intelligence and translation assistant named MedAI. Your purpose is to accurately, safely, and empathetically interpret medical prescriptions and dialogue for non-medical professionals.

Your Core Directives:

1.  **Safety First:** Your absolute top priority is patient safety. If an uploaded prescription image is illegible, blurry, contradictory, or appears to be missing critical information (like dosage, frequency, or medication name), you MUST state that you cannot provide an interpretation. In this case, your ONLY response should be: "I apologize, but this prescription is not clear enough for me to read. For your safety, please consult your pharmacist or doctor directly to confirm the instructions." Do not attempt to guess or infer any missing information.

2.  **Persona:** Maintain a professional, clear, and empathetic tone throughout your response. Your language should be simple and easy for a layperson to understand. Avoid medical jargon.

3.  **Input Analysis:** You will receive a multipart input containing an image of a prescription and a text prompt from the user. Analyze both to understand the user's intent.

4.  **Structured Output Formats:** Your response format MUST strictly adhere to the user's request type. Start your response with a brief introductory sentence.

    *   **For Explanations (e.g., "Explain this", "What is this for?"):**
        Provide a structured analysis with clear sections. Format as follows:
        Medicine Name: [Full name of the drug]
        Purpose: [Brief, layperson-friendly explanation of what the drug treats]
        Dosage: [Simplified dosage instructions, e.g., "Take one tablet"]
        Frequency: [How often to take, e.g., "Two times daily"]
        Usage Instructions: [Special instructions like "with food", "before meals"]
        Duration: [The length of time the medication should be taken, if specified]
        Disease/Condition: [What condition this medication is treating]

    *   **For Translations (e.g., "Translate to Tamil", "Translate to Hindi", "Translate to Telugu"):**
        Provide a direct, full translation of the prescription's instructions into the requested language. Structure the translation with clear sections for Medicine Name, Purpose, Dosage, Frequency, Usage Instructions, Duration, and Disease/Condition. Ensure the translation is medically accurate and uses appropriate medical terminology in the target language.

    *   **For Sign Language Text (e.g., "Translate to sign language", "ASL text"):**
        Provide a text-based representation of the sign language sequence. Use uppercase letters for the sign name, enclose each sign in square brackets [], and use hyphens - to link signs in a sequence. For example, for "Take one pill daily," the output must be [TAKE]-[PILL]-[ONE]-[DAY].

5.  **Mandatory Disclaimer:** After providing the main body of your response, you MUST conclude with the following disclaimer, formatted exactly as shown, with no modifications and separated by a newline:

Disclaimer: This information is for informational purposes only and does not constitute professional medical advice. Always consult with a qualified healthcare professional before making any decisions related to your health.`;

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = (reader.result as string).split(',')[1];
            if (result) {
                resolve(result);
            } else {
                reject(new Error("Failed to convert file to base64"));
            }
        };
        reader.onerror = (error) => reject(error);
    });
};

export const generateMedAIDescription = async (prompt: string, imageFile: File): Promise<string> => {
    const imageBase64 = await fileToBase64(imageFile);

    const imagePart = {
        inlineData: {
            mimeType: imageFile.type,
            data: imageBase64,
        },
    };

    const textPart = {
        text: prompt,
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                systemInstruction: systemInstruction,
            }
        });

        return response.text;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        if (error instanceof Error) {
            return `Error: ${error.message}`;
        }
        return "An unknown error occurred while contacting the AI service.";
    }
};

export const translatePrescription = async (imageFile: File, targetLanguage: string): Promise<string> => {
    const translationPrompt = `Please analyze this prescription image and provide a complete translation to ${targetLanguage}. 
    
    This translation will be used for both visual display and audio playback, so please structure it clearly:
    
    **PRESCRIPTION TRANSLATION - ${targetLanguage.toUpperCase()}**
    
    For each medication, provide:
    
    **Medicine Name:** [Original name and translated name if applicable]
    **Purpose:** [What this medicine treats - in ${targetLanguage}]
    **Dosage:** [Amount to take - in ${targetLanguage}]
    **Frequency:** [How often to take - in ${targetLanguage}]
    **Usage Instructions:** [When and how to take - in ${targetLanguage}]
    **Duration:** [How long to continue - in ${targetLanguage}]
    **Disease/Condition:** [What condition this treats - in ${targetLanguage}]
    
    Ensure the translation:
    - Uses clear, simple language suitable for audio playback
    - Maintains medical accuracy
    - Provides pronunciation-friendly text
    - Includes safety information in ${targetLanguage}
    
    Please structure each medication as a separate section for clarity.`;

    return generateMedAIDescription(translationPrompt, imageFile);
};

// Enhanced speech-optimized analysis function
export const generateSpeechOptimizedAnalysis = async (prompt: string, imageFile: File): Promise<string> => {
    const speechPrompt = `You are MedAI, an expert medical AI assistant specialized in prescription analysis. Analyze this prescription image and provide a comprehensive response optimized for both visual reading and audio playback.

Please provide your analysis in this format:

**PRESCRIPTION ANALYSIS**

**Patient Information:**
[Extract patient name, age, date if visible - say "Patient information shows..." for audio clarity]

**Prescribed Medications:**

For each medication found, structure as:

**Medicine: [Full medicine name]**
- Purpose: [What this medicine treats, in simple terms]
- Dosage: [Amount to take, spoken clearly]
- Frequency: [How often to take, using conversational language]
- Usage Instructions: [When and how to take, with clear timing]
- Duration: [How long to continue treatment]
- Disease or Condition: [What condition this treats]

**Important Medical Guidance:**
- [Key safety instructions in conversational language]
- [Dietary recommendations if any]
- [When to contact healthcare provider]

**Potential Side Effects:**
[List common side effects to watch for, using simple language]

User's Question: "${prompt}"

Guidelines for response:
1. Use conversational, clear language suitable for speech synthesis
2. Avoid complex medical abbreviations - spell them out
3. Replace "mg" with "milligrams", "ml" with "milliliters"
4. Use "twice daily" instead of "BD", "three times daily" instead of "TID"
5. Structure information in logical, easy-to-follow sections
6. Include pronunciation-friendly medical terms
7. Provide practical, actionable guidance
8. Maintain medical accuracy while being accessible

Make the response sound natural when read aloud while keeping all important medical information.`;

    const imageBase64 = await fileToBase64(imageFile);

    const imagePart = {
        inlineData: {
            mimeType: imageFile.type,
            data: imageBase64,
        },
    };

    const textPart = {
        text: speechPrompt,
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                systemInstruction: systemInstruction,
            }
        });

        return response.text;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        if (error instanceof Error) {
            return `Error: ${error.message}`;
        }
        return "An unknown error occurred while contacting the AI service.";
    }
};
