// ===============================================
//         VERSION DE VÉRIFICATION - 2 SEPTEMBRE
// ===============================================
console.log("VERSION CORRIGÉE DU FICHIER APP.JS - Le script a démarré !");

// 1. Configuration de la connexion à Supabase
const SUPABASE_URL = '%VITE_SUPABASE_URL%';
const SUPABASE_ANON_KEY = '%VITE_SUPABASE_ANON_KEY%';

// LA CORRECTION DÉFINITIVE EST SUR CETTE LIGNE :
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
const explanationBox = document.getElementById('explanation-box');

// 3. Variables pour gérer l'état
let currentQCM = null;
let selectedOption = null;
let isAnswerChecked = false;

// 4. Fonction pour récupérer un QCM aléatoire
async function fetchRandomQCM() {
    qcmLoader.classList.remove('hidden');
    qcmContent.classList.add('hidden');
    resetState();

    const { data, error } = await supabase.rpc('get_random_qcm');

    if (error || !data || data.length === 0) {
        console.error("Erreur lors de la récupération du QCM:", error);
        qcmQuestion.textContent = "Impossible de charger la question. Vérifiez la console (F12).";
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
        explanationBox.classList.remove('hidden');
        qcmExplanation.textContent = currentQCM.explanation;
    }

    document.querySelectorAll('.option-btn').forEach(btn => {
        if (btn.textContent === currentQCM.correct_answer) {
            btn.classList.add('correct');
        } else if (btn.classList.contains('selected')) {
            btn.classList.add('incorrect');
        }
        btn.disabled = true;
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
    if (explanationBox) {
        explanationBox.classList.add('hidden');
    }
}

// 9. Ajout des écouteurs d'événements
checkAnswerBtn.addEventListener('click', checkAnswer);
nextQcmBtn.addEventListener('click', fetchRandomQCM);

// 10. Lancement initial
fetchRandomQCM();```

#### الخطوة الثانية: الحفظ والدفع إلى GitHub

1.  **احفظ** ملف `app.js` جيدًا.
2.  افتح الـ **terminal** في مجلد مشروعك.
3.  نفذ هذه الأوامر الثلاثة بالترتيب، واحدًا تلو الآخر:

    ```bash
    git add .
    ```
    (هذا يضيف كل الملفات المعدلة)

    ```bash
    git commit -m "Test: Ajout de la version de vérification de app.js"
    ```
    (هذا يحفظ التغييرات مع رسالة واضحة)

    ```bash
    git push origin main
    ```    (هذا يرفع التغييرات إلى GitHub)

#### الخطوة الثالثة: التحقق النهائي

1.  انتظر دقيقة حتى ينتهي Vercel من إعادة النشر.
2.  افتح موقعك.
3.  افتح الـ Console (F12).

**الآن، انظر إلى أول سطر في الـ Console.**
*   **إذا رأيت الرسالة:** `"VERSION CORRIGÉE DU FICHIER APP.JS - Le script a démarré !"`، فهذا يعني أننا نجحنا! والخطأ القديم سيختفي، ويجب أن يعمل الموقع.
*   **إذا لم تر هذه الرسالة**، واستمر الخطأ القديم في الظهور، فهذا يعني أن أوامر `git` لم يتم تنفيذها في المجلد الصحيح، وأن الملف القديم لا يزال على GitHub.

أنا واثق جدًا أن هذه هي الخطوة الأخيرة. هيا بنا ننجزها.
