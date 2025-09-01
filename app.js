// app.js

// 1. Configuration de la connexion à Supabase
// هذه هي الطريقة الصحيحة. الكود يحتوي فقط على أسماء المتغيرات.
// Vercel سيقوم باستبدالها بالقيم الحقيقية أثناء النشر.
const SUPABASE_URL = supabase.createClient('%VITE_SUPABASE_URL%';
const SUPABASE_ANON_KEY = '%VITE_SUPABASE_ANON_KEY%');

// تم تصحيح هذا السطر: نستخدم كائن "supabase" العام لإنشاء العميل
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

supabase.from('your_table').select('*');
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
    qLoader.classList.remove('hidden');
    qcmContent.classList.add('hidden');
    resetState();

    const { data, error } = await supabase.rpc('get_random_qcm');

    if (error || !data || data.length === 0) {
        console.error("Erreur lors de la récupération du QCM:", error);
        qcmQuestion.textContent = "Impossible de charger la question. Vérifiez la console pour les erreurs.";
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
    // التأكد من أن الخيارات هي بالفعل قائمة (array)
    if (Array.isArray(qcm.options)) {
        qcm.options.forEach(optionText => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = optionText;
            button.addEventListener('click', () => selectOption(button, optionText));
            qcmOptions.appendChild(button);
        });
    }

    qcmLoader.classList.add('hidden');
    qcmContent.classList.remove('hidden');
}

// 6. Fonction pour gérer la sélection d'une option
function selectOption(button, optionText) {
    if (isAnswerChecked) return;

    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
    
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
    
    if (currentQCM.explanation) {
        document.getElementById('explanation-box').classList.remove('hidden');
        qcmExplanation.textContent = currentQCM.explanation;
    }

    document.querySelectorAll('.option-btn').forEach(btn => {
        if (btn.textContent === currentQCM.correct_answer) {
            btn.classList.add('correct');
        } else if (btn.classList.contains('selected')) {
            btn.classList.add('incorrect');
        }
        btn.disabled = true; // تعطيل جميع الخيارات بعد التحقق
    });

    nextQcmBtn.classList.remove('hidden');
}

// 8. Fonction pour réinitialiser l'état pour la prochaine question
function resetState() {
    currentQCM = null;
    selectedOption = null;
    isAnswerChecked = false;
    
    checkAnswerBtn.disabled = true;
    nextQcmBtn.classList.add('hidden');
    qcmFeedback.classList.add('hidden');
    document.getElementById('explanation-box').classList.add('hidden');
}

// 9. Ajout des écouteurs d'événements
checkAnswerBtn.addEventListener('click', checkAnswer);
nextQcmBtn.addEventListener('click', fetchRandomQCM);

// 10. Lancement initial
fetchRandomQCM();
