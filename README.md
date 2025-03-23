# AI-Powered Resume Builder

A modern web application that helps users create professional resumes with AI assistance.

## Features

- User authentication with Firebase
- AI-powered resume content generation
- Professional resume templates
- PDF export functionality
- Real-time preview
- Responsive design

## Tech Stack

- Vue 3 + Vite
- Firebase (Authentication & Firestore)
- Tailwind CSS
- OpenAI API
- html2pdf.js

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- OpenAI API key

## Setup

1. Clone the repository:
```bash
git clone https://github.com/RahimjonovBoburjon/AI-Resume-Builder.git
cd AI-Resume-Builder
```

2. Install dependencies:
```bash
npm install
```

3. Create a Firebase project and enable Authentication and Firestore.

4. Create a `.env` file in the root directory with your Firebase configuration:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_OPENAI_API_KEY=your_openai_api_key
```

5. Start the development server:
```bash
npm run dev
```

## Usage

1. Sign up or log in to your account
2. Fill out the resume form with your information
3. The AI will help enhance your content
4. Preview your resume
5. Download as PDF

## Project Structure

```
📂 resume-builder  
 ├── 📂 src  
 │    ├── 📂 assets            # Static resources
 │    ├── 📂 components        # UI components
 │    ├── 📂 views             # Pages
 │    ├── 📂 router            # Vue Router configuration
 │    ├── 📂 firebase          # Firebase configuration
 │    ├── App.vue              # Root component
 │    └── main.js              # Entry point
 ├── package.json              # Dependencies
 ├── vite.config.js            # Vite configuration
 └── index.html                # Main HTML file
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
