import { html, styleMap, classMap } from '../../lib.js';

import { submitSolution } from '../../api/data.js';
import { cube } from '../common/loader.js';


const quizTemplate = (quiz, questions, answers, currentIndex, onSelect, resetQuiz, onSubmit) => html`
<section id="quiz">
    <header class="pad-large">
        <h1>${quiz.title}: Question ${currentIndex + 1} / ${questions.length}</h1>
        <nav class="layout q-control">
            <span class="block">Question index</span>
            ${questions.map((q, i) => indexTemplate(quiz.objectId, i, i == currentIndex, answers[i] != undefined))}
        </nav>
    </header>
    <div class="pad-large alt-page">

        <article class="question">
            <p class="q-text">
                ${questions[currentIndex].text}
            </p>

            <form id="quiz-form" @change=${onSelect}>
                ${questions.map((q, i) => questionTemplate(q, i, i == currentIndex))}
            </form>

            <nav class="q-control">
                <span class="block">${answers.filter(a => a == undefined).length} questions remaining</span>
                ${currentIndex > 0 ? html`<a class="action" href="/quiz/${quiz.objectId}?question=${currentIndex}">
                    <i class="fas fa-arrow-left"></i>
                    Previous
                </a>` : '' }
                <a @click=${resetQuiz} class="action" href="javascript:void(0)"><i class="fas fa-sync-alt"></i> Start over</a>
                <div class="right-col">
                    ${currentIndex < questions.length - 1 ? html`<a class="action" href="/quiz/${quiz.objectId}?question=${currentIndex + 2}">
                        Next
                        <i class="fas fa-arrow-right"></i>
                    </a>` : ''}
                    ${(answers.filter(a => a == undefined).length == 0 ||
                    currentIndex == questions.length - 1) ? html`<a @click=${onSubmit} class="action" href="javascript:void(0)">Submit answers</a>` : '' }
                </div>
            </nav>
        </article>

    </div>
</section>`;

const indexTemplate = (quizId, i, isCurrent, isAnswered) => {
    const className = {
        'q-index': true,
        'q-current': isCurrent,
        'q-answered': isAnswered
    };
    return html`<a class=${classMap(className)} href="/quiz/${quizId}?question=${i + 1}"></a>`;
};


const questionTemplate = (question, index, isCurrent) => html`
<div data-index="question-${index}" style=${styleMap({display: isCurrent ? '' : 'none'})}>
    ${question.answers.map((a, i) => answerTemplate(index, i, a))}
</div>`;

const answerTemplate = (questionIndex, index, text) => html`
<label class="q-answer radio">
    <input class="input" type="radio" name="question-${questionIndex}" value=${index} />
    <i class="fas fa-check-circle"></i>
    ${text}
</label>`;


export async function quizPage(ctx) {
    const index = Number(ctx.querystring.split('=')[1] || 1) - 1;
    const questions = ctx.quiz.questions;
    const answers = ctx.quiz.answers;

    update();

    function onSelect(event) {
        const questionIndex = Number(event.target.name.split('-')[1]);
        if (Number.isNaN(questionIndex) != true) {
            const answer = Number(event.target.value);
            answers[questionIndex] = answer;
            update();
        }
    }

    function resetQuiz() {
        const confirmed = confirm('Are you sure you want to reset your answers?');
        if (confirmed) {
            ctx.clearCache(ctx.quiz.objectId);
            ctx.page.redirect('/quiz/' + ctx.quiz.objectId);
        }
    }

    async function onSubmit() {
        const unanswered = answers.filter(a => a == undefined).length;
        if (unanswered > 0) {
            const confirmed = confirm(`There are ${unanswered} questions without answer. Are you sure?`);
            if (confirmed == false) {
                return;
            }
        }

        let correct = 0;
        for (let i = 0; i < questions.length; i++) {
            if (questions[i].correctIndex == answers[i]) {
                correct++;
            }
        }

        const solution = {
            correct,
            total: questions.length
        };

        ctx.render(cube());
        await submitSolution(ctx.quiz.objectId, solution);
        ctx.page.redirect('/summary/' + ctx.quiz.objectId);
    }

    function update() {
        ctx.render(quizTemplate(ctx.quiz, questions, answers, index, onSelect, resetQuiz, onSubmit));
    }
}