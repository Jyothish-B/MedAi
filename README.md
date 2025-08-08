# MedAI Prescription Assistant

A modern React-based web application that uses Google's Gemini AI to analyze prescription images and provide intelligent interpretations for patients. Features a beautiful homepage and intuitive user interface.

## 📸 Screenshots

### Homepage
![Homepage](https://github.com/Jyothish-B/MedAi/blob/main/AA/public/Screenshot%202025-08-08%20111746.png)
*Modern landing page with gradient design and feature highlights*

### Prescription Assistant
![Prescription Assistant](https://github.com/Jyothish-B/MedAi/blob/main/AA/public/Screenshot%202025-08-08%20112332.png)
*Main AI analysis tool with image upload and question interface*

### AI Analysis Results
![AI Results](https://github.com/Jyothish-B/MedAi/blob/main/AA/public/Screenshot%202025-08-08%20112641.png)
*Example of AI-powered prescription interpretation results*

## ✨ Features

### 🏠 **Beautiful Homepage**
- Modern gradient design with professional UI
- Feature highlights and call-to-action sections
- "How It Works" guide with step-by-step instructions
- Responsive design that works on all devices

### 📷 **Smart Image Upload**
- Drag & drop or click to upload prescription images
- Support for common image formats (JPEG, PNG, etc.)
- Real-time image preview with upload feedback
- Clean, intuitive upload interface

### 🤖 **AI-Powered Analysis**
- Powered by Google Gemini AI for accurate interpretation
- Natural language processing for user questions
- Comprehensive prescription analysis and explanations
- Context-aware responses based on uploaded images

### 🌍 **Multi-language Support**
- Translate prescriptions to different languages
- Support for various international languages
- Text-to-sign language conversion capabilities
- Accessible design for diverse user needs

### 🎨 **Modern User Experience**
- Built with Tailwind CSS for clean, professional styling
- Smooth animations and transitions
- Intuitive navigation with React Router
- Mobile-first responsive design
- Professional medical-themed color scheme

## 🎯 Live Demo

Experience the application live:
- **Homepage**: Clean, modern landing page with feature overview
- **Prescription Assistant**: Upload and analyze prescription images
- **AI Analysis**: Get intelligent interpretations in natural language

## � Pages & Navigation

| Page | Route | Description |
|------|-------|-------------|
| **Homepage** | `/` | Landing page with features overview and navigation |
| **Prescription Assistant** | `/prescription` | Main AI analysis tool with upload functionality |
| **404 Page** | `*` | Custom not-found page for better user experience |

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- A Google Gemini API key
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd medai_-prescription-assistant
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API Key:**
   - Create a `.env.local` file in the root directory
   - Add your Gemini API key:
   ```bash
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser and navigate to:**
   ```
   http://localhost:5173
   ```

### Taking Screenshots

To capture screenshots of your application:

1. **Homepage Screenshot:**
   - Navigate to `http://localhost:5173/`
   - Take a full-page screenshot and save as `screenshots/homepage.png`

2. **Prescription Assistant Screenshot:**
   - Navigate to `http://localhost:5173/prescription`
   - Take a screenshot and save as `screenshots/prescription-assistant.png`

3. **AI Results Screenshot:**
   - Upload a sample prescription image
   - Ask a question and get AI results
   - Take a screenshot and save as `screenshots/ai-results.png`

## How to Use

### From Homepage:
1. **Visit the homepage** at the root URL (`/`)
2. **Click "Try Prescription Assistant"** or "Get Started" to navigate to the main tool
3. **Explore the features** described on the landing page

### In Prescription Assistant:
1. **Upload a prescription image** by dragging and dropping it into the upload area or clicking to browse files
2. **Enter your question** in the text area (e.g., "Explain this prescription", "Translate to Spanish")
3. **Click "Analyze Prescription"** to get AI-powered interpretation
4. **View the results** in the AI Interpretation panel
5. **Navigate back** to homepage using the "← Back to Home" link

## Supported Question Types

- **General Explanation**: "Explain this prescription to me"
- **Translation**: "Translate this to [language]"
- **Sign Language**: "Convert to sign language text"
- **Specific Questions**: "What is this medication for?", "How should I take this?"

## 📁 Project Structure

```
medai_-prescription-assistant/
├── 📄 index.html                 # Main HTML template
├── 📄 index.tsx                  # Application entry point
├── 📄 App.tsx                    # Main app component with routing
├── 📄 index.css                  # Tailwind CSS imports
├── 📄 package.json               # Dependencies and scripts
├── 📄 README.md                  # Project documentation
├── 📄 tailwind.config.js         # Tailwind CSS configuration
├── 📄 vite.config.ts             # Vite build configuration
├── 📄 tsconfig.json              # TypeScript configuration
├── 📂 components/                # React components
│   ├── Homepage.tsx              # 🏠 Landing page component
│   ├── PrescriptionAssistant.tsx # 🤖 Main prescription analysis tool
│   ├── NotFound.tsx              # 🚫 404 error page
│   ├── ImageUploader.tsx         # 📷 Image upload and preview
│   ├── ResponseDisplay.tsx       # 💬 AI response formatting
│   ├── LanguageDropdown.tsx      # 🌍 Language selection
│   ├── SpeechAssistant.tsx       # 🎤 Speech recognition features
│   ├── TextToSignLanguage.tsx    # ♿ Sign language conversion
│   └── Icons.tsx                 # 🎨 SVG icon components
├── 📂 services/                  # External API services
│   ├── geminiService.ts          # 🤖 Google Gemini AI integration
│   └── speechService.ts          # 🎤 Speech recognition service
├── 📂 screenshots/               # 📸 Application screenshots
│   ├── homepage.png              # Homepage screenshot
│   ├── prescription-assistant.png # Main app screenshot
│   └── ai-results.png            # AI results screenshot
└── 📂 public/                    # Static assets
    └── asl_images/               # ASL (Sign Language) images
```

## 🛠️ Technologies Used

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | Frontend framework | 19.x |
| **TypeScript** | Type safety and development experience | 5.8.x |
| **React Router** | Client-side routing and navigation | 7.7.x |
| **Vite** | Build tool and development server | 6.2.x |
| **Tailwind CSS** | Utility-first CSS framework | 3.4.x |
| **Google Gemini AI** | AI analysis and natural language processing | 1.13.x |
| **React Speech Kit** | Speech recognition functionality | 3.0.x |

## 🚀 Build & Deployment

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Deployment Options

The application can be deployed to various platforms:

- **Vercel**: Automatic deployments with Git integration
- **Netlify**: Simple drag-and-drop deployment
- **GitHub Pages**: Free hosting for static sites
- **AWS S3 + CloudFront**: Scalable cloud deployment
- **Firebase Hosting**: Google's hosting platform

### Environment Variables

Make sure to set up the following environment variables in your deployment platform:

```
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

## Important Notes

⚠️ **Disclaimer**: This application is for informational purposes only and does not constitute professional medical advice. Always consult with a qualified healthcare professional before making any decisions related to your health.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is for educational purposes only.
