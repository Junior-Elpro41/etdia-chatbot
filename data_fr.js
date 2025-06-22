// Fichier contenant toutes les "connaissances" du chatbot pour la version française.
// C'est une simple variable (un tableau d'objets) qui sera chargée par le fichier HTML.

const etdiaContent_fr = [
    // --- CATÉGORIE : SALUTATIONS ---
    // Le bot cherchera dans cette catégorie en premier.
    {
        id: "greeting",
        keywords: ["bonjour", "salut", "coucou", "hello", "bonsoir", "yo", "bjr", "slt"],
        question_phrases: ["bonjour", "salut"], // Phrases types pour une correspondance exacte
        answer: "Bonjour ! Je suis EtdIA, votre assistant. Comment puis-je vous aider aujourd'hui ?",
        type: "greeting" // Un type spécial pour les identifier facilement
    },
    {
        id: "how_are_you",
        keywords: ["vas", "allez", "comment", "ca va", "vas-tu", "allez-vous"],
        question_phrases: ["comment ça va ?", "comment vas-tu ?", "comment allez-vous ?"],
        answer: "Je suis une intelligence artificielle, donc je vais toujours bien ! Je suis prêt à répondre à vos questions sur votre projet d'études en France.",
        type: "greeting"
    },

    // --- CATÉGORIE : CONTACT (Basé sur les infos du Footer) ---
    // Chaque information du site est transformée en une unité de connaissance.
    {
        id: "contact_phone",
        keywords: ["numéro", "téléphone", "tel", "contacter", "joindre", "appel", "appeler"],
        question_phrases: ["quel est votre numéro de téléphone ?", "comment vous contacter par téléphone ?", "donnez-moi le numéro etudencia"],
        answer: "Le numéro de téléphone d'Etudencia est le 📞 (+33) 7 58 85 17 39. N'hésitez pas à nous appeler pendant nos horaires d'ouverture.",
        category: "Contact"
    },
    {
        id: "contact_email",
        keywords: ["email", "courriel", "mail", "écrire", "adresse"],
        question_phrases: ["quelle est votre adresse email ?", "comment vous contacter par email ?"],
        answer: "Vous pouvez nous écrire à l'adresse suivante : 📧 etudencia@gmail.com. Nous répondons généralement rapidement !",
        category: "Contact"
    },

    // --- CATÉGORIE : PROCÉDURES (Basé sur l'arborescence du site) ---
    {
        id: "procedure_steps",
        keywords: ["procédure", "étapes", "comment", "faire", "campus", "france", "détaillées"],
        question_phrases: ["comment faire la procédure campus france ?", "quelles sont les étapes de la procédure ?", "détails procédure études en france"],
        // L'URL #URL_PAGE_PROCEDURES devra être remplacée par le vrai lien de votre site.
        answer: "La procédure d'études en France est un parcours détaillé. Nous avons une section complète qui vous guide pas à pas. Vous pouvez la consulter ici : <a href='#URL_PAGE_PROCEDURES' target='_blank'>Étapes Détaillées de la Procédure</a>.",
        category: "Procédures"
    },

    // --- MESSAGE PAR DÉFAUT (si aucune suggestion n'est trouvée) ---
    // C'est la réponse de dernier recours.
    {
        id: "fallback",
        answer: "Désolé, je n'ai pas trouvé de suggestions pertinentes pour votre question. Veuillez essayer de la reformuler ou de poser une question sur nos services, nos procédures ou comment nous contacter."
    }
];
