# Premium Full Stack Portfolio

A collection of three modern full-stack projects integrated into a single premium portfolio experience.

## 🚀 Projects Included

1.  **Main Portfolio:** A high-end developer portfolio with 3D backgrounds (Three.js) and smooth motion (GSAP + Lenis).
2.  **SleekTask Manager:** A functional task management app with CRUD operations, drag-and-drop reordering, and backend persistence.
3.  **NeonShop E-commerce:** A futuristic shopping experience with product filtering, search, and a persistent cart.
4.  **AI Assistant Chatbot:** A smart chatbot integrated with the Google Gemini API.

## 🛠️ Technology Stack

-   **Frontend:** HTML5, CSS3 (Custom Properties, Glassmorphism), JavaScript (ES6+), GSAP, Three.js, Lenis.
-   **Backend:** Node.js, Express.js.
-   **Data Storage:** JSON Files (Local persistence).
-   **AI:** Google Gemini Pro API.

## ⚙️ Setup & Installation

1.  **Dependencies:** Ensure you have Node.js installed.
2.  **Install Packages:**
    ```bash
    npm install express body-parser cors
    ```
3.  **API Key:** To use the AI Chatbot, add your Google Gemini API key in `routes/chat.js`:
    ```javascript
    const API_KEY = "YOUR_GEMINI_API_KEY";
    ```
4.  **Run Server:**
    ```bash
    node server.js
    ```
5.  **Access Projects:**
    -   Portfolio: [http://localhost:5000](http://localhost:5000)
    -   Tasks: [http://localhost:5000/task-manager](http://localhost:5000/task-manager)
    -   Store: [http://localhost:5000/ecommerce](http://localhost:5000/ecommerce)
    -   AI Chat: [http://localhost:5000/ai-chatbot](http://localhost:5000/ai-chatbot)

## ✨ Improvements Made

-   **Modular Backend:** Split code into `routes/` for better maintainability.
-   **Performance:** Added lazy loading, visual loading indicators, and optimized animations.
-   **UX:** Implemented smooth scrolling and glassmorphism design system.
-   **Robustness:** Added automatic data file initialization and improved error handling for API calls.
