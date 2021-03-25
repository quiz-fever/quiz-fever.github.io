import { page, render } from './lib.js';

import { getQuestionsByQuizId, getQuizById, logout as apiLogout } from './api/data.js';
import { browsePage } from './views/browse.js';
import { editorPage } from './views/editor/editor.js';
import { loginPage, registerPage } from './views/auth.js';
import { quizPage } from './views/quiz/quiz.js';
import { cube } from './views/common/loader.js';
import { resultPage } from './views/quiz/result.js';

const state = {};
const main = document.getElementById('content');
setUserNav();
document.getElementById('logoutBtn').addEventListener('click', logout);

page('/browse', decorateContext, browsePage);
page('/login', decorateContext, loginPage);
page('/register', decorateContext, registerPage);
page('/quiz/:id', decorateContext, getQuiz, quizPage);
page('/summary/:id', decorateContext, getQuiz, resultPage);
page('/create', decorateContext, editorPage);
page('/edit/:id', decorateContext, editorPage);

page.start();


async function getQuiz(ctx, next) {
    ctx.clearCache = clearCache;
    const quizId = ctx.params.id;
    if (state[quizId] == undefined) {
        ctx.render(cube());
        state[quizId] = await getQuizById(quizId);
        const ownerId = state[quizId].owner.objectId;
        state[quizId].questions = await getQuestionsByQuizId(quizId, ownerId);
        state[quizId].answers = state[quizId].questions.map(q => undefined);
    }
    ctx.quiz = state[quizId];

    next();
}

function clearCache(quizId) {
    if (state[quizId]) {
        delete state[quizId];
    }
}

function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, main);
    ctx.setUserNav = setUserNav;
    next();
}

function setUserNav() {
    const userId = sessionStorage.getItem('userId');
    if (userId != null) {
        document.getElementById('user-nav').style.display = 'block';
        document.getElementById('guest-nav').style.display = 'none';
    } else {
        document.getElementById('user-nav').style.display = 'none';
        document.getElementById('guest-nav').style.display = 'block';
    }
}

async function logout() {
    await apiLogout();
    setUserNav();
    page.redirect('/');
}