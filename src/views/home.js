import { html, until } from '../lib.js';

import { topics } from '../util.js';
import { getMostRecent, getStats } from '../api/data.js';
import { cube, line } from './common/loader.js';
import { quizTemplate } from './common/quiz-preview.js';

const homeTemplate = () => html`<section id="welcome">

    <div class="hero layout">
        <div class="splash right-col"><i class="fas fa-clipboard-list"></i></div>
        <div class="glass welcome">
            <h1>Welcome to Quiz Fever!</h1>
            ${until(loadStats(), line())}
            <a class="action cta" href="/login">Sign in to create a quiz</a>
        </div>
    </div>

    ${until(loadRecent(), cube())}

</section>`;

async function loadStats() {
    const stats = await getStats();

    return html`<p>Home to ${stats} quizes in ${Object.keys(topics).length} topics. <a href="/browse">Browse all quizes</a>.</p>`;
}

async function loadRecent() {
    const recent = await getMostRecent();

    return html`
    <div class="pad-large alt-page">
        <h2>Our most recent quiz:</h2>
    
        ${recent ? quizTemplate(recent) : html`
        <p>No quizes yet. Be the first to create one!</p>`}
    
        <div>
            <a class="action cta" href="/browse">Browse all quizes</a>
        </div>
    </div>`;
}

export async function homePage(ctx) {
    ctx.render(homeTemplate());
}