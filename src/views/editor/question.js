import { html, render } from '../../lib.js';
import { createAnswerList } from './answer.js';


const editorTemplate = (data, index, onSave, onCancel) => html`
<div class="layout">
    <div class="question-control">
        <button @click=${onSave} class="input submit action">
            <i class="fas fa-check-double"></i>
            Save
        </button>
        <button @click=${onCancel} class="input submit action">
            <i class="fas fa-times"></i>
            Cancel
        </button>
    </div>
    <h3>Question ${index}</h3>
</div>
<form>
    <textarea class="input editor-input editor-text" name="text" placeholder="Enter question"
        .value=${data.text}></textarea>

    ${createAnswerList(data.answers, index, data.correctIndex)}
</form>`;

const viewTemplate = (data, index, onEdit, onDelete) => html`
<div class="layout">
    <div class="question-control">
        <button @click=${onEdit} class="input submit action"><i class="fas fa-edit"></i> Edit</button>
        <button @click=${onDelete} class="input submit action"><i class="fas fa-trash-alt"></i> Delete</button>
    </div>
    <h3>Question ${index}</h3>
</div>
<div>
    <p class="editor-input">${data.text}</p>

    ${data.answers.map((a, i) => radioView(a, data.correctIndex == i))}

</div>`;

const radioView = (value, checked) => html`
<div class="editor-input">
    <label class="radio">
        <input class="input" type="radio" disabled ?checked=${checked} />
        <i class="fas fa-check-circle"></i>
    </label>
    <span>${value}</span>
</div>`;


// <div class="loading-overlay working"></div>



export function createQuestion(question, index) {
    const element = document.createElement('article');
    element.className = 'editor-question';

    showView();

    return element;

    function onEdit() {
        showEditor();
    }

    async function onDelete() {
        const confirmed = confirm('Are you sure you want to delete this question?');
        if (confirmed) {
            element.remove();
        }
    }

    async function onSave() {
        const formData = new FormData(element.querySelector('form'));

        const data = [...formData.entries()].reduce((a, [k,v]) => Object.assign(a, {[k]: v}), {});
        console.log(data);
    }

    function onCancel() {
        showView();
    }

    function showView() {
        render(viewTemplate(question, index, onEdit, onDelete), element);
    }

    function showEditor() {
        render(editorTemplate(question, index, onSave, onCancel), element);
    }
}