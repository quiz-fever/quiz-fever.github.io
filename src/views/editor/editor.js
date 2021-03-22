import { html } from '../../lib.js';
import { createQuestion } from './question.js';


const template = (questions) => html`
<section id="editor">

    <header class="pad-large">
        <h1>New quiz</h1>
    </header>

    <div class="pad-large alt-page">
        <form>
            <label class="editor-label layout">
                <span class="label-col">Title:</span>
                <input class="input i-med" type="text" name="title"></label>
            <label class="editor-label layout">
                <span class="label-col">Topic:</span>
                <select class="input i-med" name="topic">
                    <option value="all">All Categories</option>
                    <option value="it">Languages</option>
                    <option value="hardware">Hardware</option>
                    <option value="software">Tools and Software</option>
                </select>
            </label>
            <input class="input submit action" type="submit" value="Save">
        </form>
    </div>

    <header class="pad-large">
        <h2>Questions</h2>
    </header>

    ${questionList(questions)}

</section>`;

const questionList = (questions) => html`
<div class="pad-large alt-page">

    ${questions.map((q, i) => createQuestion(q, i + 1, false))}

    <article class="editor-question">
        <div class="editor-input">
            <button class="input submit action">
                <i class="fas fa-plus-circle"></i>
                Add question
            </button>
        </div>
    </article>

</div>`;


const questions = [
    {
        text: 'Is this the first question?',
        answers: [
            'Yes',
            'No',
            'Maybe'
        ],
        correctIndex: 0
    },
    {
        text: 'Is this the second question?',
        answers: [
            'Maybe',
            'Yes',
            'No'
        ],
        correctIndex: 1
    }
];

export async function editorPage(ctx) {
    ctx.render(template(questions));
}