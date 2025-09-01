// ===============================================
//           VERSION FINALE ET CORRIGÉE
// ===============================================

// 1. Configuration de la connexion à Supabase
// (Assurez-vous d'avoir inclus la lib Supabase avant ce script)
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
const supabaseUrl = "https://xfpkiowdevrrhsaundrz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmcGtpb3dkZXZycmhzYXVuZHJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mjk2MDYsImV4cCI6MjA3MjMwNTYwNn0.Lqqyo1asUKQl5AK9AElS1xwlAjLVG9uP20z2lr_wzn8";

// إصلاح: لا تسمي العميل supabase حتى لا تتعارض مع الكائن العالمي
const { createClient } = supabase;
const sb = createClient(supabaseUrl, supabaseAnonKey);

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

        try {
            const { data, error } = await sb.rpc('get_random_qcm');
                if (error) throw error;

                    // قد تعيد الدالة صفًا واحدًا أو مصفوفة صفوف
                        const row = Array.isArray(data) ? data[0] : data;
                            if (!row) throw new Error('Aucune question renvoyée par get_random_qcm');

                                currentQCM = row;
                                    displayQCM(currentQCM);
                                      } catch (err) {
                                          console.error("Erreur lors de la récupération du QCM:", err);
                                              qcmQuestion.textContent = "Impossible de charger la question. Vérifiez la console (F12).";
                                                  qcmLoader.classList.add('hidden');
                                                      qcmContent.classList.remove('hidden');
                                                        }
                                                        }

                                                        // 5. Fonction pour afficher le QCM
                                                        function displayQCM(qcm) {
                                                          qcmModule.textContent = qcm.module ?? '';
                                                            qcmQuestion.textContent = qcm.question ?? '';

                                                              qcmOptions.innerHTML = '';
                                                                // options قد تكون مصفوفة (text[]) أو JSON string — نحاول التعامل مع الحالتين
                                                                  let options = qcm.options;
                                                                    if (!Array.isArray(options) && typeof options === 'string') {
                                                                        try { options = JSON.parse(options); } catch (_) { options = []; }
                                                                          }

                                                                            if (Array.isArray(options)) {
                                                                                options.forEach(optionText => {
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
                                                                                                                                    if (!currentQCM) return;
                                                                                                                                      isAnswerChecked = true;
                                                                                                                                        checkAnswerBtn.disabled = true;

                                                                                                                                          const correct = selectedOption === currentQCM.correct_answer;

                                                                                                                                            qcmFeedback.classList.remove('hidden');
                                                                                                                                              qcmFeedback.classList.toggle('correct', correct);
                                                                                                                                                qcmFeedback.classList.toggle('incorrect', !correct);
                                                                                                                                                  feedbackText.textContent = correct
                                                                                                                                                      ? "Félicitations ! C'est la bonne réponse."
                                                                                                                                                          : `Désolé, la bonne réponse était : ${currentQCM.correct_answer}`;

                                                                                                                                                            if (currentQCM.explanation && explanationBox) {
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
                                                                                                                                                                                                                      qcmFeedback.classList.remove('correct', 'incorrect');
                                                                                                                                                                                                                        if (explanationBox) {
                                                                                                                                                                                                                            explanationBox.classList.add('hidden');
                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                qcmOptions.innerHTML = '';
                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                // 9. Ajout des écouteurs d'événements
                                                                                                                                                                                                                                checkAnswerBtn.addEventListener('click', checkAnswer);
                                                                                                                                                                                                                                nextQcmBtn.addEventListener('click', fetchRandomQCM);

                                                                                                                                                                                                                                // 10. Lancement initial
                                                                                                                                                                                                                                fetchRandomQCM();