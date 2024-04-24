import Store from './store.js';
import View from './view.js';
function init() {
    const store = new Store('books');
    const view = new View();
    view.render(store.state);
    view.toggleStatusBooksBtn(store.state.isComplete);
    store.addEventListener('statechange', () => {
        view.render(store.state);
    });
    view.bindAddNewBook((event) => {
        event.preventDefault();
        const { title, author, year, isComplete } = view.getInputValues();
        store.addNewBook(title, author, +year, Boolean(isComplete));
        view.resetForm();
    });
    view.bindDeleteBook((element) => {
        const parent = element.parentElement;
        const children = parent === null || parent === void 0 ? void 0 : parent.children[0];
        const id = Number(children === null || children === void 0 ? void 0 : children.textContent);
        store.deleteBook(id);
    });
    view.bindMoveBook((element) => {
        const parent = element.parentElement;
        const children = parent === null || parent === void 0 ? void 0 : parent.children[0];
        const id = Number(children === null || children === void 0 ? void 0 : children.textContent);
        store.moveBook(id);
    });
    view.bindUpdateBook((event) => {
        event.preventDefault();
        const { id, title, author, year } = view.getUpdatedInputValues();
        store.updateBook(+id, title, author, +year);
        view.renderInfoComponent();
    });
    view.bindSearchBook(() => view.render(store.state, view.getSearchedKeyword()));
    view.bindToggleBooks(() => {
        store.toggleIsComplete();
        view.toggleStatusBooksBtn(store.state.isComplete);
    });
    view.toggleInfoComponent((element) => {
        view.renderInfoBookValues(element);
    });
}
window.addEventListener('load', init);
