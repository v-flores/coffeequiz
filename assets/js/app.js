import Question from "./Question.js";
import Quiz from "./Quiz.js"

const App = (() => {
  // cache the DOM
  const quizEl = document.querySelector(".quiz");
  const quizQuestionEl = document.querySelector(".quiz__question");
  const trackerEl = document.querySelector(".quiz__tracker");
  const taglineEl = document.querySelector(".quiz__tagline");
  const choicesEl = document.querySelector(".quiz__choices");
  const progressInnerEl = document.querySelector(".progress__inner");
  const nextButtonEl = document.querySelector(".next");
  const restartButtonEl = document.querySelector(".restart");


  const quiz = new Quiz([q1, q2, q3, q4, q5]);

  const listeners = _ => {
    nextButtonEl.addEventListener("click", function() {
      const selectedRadioElem = document.querySelector('input[name="choice"]:checked');
      if (selectedRadioElem) {
        const key = Number(selectedRadioElem.getAttribute("data-order"));
        quiz.guess(key);
        renderAll();
      }
    })

    restartButtonEl.addEventListener("click", function() {
      // 1. reset the quiz
      quiz.reset();
      // 2. renderAll
      renderAll();
      // 3. restore the next button
      nextButtonEl.style.opacity = 1;
    })
  }

  const setValue = (elem, value) => {
    elem.innerHTML = value;
  }

  const renderQuestion = _ => {
    const question = quiz.getCurrentQuestion().question;
    setValue(quizQuestionEl, question);
  }

  const renderChoicesElements = _ => {
    let markup = "";
    const currentChoices = quiz.getCurrentQuestion().choices;
    currentChoices.forEach((elem, index) => {
      markup += `
        <li class="quiz__choice">
          <input type="radio" name="choice" class="quiz__input" data-order="${index}" id="choice${index}">
          <label for="choice${index}" class="quiz__label">
            <i></i>
            <span>${elem}</span>
          </label>
        </li>
      `
    });

    setValue(choicesEl, markup);
  }

  const renderTracker = _ => {
    const index = quiz.currentIndex;
    setValue(trackerEl, `${index+1} of ${quiz.questions.length}`)
  }

  const getPercentage = (num1, num2) => {
    return Math.round((num1/num2) * 100);
  }

  const launch = (width, maxPercent) => {
    let loadingBar = setInterval(function() {
      if (width > maxPercent) {
        clearInterval(loadingBar);
      } else {
        width++;
        progressInnerEl.style.width = width + "%";
      }
    }, 3)
  }

  const renderProgress = _ => {
    // 1. width
    const currentWidth = getPercentage(quiz.currentIndex, quiz.questions.length);
    // 2. launch(0, width)
    launch(0, currentWidth);
  }

  const renderEndScreen = _ => {
    setValue(quizQuestionEl, `Great Job!`);
    setValue(taglineEl, `Complete!`);
    setValue(trackerEl, `Your score: ${getPercentage(quiz.score, quiz.questions.length)}%`);
    nextButtonEl.style.opacity = 0;
    renderProgress();
  }

  const renderAll = _ => {
    if (quiz.hasEnded()) {
      // renderEndScreen
      renderEndScreen();
    } else {
      // 1. render the question
      renderQuestion();
      // 2. Render the choices elements
      renderChoicesElements()
      // 3. Render Tracker
      renderTracker();
      // 4. Render Progress
      renderProgress();
    }
  }

  return {
    renderAll: renderAll,
    listeners: listeners
  }
})();

App.renderAll();
App.listeners();