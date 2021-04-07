import { html, until } from '../lib.js';

import { topics } from '../util.js';
import { getQuizes } from '../api/data.js';
import { cube } from './common/loader.js';
import { quizTemplate } from './common/quiz-preview.js';


const template = () => html`
<section id="browse">
    <header class="pad-large">
        ${'' /*
        <form class="browse-filter">
            <input class="input" type="text" name="query">
            <select class="input" name="topic">
                <option value="all">All Categories</option>
                ${Object.entries(topics).map(([k, v]) => html`<option value=${k}>${v}</option>`)}
            </select>
            <input class="input submit action" type="submit" value="Filter Quizes">
        </form>
        */}
        <h1>All quizes</h1>
    </header>

    ${until(loadQuizes(), cube())}
</section>`;

async function loadQuizes() {
    const quizes = await getQuizes();

    return html`
    <div class="pad-large alt-page">
        ${quizes.map(quizTemplate)}
    </div>`;
}


export async function browsePage(ctx) {
    ctx.render(template());
}