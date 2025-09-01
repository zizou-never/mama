// app.js

// 1. Configuration de la connexion à Supabase
const SUPABASE_URL = https: '//cmaayaqnvfypfgycikhg.supabase.co' ;
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtYWF5YXFudmZ5cGZneWNpa2hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODAwMTUsImV4cCI6MjA3MjI1NjAxNX0.8wef9CTaj113EXb1LajGLinrRKUOfxVn-q0ECBGs20s';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Références aux éléments du DOM
const messageForm = document.getElementById('message-form');
const messagesList = document.getElementById('messages-list');
const nomInput = document.getElementById('nom');
const messageInput = document.getElementById('message');

// 3. Fonction pour récupérer et afficher les messages
async function fetchMessages() {
    // Vider la liste actuelle pour éviter les doublons
    messagesList.innerHTML = 'Chargement...';

    // Requête pour sélectionner tous les messages de la table 'messages'
    const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false }); // Trier par date de création

    if (error) {
        console.error("Erreur lors de la récupération des messages:", error);
        messagesList.innerHTML = '<p>Impossible de charger les messages.</p>';
        return;
    }

    if (messages.length === 0) {
        messagesList.innerHTML = '<p>Aucun message pour le moment. Soyez le premier !</p>';
        return;
    }

    // Afficher les messages
    messagesList.innerHTML = ''; // Vider le "Chargement..."
    messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message-item');
        messageDiv.innerHTML = `<strong>${message.nom}</strong><p>${message.message}</p>`;
        messagesList.appendChild(messageDiv);
    });
}

// 4. Fonction pour gérer l'envoi du formulaire
messageForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page

    const nom = nomInput.value.trim();
    const message = messageInput.value.trim();

    if (nom && message) {
        // Insérer les données dans la table 'messages'
        const { data, error } = await supabase
            .from('messages')
            .insert([{ nom: nom, message: message }]);

        if (error) {
            console.error("Erreur lors de l'envoi du message:", error);
            alert("Une erreur est survenue.");
        } else {
            // Réinitialiser le formulaire
            nomInput.value = '';
            messageInput.value = '';
            // Recharger la liste des messages
            await fetchMessages();
        }
    }
});

// 5. Charger les messages au chargement initial de la page
fetchMessages();
