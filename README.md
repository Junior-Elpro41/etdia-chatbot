# Chatbot EtdIA

## Description

EtdIA est un chatbot intelligent et bilingue (Français/Anglais) conçu pour être intégré sur le site web d'Etudencia. Son objectif est d'aider les visiteurs du site Etudencia (étudiants africains souhaitant étudier en France) à obtenir des informations fiables sur les procédures Campus France, le logement, le visa, l'installation, les démarches administratives, etc.

Le chatbot est construit en utilisant uniquement des technologies web front-end : HTML, CSS, et JavaScript. Il ne nécessite aucune dépendance externe ou backend, ce qui le rend parfait pour une intégration simple via un copier-coller de code dans des plateformes comme Google Sites.


## Fonctionnalités Clés

- **Interface Flottante :** Le chatbot est accessible via une icône flottante non intrusive.
- **Bilingue :** L'utilisateur peut choisir entre le français et l'anglais au début de la conversation.
- **Message de Bienvenue Défilant :** Un message d'accueil personnalisé s'affiche dans un bandeau défilant en haut du chat.
- **Compréhension du Langage :** Le bot répond aux questions directes et aux salutations.
- **Système de Suggestion Intelligent :** Si une question n'est pas comprise, EtdIA analyse les mots-clés et propose une liste de questions pertinentes, classées par ordre de pertinence.
- **Réponses avec Liens :** Le bot peut inclure des liens cliquables dans ses réponses pour rediriger les utilisateurs vers les pages pertinentes du site.
- **Personnalisation :** Profils visuels distincts pour le bot (EtdIA) et l'utilisateur (Vous/You).
- **Traduction Dynamique :** L'historique de la conversation est instantanément retraduit lors du changement de langue.

## Structure des Fichiers

- `index.html`: Structure de base du chatbot.
- `style.css`: Design, couleurs, animations et mise en page.
- `script.js`: Cerveau du chatbot, gère toute la logique et l'interactivité.
- `data_fr.js` / `data_en.js`: Bases de données contenant toutes les connaissances du bot (questions, réponses, mots-clés) pour chaque langue.
- `/assets`: Contient les ressources graphiques comme l'icône du robot.

