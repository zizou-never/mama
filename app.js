const supabaseUrl = "https://xfpkiowdevrrhsaundrz.supabase.co";
const supabaseAnonKey = "CLE_API";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);

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

let currentQuestion = null;
let selectedOption = null;
let isAnswerChecked = false;

async function loadRandomQuestion() {
  showLoader();
  resetState();

  try {
    const { data, error } = await supabaseClient
      .from("qcm")
      .select("*")
      .order("random()")
      .limit(1);

    if (error || !data.length) throw "Base vide ou erreur";

    currentQuestion = data[0];
    displayQuestion(currentQuestion);
  } catch (e) {
    console.log("→ fallback:", e);
    showFallbackQuestion();
  }
}

function displayQuestion(q) {
  moduleTag.textContent = q.module;
  questionTitle.textContent = q.question;
  optionsContainer.innerHTML = "";
  (Array.isArray(q.options) ? q.options : ["A","B"]).forEach(option => {
    const btn = document.createElement("button");
    btn.className = "option-button";
    btn.textContent = option;
    btn.onclick = () => selectOption(btn, option);
    optionsContainer.appendChild(btn);
  });
  hideLoader();
}

function selectOption(btn, option) {
  if (isAnswerChecked) return;
  document.querySelectorAll(".option-button").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
  selectedOption = option;
  checkAnswerBtn.disabled = false;
}

function checkAnswer() {
  isAnswerChecked = true;
  checkAnswerBtn.disabled = true;

  const correct = selectedOption === currentQuestion.correct_answer;
  feedbackSection.classList.add("show", correct ? "correct" : "incorrect");
  feedbackText.textContent = correct ? "✅ Bonne réponse !" : "❌ Mauvaise réponse...";

  if (currentQuestion.explanation) {
    explanationSection.style.display = "block";
    explanationText.textContent = currentQuestion.explanation;
  }

  document.querySelectorAll(".option-button").forEach(btn => {
    if (btn.textContent === currentQuestion.correct_answer) btn.classList.add("correct");
    else if (btn.classList.contains("selected")) btn.classList.add("incorrect");
    btn.disabled = true;
  });

  nextQuestionBtn.style.display = "block";
}

function resetState() {
  selectedOption = null;
  isAnswerChecked = false;
  feedbackSection.className = "feedback-section";
  feedbackSection.style.display = "none";
  explanationSection.style.display = "none";
  checkAnswerBtn.disabled = true;
  nextQuestionBtn.style.display = "none";
}

function showLoader() {
  loadingSection.classList.remove("hidden");
  contentSection.classList.add("hidden");
}
function hideLoader() {
  loadingSection.classList.add("hidden");
  contentSection.classList.remove("hidden");
}

function showFallbackQuestion() {
  currentQuestion = {
    module: "Mode Démo",
    question: "Quelle est la capitale de la France ?",
    options: ["Rome", "Madrid", "Paris", "Berlin"],
    correct_answer: "Paris",
    explanation: "Paris est la capitale et la plus grande ville de la France."
  };
  displayQuestion(currentQuestion);
}

checkAnswerBtn.addEventListener("click", checkAnswer);
nextQuestionBtn.addEventListener("click", loadRandomQuestion);

document.addEventListener("DOMContentLoaded", loadRandomQuestion);