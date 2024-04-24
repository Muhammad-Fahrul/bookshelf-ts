var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _View_instances, _View_qs, _View_qsForm, _View_qsInput, _View_delegate;
class View {
    // A map of selected element arrays
    constructor() {
        _View_instances.add(this);
        this.$ = {};
        this.$form = {};
        this.$input = {};
        this.$form.book_form = __classPrivateFieldGet(this, _View_instances, "m", _View_qsForm).call(this, '[data-id="book-form"]');
        this.$.update_book_form = __classPrivateFieldGet(this, _View_instances, "m", _View_qs).call(this, '[data-id="info-form"]');
        this.$input.title_input = __classPrivateFieldGet(this, _View_instances, "m", _View_qsInput).call(this, '[data-id="title"]');
        this.$input.author_input = __classPrivateFieldGet(this, _View_instances, "m", _View_qsInput).call(this, '[data-id="author"]');
        this.$input.year_input = __classPrivateFieldGet(this, _View_instances, "m", _View_qsInput).call(this, '[data-id="year"]');
        this.$input.isComplete_input = __classPrivateFieldGet(this, _View_instances, "m", _View_qsInput).call(this, '[data-id="isComplete"]');
        this.$input.search_input = __classPrivateFieldGet(this, _View_instances, "m", _View_qsInput).call(this, '[data-id="search"]');
        this.$input.id_info = __classPrivateFieldGet(this, _View_instances, "m", _View_qsInput).call(this, '[data-id="id-info"]');
        this.$input.title_info = __classPrivateFieldGet(this, _View_instances, "m", _View_qsInput).call(this, '[data-id="title-info"]');
        this.$input.author_info = __classPrivateFieldGet(this, _View_instances, "m", _View_qsInput).call(this, '[data-id="author-info"]');
        this.$input.year_info = __classPrivateFieldGet(this, _View_instances, "m", _View_qsInput).call(this, '[data-id="year-info"]');
        this.$.toggle_is_complete = __classPrivateFieldGet(this, _View_instances, "m", _View_qs).call(this, '[data-id="toggle-is-complete"]');
        this.$.books_table_tbody = __classPrivateFieldGet(this, _View_instances, "m", _View_qs).call(this, '[data-id="items"]');
        this.$.books_info = __classPrivateFieldGet(this, _View_instances, "m", _View_qs).call(this, '[data-id="info-book"]');
        this.$.books_info.addEventListener('click', (e) => {
            if (e.target instanceof HTMLElement &&
                e.target.dataset.id === 'info-book') {
                e.target.classList.add('hidden');
            }
        });
    }
    render(state, search) {
        let books;
        if (search) {
            books = state.books.filter((book) => book.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
        }
        else {
            books = state.books;
        }
        const iconToggleMove = state.isComplete ? 'fa-eye-slash' : 'fa-eye';
        const moveIcon = `<i data-act="move-book-btn" class="fa-regular ${iconToggleMove}"></i>`;
        const deleteIcon = `<i data-act="delete-book-btn" class="fa-regular fa-trash-can"></i>`;
        const infoIcon = `<i data-act="info-book-btn" class="fa-regular fa-circle-question"></i>`;
        const button = (bookId) => {
            return `
      <div class="book-item-btn">
          <span class="off-screen">${bookId}</span>
          ${moveIcon}
          ${deleteIcon}
          ${infoIcon}
      </div>`;
        };
        let displayedBook;
        if (state.isComplete) {
            displayedBook = books.filter((book) => book.isComplete);
        }
        else {
            displayedBook = books.filter((book) => !book.isComplete);
        }
        this.$.books_table_tbody.innerHTML = displayedBook
            .map((book) => {
            return `<li>
                  <div class="detail-items">
                    <p>${book.id}</p>
                    <p>${book.title}</p>
                    <p>${book.author}</p>
                    <p>${book.year}</p>
                  </div>
                  ${button(book.id)}
                </li>
                `;
        })
            .join('');
    }
    renderInfoBookValues(book) {
        var _a;
        this.renderInfoComponent();
        const parentElement = (_a = book.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
        if (!parentElement)
            throw new Error('Parent element not found');
        const children = parentElement.children;
        if (!children[0])
            throw new Error('Child element not found');
        const id = children[0].children[0].textContent;
        const title = children[0].children[1].textContent;
        const author = children[0].children[2].textContent;
        const year = children[0].children[3].textContent;
        if (id)
            this.$input.id_info.value = id;
        if (title)
            this.$input.title_info.value = title;
        if (author)
            this.$input.author_info.value = author;
        if (year)
            this.$input.year_info.value = year;
    }
    renderInfoComponent() {
        this.$.books_info.classList.toggle('hidden');
    }
    bindAddNewBook(handler) {
        this.$form.book_form.addEventListener('submit', handler);
    }
    bindUpdateBook(handler) {
        this.$.update_book_form.addEventListener('submit', handler);
    }
    bindSearchBook(handler) {
        this.$input.search_input.addEventListener('input', handler);
    }
    bindToggleBooks(handler) {
        this.$.toggle_is_complete.addEventListener('click', handler);
    }
    resetForm() {
        this.$form.book_form.reset();
    }
    bindDeleteBook(handler) {
        __classPrivateFieldGet(this, _View_instances, "m", _View_delegate).call(this, this.$.books_table_tbody, '[data-act="delete-book-btn"]', 'click', handler);
    }
    bindMoveBook(handler) {
        __classPrivateFieldGet(this, _View_instances, "m", _View_delegate).call(this, this.$.books_table_tbody, '[data-act="move-book-btn"]', 'click', handler);
    }
    toggleInfoComponent(handler) {
        __classPrivateFieldGet(this, _View_instances, "m", _View_delegate).call(this, this.$.books_table_tbody, '[data-act="info-book-btn"]', 'click', handler);
    }
    getInputValues() {
        return {
            title: this.$input.title_input.value,
            author: this.$input.author_input.value,
            year: this.$input.year_input.value,
            isComplete: this.$input.isComplete_input.value,
        };
    }
    getUpdatedInputValues() {
        return {
            id: this.$input.id_info.value,
            title: this.$input.title_info.value,
            author: this.$input.author_info.value,
            year: this.$input.year_info.value,
        };
    }
    getSearchedKeyword() {
        return this.$input.search_input.value;
    }
    toggleStatusBooksBtn(isComplete) {
        this.$input.search_input.value = '';
        const text = isComplete ? 'Readed' : 'Reading';
        const icon = isComplete ? 'fa-eye' : 'fa-eye-slash';
        this.$.toggle_is_complete.innerHTML = `
      <i class="fa-regular ${icon}"></i>
      <span>${text}</span>
    `;
    }
}
_View_instances = new WeakSet(), _View_qs = function _View_qs(selector, parent) {
    const el = parent
        ? parent.querySelector(selector)
        : document.querySelector(selector);
    if (!el)
        throw new Error('Could not find element');
    return el;
}, _View_qsForm = function _View_qsForm(selector) {
    const el = document.querySelector(selector);
    if (!el)
        throw new Error('Could not find Form Element');
    return el;
}, _View_qsInput = function _View_qsInput(selector) {
    const el = document.querySelector(selector);
    if (!el)
        throw new Error('Could not find input Element');
    return el;
}, _View_delegate = function _View_delegate(el, selector, eventKey, handler) {
    el.addEventListener(eventKey, (event) => {
        if (!event.target || !(event.target instanceof Element))
            throw new Error('Event target not found, or is not Element type');
        if (event.target.matches(selector)) {
            handler(event.target);
        }
    });
};
export default View;
