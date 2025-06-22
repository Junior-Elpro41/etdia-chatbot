// File containing all the chatbot's "knowledge" for the English version.
// It's a simple variable (an array of objects) that will be loaded by the HTML file.

const etdiaContent_en = [
    // --- CATEGORY: GREETINGS ---
    // The bot will look in this category first.
    {
        id: "greeting",
        keywords: ["hello", "hi", "hey", "good morning", "good evening", "yo"],
        question_phrases: ["hello", "hi"], // Typical phrases for an exact match
        answer: "Hello! I am EtdIA, your assistant. How can I help you today?",
        type: "greeting" // A special type to identify them easily
    },
    {
        id: "how_are_you",
        keywords: ["how", "are", "you", "doing"],
        question_phrases: ["how are you?", "how are you doing?"],
        answer: "I'm an artificial intelligence, so I'm always doing great! I'm ready to answer your questions about your study project in France.",
        type: "greeting"
    },

    // --- CATEGORY: CONTACT (Based on Footer info) ---
    // Each piece of site information is turned into a unit of knowledge.
    {
        id: "contact_phone",
        keywords: ["number", "phone", "contact", "call"],
        question_phrases: ["what is your phone number?", "how to contact you by phone?", "etudencia number"],
        answer: "Etudencia's phone number is 📞 (+33) 7 58 85 17 39. Feel free to call us during our business hours.",
        category: "Contact"
    },
    {
        id: "contact_email",
        keywords: ["email", "mail", "address", "write"],
        question_phrases: ["what is your email address?", "how to contact you by email?"],
        answer: "You can write to us at the following address: 📧 etudencia@gmail.com. We usually reply quickly!",
        category: "Contact"
    },

    // --- CATEGORY: PROCEDURES (Based on the sitemap) ---
    {
        id: "procedure_steps",
        keywords: ["procedure", "steps", "how", "to", "do", "campus", "france", "detailed"],
        question_phrases: ["how to do the campus france procedure?", "what are the steps of the procedure?", "details for study in france procedure"],
        // The URL #URL_PAGE_PROCEDURES will need to be replaced with the actual link from your site.
        answer: "The procedure for studying in France is a detailed journey. We have a complete section that guides you step by step. You can view it here: <a href='#URL_PAGE_PROCEDURES' target='_blank'>Detailed Procedure Steps</a>.",
        category: "Procedures"
    },

    // --- FALLBACK MESSAGE (if no suggestions are found) ---
    // This is the last resort answer.
    {
        id: "fallback",
        answer: "I'm sorry, I couldn't find any relevant suggestions for your question. Please try rephrasing it or ask about our services, procedures, or how to contact us."
    }
];
