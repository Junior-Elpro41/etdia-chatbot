// Attend que tout le contenu de la page (DOM) soit chargé avant d'exécuter le script.
// C'est une bonne pratique pour s'assurer que tous les éléments HTML existent.
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. RÉFÉRENCES AUX ÉLÉMENTS HTML (DOM) ---
    // On stocke les éléments dans des constantes pour y accéder plus rapidement et facilement.
    const chatLauncher = document.getElementById('chat-launcher');
    const chatContainer = document.getElementById('chat-container');
    const closeChatButton = document.getElementById('close-chat-button');
    const langButtons = document.querySelectorAll('.lang-btn');
    const chatLog = document.getElementById('chat-log');
    const chatForm = document.getElementById('chat-form');
    const welcomeText = document.getElementById('welcome-text');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // --- 2. VARIABLES D'ÉTAT DU CHATBOT ---
    // Ces variables permettent de suivre l'état actuel du chat.
    let currentLanguage = null; // Sera 'fr' ou 'en' une fois la langue choisie.
    let etdiaData = null; // Contiendra la base de données (fr ou en) de la langue choisie.
    let isTyping = false; // Empêche l'utilisateur d'envoyer un message pendant que le bot "écrit".
    let conversationLog = []; // NOUVEAU: Stocke l'historique de la conversation de manière indépendante de la langue.

    // --- 3. GESTIONNAIRES D'ÉVÉNEMENTS ---
    // On "écoute" les actions de l'utilisateur (clics, envoi de formulaire).

    // Ouvre/Ferme le chat quand on clique sur le lanceur.
    chatLauncher.addEventListener('click', toggleChat);
    // Ferme le chat quand on clique sur le bouton de fermeture dans l'en-tête.
    closeChatButton.addEventListener('click', toggleChat);

    // Gère le choix de la langue. On boucle sur les deux boutons.
    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            switchLanguage(button.dataset.lang);
        });
    });

    // Gère l'envoi d'un message par l'utilisateur (via la touche "Entrée" ou le bouton d'envoi).
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Empêche le comportement par défaut du formulaire (recharger la page).
        handleUserSubmit();
    });

    // Gère le clic sur un bouton de suggestion dans le chat.
    // C'est une "délégation d'événement" : on écoute les clics sur toute la zone de chat.
    chatLog.addEventListener('click', (e) => {
        // On vérifie si l'élément cliqué est bien un bouton de suggestion.
        if (e.target.classList.contains('suggestion-btn')) {
            const question = e.target.textContent; // On traite la suggestion cliquée comme une nouvelle soumission de l'utilisateur.
            handleUserSubmit(question);
        }
    });

    // --- 4. FONCTIONS PRINCIPALES ---

    /**
     * Affiche ou cache la fenêtre de chat et le lanceur.
     */
    function toggleChat() {
        // Si le chat est sur le point d'être ouvert (il est actuellement caché)
        // et qu'aucune langue n'a encore été définie, c'est la toute première initialisation.
        if (chatContainer.classList.contains('hidden') && !currentLanguage) {
            // On rend le formulaire visible et on active les boutons/champs.
            chatForm.classList.remove('hidden');
            userInput.disabled = false;
            sendButton.disabled = false;

            // On initialise la langue en français par défaut.
            switchLanguage('fr', true); // Le 'true' empêche la notification au premier lancement.
        }

        // On bascule la visibilité du conteneur de chat et du lanceur.
        chatContainer.classList.toggle('hidden');
        chatLauncher.classList.toggle('hidden');
    }


    /**
     * Change la langue du chatbot et retraduit toute la conversation.
     * @param {string} lang - La nouvelle langue ('fr' ou 'en').
     * @param {boolean} isInitial - Indique si c'est le premier chargement (pour ne pas afficher de notif).
     */
    function switchLanguage(lang, isInitial = false) {
        // Si on clique sur la langue déjà active, on ne fait rien.
        if (lang === currentLanguage) return;
    
        currentLanguage = lang;
        // On charge la bonne base de données en fonction du choix.
        etdiaData = (lang === 'fr') ? etdiaContent_fr : etdiaContent_en;
    
        // Met à jour le style des boutons de langue pour montrer lequel est actif.
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
    
        // Met à jour le texte du message de bienvenue défilant.
        updateWelcomeMessage();
    
        // NOUVEAU: On re-génère tout le contenu du chat dans la nouvelle langue.
        renderFullChat();
    
        // Affiche une notification de changement de langue, sauf au premier chargement.
        if (!isInitial) {
            const notificationText = (lang === 'fr') ? "La langue a été changée en Français." : "Language switched to English.";
            // Cette notification est temporaire et n'est pas ajoutée à l'historique.
            addMessage(notificationText, 'bot');
        }
    }

    /**
     * NOUVEAU: Re-génère l'intégralité du chat log à partir de l'historique `conversationLog`.
     */
    function renderFullChat() {
        chatLog.innerHTML = ''; // On vide le chat actuel.

        conversationLog.forEach(entry => {
            if (entry.type === 'user') {
                addMessage(entry.text, 'user');
            } else if (entry.type === 'bot') {
                // Si c'est une suggestion, on la regénère.
                if (entry.suggestionFor) {
                    const suggestions = findSuggestions(entry.suggestionFor);
                    const suggestionText = (currentLanguage === 'fr') ? "Je n'ai pas bien compris votre question. Vouliez-vous dire :" : "I didn't quite understand your question. Did you mean:";
                    let suggestionHtml = `<p>${suggestionText}</p>`;
                    suggestions.forEach(sugg => {
                        suggestionHtml += `<button class="suggestion-btn">${sugg.question_phrases[0]}</button>`;
                    });
                    addMessage(suggestionHtml, 'bot', true);
                } else { // Sinon, c'est une réponse standard basée sur un ID.
                    const dataEntry = etdiaData.find(item => item.id === entry.id);
                    if (dataEntry) {
                        addMessage(dataEntry.answer, 'bot', true);
                    }
                }
            }
        });
    }

    /**
     * Met à jour le texte du message de bienvenue défilant.
     */
    function updateWelcomeMessage() {
        welcomeText.textContent = (currentLanguage === 'fr')
            ? "Bonjour et bienvenue, dans notre site web et dans notre chatbot EtdIA qui est moi. Bonne démarches avec Etudencia et surtout bonne chance pour ton projet d'étude en France. Je suis pour t'aider à réussir ton projet. N'hésitez pas à me poser vos questions. Ton assistant EtdIA"
            : "Hello and welcome to our website and to our chatbot, EtdIA, which is me. I wish you good luck with your studies in France, especially with Etudencia. I'm here to help you succeed. Don't hesitate to ask me any questions. Your EtdIA assistant.";
    }

    /**
     * Gère la soumission du message de l'utilisateur.
     * @param {string} [forcedMessage] - Un message forcé (utilisé par les boutons de suggestion).
     */
    function handleUserSubmit(forcedMessage = null) {
        const messageText = forcedMessage || userInput.value.trim(); // On récupère le texte et on enlève les espaces inutiles.
        if (messageText === '' || isTyping) return; // Si le message est vide ou si le bot écrit, on ne fait rien.

        // NOUVEAU: On ajoute le message à l'historique avant de l'afficher.
        conversationLog.push({ type: 'user', text: messageText });
        addMessage(messageText, 'user'); // Affiche le message de l'utilisateur.
        
        // On ne vide le champ que si ce n'est pas un message forcé (venant d'un clic).
        if (!forcedMessage) {
            userInput.value = ''; // Vide le champ de saisie.
        }
        getBotResponse(messageText); // Demande une réponse au bot.
    }

    /**
     * Ajoute un message à la fenêtre de chat. C'est la fonction centrale pour l'affichage.
     * @param {string} text - Le contenu du message.
     * @param {string} sender - 'user' ou 'bot'.
     * @param {boolean} isHtml - Indique si le texte contient du HTML à interpréter (pour les liens, etc.).
     */
    function addMessage(text, sender, isHtml = false) {
        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add('message', `${sender}-message`);

        // Définit le profil (image/emoji et nom) en fonction de l'expéditeur.
        const profilePicSrc = (sender === 'bot') ? 'assets/robot.png' : '🧑';
        const profileName = (sender === 'bot') ? 'EtdIA' : (currentLanguage === 'fr' ? 'Vous' : 'You');

        // Crée la structure HTML complète du message avec le profil.
        messageWrapper.innerHTML = `
            <div class="profile">
                <div class="profile-pic">${sender === 'bot' ? `<img src="${profilePicSrc}" alt="robot icon">` : profilePicSrc}</div>
                <span class="profile-name">${profileName}</span>
            </div>
            <div class="message-content"></div>
        `;

        const messageContentDiv = messageWrapper.querySelector('.message-content');
        
        // Ajoute le message complet au log de chat.
        chatLog.appendChild(messageWrapper);

        // Gère l'affichage du texte (normal ou HTML).
        if (isHtml) {
            messageContentDiv.innerHTML = text; // Interprète le HTML.
        } else {
            messageContentDiv.textContent = text; // Affiche comme du texte simple (plus sécurisé).
        }

        // Fait défiler automatiquement vers le bas pour voir le dernier message.
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    /**
     * Trouve et affiche la réponse du bot. C'est le "cerveau" principal.
     * @param {string} userMessage - Le message de l'utilisateur.
     */
    function getBotResponse(userMessage) {
        const lowerCaseMessage = userMessage.toLowerCase().trim();
        isTyping = true;
        userInput.disabled = true;
        sendButton.disabled = true;

        // Simule un temps de réflexion du bot pour un effet plus naturel.
        setTimeout(() => {
            // 1. Chercher une salutation.
            let response = findResponse(lowerCaseMessage, "greeting");
            
            // 2. Si ce n'est pas une salutation, chercher une réponse directe (correspondance exacte).
            if (!response) {
                response = findResponse(lowerCaseMessage);
            }

            // 3. Si une réponse directe est trouvée, on l'affiche.
            if (response) {
                // NOUVEAU: On ajoute la réponse à l'historique.
                conversationLog.push({ type: 'bot', id: response.id });
                addMessage(response.answer, 'bot', true); // 'true' pour permettre les liens HTML.
            } else {
                // 4. Si aucune réponse directe, on cherche des suggestions basées sur les mots-clés.
                const suggestions = findSuggestions(lowerCaseMessage);
                if (suggestions.length > 0) {
                    // NOUVEAU: On ajoute la demande de suggestion à l'historique.
                    conversationLog.push({ type: 'bot', suggestionFor: lowerCaseMessage });

                    const suggestionText = (currentLanguage === 'fr')
                        ? "Je n'ai pas bien compris votre question. Vouliez-vous dire :"
                        : "I didn't quite understand your question. Did you mean:";
                    
                    let suggestionHtml = `<p>${suggestionText}</p>`;
                    suggestions.forEach(sugg => {
                        // On prend la première phrase de la liste comme suggestion cliquable.
                        suggestionHtml += `<button class="suggestion-btn">${sugg.question_phrases[0]}</button>`;
                    });
                    addMessage(suggestionHtml, 'bot', true);
                } else {
                    // 5. Si aucune suggestion n'est trouvée, on affiche le message par défaut.
                    // NOUVEAU: On ajoute le fallback à l'historique.
                    conversationLog.push({ type: 'bot', id: 'fallback' });
                    const fallbackResponse = etdiaData.find(item => item.id === 'fallback');
                    addMessage(fallbackResponse.answer, 'bot');
                }
            }

            // Une fois la réponse donnée, on réactive la saisie pour l'utilisateur.
            isTyping = false;
            userInput.disabled = false;
            sendButton.disabled = false;
            userInput.focus();
        }, 800); // Délai de 800ms.
    }

    /**
     * Cherche une réponse directe dans la base de données (correspondance exacte).
     * @param {string} message - Le message de l'utilisateur en minuscules.
     * @param {string} [type] - Optionnel, pour chercher un type spécifique (ex: "greeting").
     * @returns {object|null} - L'objet de réponse trouvé ou null.
     */
    function findResponse(message, type = null) {
        for (const item of etdiaData) {
            // Si on cherche un type spécifique (comme "greeting"), on ignore les autres.
            if (type && item.type !== type) continue;
            
            // Vérifie si une des phrases de question de la base de données correspond exactement au message de l'utilisateur.
            if (item.question_phrases && item.question_phrases.includes(message)) {
                return item; // On a trouvé une correspondance, on retourne l'objet complet.
            }
        }
        return null; // Aucune correspondance trouvée.
    }

    /**
     * Trouve des suggestions pertinentes basées sur les mots-clés du message de l'utilisateur.
     * @param {string} message - Le message de l'utilisateur en minuscules.
     * @returns {Array} - Une liste d'objets de suggestion, triée par pertinence.
     */
    function findSuggestions(message) {
        // On nettoie la ponctuation simple et on sépare le message en mots.
        const userKeywords = message.replace(/[?,.!-]/g, '').split(/\s+/);
        const suggestions = [];

        etdiaData.forEach(item => {
            // On ne suggère pas les salutations ou les messages par défaut.
            if (item.type === 'greeting' || item.id === 'fallback') return;

            let matchScore = 0;
            // On compare chaque mot de l'utilisateur avec les mots-clés de chaque entrée de la base de données.
            userKeywords.forEach(userWord => {
                if (userWord.length > 2 && item.keywords.includes(userWord)) { // On ignore les petits mots.
                    matchScore++;
                }
            });

            // Si au moins un mot-clé correspond, on ajoute l'entrée à la liste des suggestions.
            if (matchScore > 0) {
                suggestions.push({ ...item, score: matchScore });
            }
        });

        // Trie les suggestions par score (du plus pertinent au moins pertinent).
        suggestions.sort((a, b) => b.score - a.score);

        // Retourne les 10 meilleures suggestions au maximum, comme demandé.
        return suggestions.slice(0, 10);
    }
});
