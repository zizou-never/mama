// ===============================================
//           VERSION FINALE GARANTIE
// ===============================================

// 1. Configuration avec les clés directes qui fonctionnent
const supabaseUrl = "https://xfpkiowdevrrhsaundrz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmcGtpb3dkZXZycmhzYXVuZHJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mjk2MDYsImV4cCI6MjA3MjMwNTYwNn0.Lqqyo1asUKQl5AK9AElS1xwlAjLVG9uP20z2lr_wzn8";

const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

// 2. Références à TOUS les éléments du DOM
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

// 4. Fonction pour récupérer un QCM aléatoire (MODIFIÉE SANS RPC)
async function fetchRandomQCM() {
    qcmLoader.classList.remove('hidden');
        qcmContent.classList.add('hidden');
            resetState();

                // === LA MODIFICATION EST ICI ===
                    // 1. On récupère TOUTES les questions, comme dans le script de diagnostic qui a fonctionné.
                        const { data, error } = await supabase
                                .from('qcm')
                                        .select('*');

                                            if (error || !data || data.length === 0) {
                                                    console.error("Erreur ou aucune donnée trouvée:", error);
                                                            qcmQuestion.textContent = "Impossible de charger les questions.";
                                                                    qcmLoader.classList.add('hidden');
                                                                            qcmContent.classList.remove('hidden');
                                                                                    return;
                                                                                        }
                                                                                            
                                                                                                // 2. On choisit une question au hasard avec JavaScript.
                                                                                                    const randomIndex = Math.floor(Math.random() * data.length);
                                                                                                        currentQCM = data[randomIndex];
                                                                                                            
                                                                                                                // 3. On affiche la question choisie.
                                                                                                                    displayQCM(currentQCM);
                                                                                                                    }

                                                                                                                    // 5. Fonction pour afficher le QCM AVEC LES OPTIONS
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
                                                                                                                                                                                                                                                                                                                                                                                                        checkAnswerBtn.classList.remove('hidden');
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
                                                                                                                                                                                                                                                                                                                                                                                                                                fetchRandomQCM();