// Initialisation de Supabase
const supabaseUrl = "https://xfpkiowdevrrhsaundrz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmcGtpb3dkZXZycmhzYXVuZHJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mjk2MDYsImV4cCI6MjA3MjMwNTYwNn0.Lqqyo1asUKQl5AK9AElS1xwlAjLVG9uP20z2lr_wzn8";
const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

// Éléments DOM
const loadingSection = document.getElementById('loading-section');
const contentSection = document.getElementById('content-section');
const moduleTag = document.getElementById('module-tag');
const questionTitle = document.getElementById('question-title');
const optionsContainer = document.getElementById('options-container');
const checkAnswerBtn = document.getElementById('check-answer-btn');
const nextQuestionBtn = document.getElementById('next-question-btn');
const feedbackSection = document.getElementById('feedback-section');
const feedbackText = document.getElementById('feedback-text');
const explanationSection = document.getElementById('explanation-section');
const explanationText = document.getElementById('explanation-text');

// Variables d'état
let currentQuestion = null;
let selectedOption = null;
let isAnswerChecked = false;

// Charger une question aléatoire
async function loadRandomQuestion() {
    try {
        // Afficher le loader
        loadingSection.style.display = 'flex';
        contentSection.style.display = 'none';
        resetState();

        // Récupérer toutes les questions
        const { data, error } = await supabase
            .from('qcm')
            .select('*');

        if (error) {
            throw new Error(`Erreur de base de données: ${error.message}`);
        }

        if (!data || data.length === 0) {
            throw new Error('Aucune question trouvée dans la base de données');
        }

        // Choisir une question aléatoire
        const randomIndex = Math.floor(Math.random() * data.length);
        currentQuestion = data[randomIndex];

        // Afficher la question
        displayQuestion(currentQuestion);
    } catch (error) {
        console.error('Erreur:', error);
        showFallbackQuestion();
    }
}

// Afficher la question
function displayQuestion(question) {
    moduleTag.textContent = question.module;
    questionTitle.textContent = question.question;

    // Nettoyer les options précédentes
    optionsContainer.innerHTML = '';

    // Créer les boutons d'options
    if (Array.isArray(question.options)) {
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.textContent = option;
            button.addEventListener('click', () => selectOption(button, option));
            optionsContainer.appendChild(button);
        });
    } else {
        // Si les options ne sont pas un tableau, créer des options par défaut
        ['Option A', 'Option B', 'Option C', 'Option D'].forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
            button.addEventListener('click', () => selectOption(button, option));
            optionsContainer.appendChild(button);
        });
    }

    // Masquer le loader et afficher le contenu
    loadingSection.style.display = 'none';
    contentSection.style.display = 'block';
}

// Sélectionner une option
function selectOption(button, option) {
    if (isAnswerChecked) return;

    // Désélectionner toutes les autres options
    document.querySelectorAll('.option-button').forEach(btn => {
        btn.classList.remove('selected');
    });

    // Sélectionner cette option
    button.classList.add('selected');
    selectedOption = option;
    checkAnswerBtn.disabled = false;
}

// Vérifier la réponse
function checkAnswer() {
    if (!selectedOption || !currentQuestion) return;

    isAnswerChecked = true;
    checkAnswerBtn.disabled = true;

    const isCorrect = selectedOption === currentQuestion.correct_answer;

    // Afficher le feedback
    feedbackSection.classList.add('show');
    feedbackText.textContent = isCorrect 
        ? 'Félicitations ! C\'est la bonne réponse.' 
        : `Désolé, la bonne réponse était : ${currentQuestion.correct_answer}`;

    // Mettre en surbrillance la bonne réponse
    document.querySelectorAll('.option-button').forEach(btn => {
        if (btn.textContent.includes(currentQuestion.correct_answer)) {
            btn.classList.add('correct');
        } else if (btn.classList.contains('selected')) {
            btn.classList.add('incorrect');
        }
        btn.disabled = true;
    });

    // Afficher l'explication si disponible
    if (currentQuestion.explanation) {
        explanationSection.classList.add('show');
        explanationText.textContent = currentQuestion.explanation;
    }

    // Afficher le bouton "Question suivante"
    nextQuestionBtn.style.display = 'inline-block';
}

// Passer à la question suivante
function nextQuestion() {
    loadRandomQuestion();
}

// Réinitialiser l'état
function resetState() {
    selectedOption = null;
    isAnswerChecked = false;
    checkAnswerBtn.disabled = true;
    nextQuestionBtn.style.display = 'none';
    feedbackSection.classList.remove('show');
    explanationSection.classList.remove('show');
}

// Afficher une question de secours en cas d'erreur
function showFallbackQuestion() {
    const fallbackQuestions = [
        {
            module: "JavaScript",
            question: "Quel mot-clé est utilisé pour déclarer une variable constante en JavaScript?",
            options: ["var", "let", "const", "static"],
            correct_answer: "const",
            explanation: "Le mot-clé 'const' est utilisé pour déclarer des variables dont la valeur ne peut pas être modifiée après son assignation."
        },
        {
            module: "CSS",
            question: "Quelle propriété CSS est utilisée pour définir l'espace entre les lignes d'un texte?",
            options: ["line-spacing", "line-height", "spacing", "text-line"],
            correct_answer: "line-height",
            explanation: "La propriété 'line-height' définit l'espace vertical entre les lignes de texte dans un élément."
        },
        {
            module: "HTML",
            question: "Quel attribut est utilisé pour spécifier l'URL d'une ressource externe dans une balise <script>?",
            options: ["src", "href", "link", "url"],
            correct_answer: "src",
            explanation: "L'attribut 'src' (source) est utilisé pour indiquer l'emplacement du fichier JavaScript externe."
        }
    ];

    const randomIndex = Math.floor(Math.random() * fallbackQuestions.length);
    currentQuestion = fallbackQuestions[randomIndex];
    displayQuestion(currentQuestion);
}

// Ajouter les écouteurs d'événements
checkAnswerBtn.addEventListener('click', checkAnswer);
nextQuestionBtn.addEventListener('click', nextQuestion);

// Charger la première question au démarrage
document.addEventListener('DOMContentLoaded', loadRandomQuestion);