import { page, render } from './lib.js';

import { logout as apiLogout } from './api/data.js';
import { browsePage } from './views/browse.js';
import { editorPage } from './views/editor/editor.js';
import { loginPage, registerPage } from './views/auth.js';


const main = document.getElementById('content');
setUserNav();
document.getElementById('logoutBtn').addEventListener('click', logout);

page('/browse', decorateContext, browsePage);
page('/login', decorateContext, loginPage);
page('/register', decorateContext, registerPage);
page('/create', decorateContext, editorPage);
page('/edit/:id', decorateContext, editorPage);

page.start();


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