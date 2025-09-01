// app.js

// 1. Configuration de la connexion à Supabase
const SUPABASE_URL = '%VITE_https: //cmaayaqnvfypfgycikhg.supabase.co_URL%' ;
const SUPABASE_ANON_KEY = '%VITE_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtYWF5YXFudmZ5cGZneWNpa2hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODAwMTUsImV4cCI6MjA3MjI1NjAxNX0.8wef9CTaj113EXb1LajGLinrRKUOfxVn-q0ECBGs20s_URL%';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);



// 2. Références aux éléments du DOM
const qcmLoader = document.getElementById('qcm-loader');
const qcmContent = document.getElementById('qcm-content');
const qcmModule = document.getElementById('qcm-module');
const qcmQuestion = document.getElementById('qcm-question');
const qcmOptions = document.getElementById('qcm-options');
const checkAnswerBtn = document.getElementById('check-answer-btn');
const nextQcmBtn = document.getElementById('next-qcm-btn');
const qcmFeedback = document.getElementById('qcm-feedback');
const feedbackText = document.getElementById('feedback-text');
const qcmExplanation = document.getElementById('qcm-explanation');

// 3. Variables pour gérer l'état
let currentQCM = null;
let selectedOption = null;
let isAnswerChecked = false;

// 4. Fonction pour récupérer un QCM aléatoire
async function fetchRandomQCM() {
    // Afficher le loader et cacher le contenu
    qcmLoader.classList.remove('hidden');
    qcmContent.classList.add('hidden');
    resetState();

    // RPC (Remote Procedure Call) pour appeler une fonction SQL qui choisit une ligne au hasard.
    // C'est plus efficace que de télécharger toute la table.
    const { data, error } = await supabase.rpc('get_random_qcm');

    if (error || !data || data.length === 0) {
        console.error("Erreur lors de la récupération du QCM:", error);
        qcmQuestion.textContent = "Impossible de charger la question. Veuillez réessayer.";
        qcmLoader.classList.add('hidden');
        qcmContent.classList.remove('hidden');
        return;
    }
    
    currentQCM = data[0];
    displayQCM(currentQCM);
}

// 5. Fonction pour afficher le QCM
function displayQCM(qcm) {
    qcmModule.textContent = qcm.module;
    qcmQuestion.textContent = qcm.question;
    
    qcmOptions.innerHTML = '';
    qcm.options.forEach(optionText => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = optionText;
        button.addEventListener('click', () => selectOption(button, optionText));
        qcmOptions.appendChild(button);
    });

    qcmLoader.classList.add('hidden');
    qcmContent.classList.remove('hidden');
}

// 6. Fonction pour gérer la sélection d'une option
function selectOption(button, optionText) {
    if (isAnswerChecked) return; // Ne rien faire si la réponse a déjà été vérifiée

    // Retirer la sélection des autres boutons
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
    
    // Ajouter la sélection au bouton cliqué
    button.classList.add('selected');
    selectedOption = optionText;
    checkAnswerBtn.disabled = false;
}

// 7. Fonction pour vérifier la réponse
function checkAnswer() {
    isAnswerChecked = true;
    checkAnswerBtn.disabled = true;

    const correct = selectedOption === currentQCM.correct_answer;

    qcmFeedback.classList.remove('hidden');
    qcmFeedback.classList.toggle('correct', correct);
    qcmFeedback.classList.toggle('incorrect', !correct);
    feedbackText.textContent = correct ? "Félicitations ! C'est la bonne réponse." : `Désolé, la bonne réponse était : ${currentQCM.correct_answer}`;
    
    qcmExplanation.textContent = currentQCM.explanation;
    
    // Mettre en évidence les bonnes et mauvaises réponses
    document.querySelectorAll('.option-btn').forEach(btn => {
        if (btn.textContent === currentQCM.correct_answer) {
            btn.classList.add('correct');
        } else if (btn.classList.contains('selected')) {
            btn.classList.add('incorrect');
        }
    });

    nextQcmBtn.classList.remove('hidden');
}

// 8. Fonction pour réinitialiser l'état pour la prochaine question
function resetState() {
    currentQCM = null;
    selectedOption = null;
    isAnswerChecked = false;
    
    checkAnswerBtn.disabled = true;
    checkAnswerBtn.classList.remove('hidden');
    nextQcmBtn.classList.add('hidden');
    qcmFeedback.classList.add('hidden');
}

// 9. Ajout des écouteurs d'événements
checkAnswerBtn.addEventListener('click', checkAnswer);
nextQcmBtn.addEventListener('click', fetchRandomQCM);

// 10. Lancement initial
// Avant de lancer, nous devons créer la fonction SQL dans Supabase !
// Allez à Supabase -> Database -> SQL Editor -> New Query
// Copiez-collez le code SQL de l'étape suivante et cliquez sur "RUN".
// Après cela, le site fonctionnera.
fetchRandomQCM();
