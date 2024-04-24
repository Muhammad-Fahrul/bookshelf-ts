import { GlobalStateType } from './types';

export default class View {
  private $: Record<string, Element> = {};
  private $form: Record<string, HTMLFormElement> = {};
  private $input: Record<string, HTMLInputElement> = {};

  // A map of selected element arrays
  constructor() {
    this.$form.book_form = this.#qsForm('[data-id="book-form"]');
    this.$.update_book_form = this.#qs('[data-id="info-form"]');

    this.$input.title_input = this.#qsInput('[data-id="title"]');
    this.$input.author_input = this.#qsInput('[data-id="author"]');
    this.$input.year_input = this.#qsInput('[data-id="year"]');
    this.$input.isComplete_input = this.#qsInput('[data-id="isComplete"]');
    this.$input.search_input = this.#qsInput('[data-id="search"]');

    this.$input.id_info = this.#qsInput('[data-id="id-info"]');
    this.$input.title_info = this.#qsInput('[data-id="title-info"]');
    this.$input.author_info = this.#qsInput('[data-id="author-info"]');
    this.$input.year_info = this.#qsInput('[data-id="year-info"]');

    this.$.toggle_is_complete = this.#qs('[data-id="toggle-is-complete"]');
    this.$.books_table_tbody = this.#qs('[data-id="items"]');
    this.$.books_info = this.#qs('[data-id="info-book"]');

    this.$.books_info.addEventListener('click', (e: Event) => {
      if (
        e.target instanceof HTMLElement &&
        e.target.dataset.id === 'info-book'
      ) {
        e.target.classList.add('hidden');
      }
    });
  }

  render(state: GlobalStateType, search?: string) {
    let books;

    if (search) {
      books = state.books.filter((book) =>
        book.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      );
    } else {
      books = state.books;
    }

    const iconToggleMove = state.isComplete ? 'fa-eye-slash' : 'fa-eye';

    const moveIcon = `<i data-act="move-book-btn" class="fa-regular ${iconToggleMove}"></i>`;

    const deleteIcon = `<i data-act="delete-book-btn" class="fa-regular fa-trash-can"></i>`;

    const infoIcon = `<i data-act="info-book-btn" class="fa-regular fa-circle-question"></i>`;

    const button = (bookId: number) => {
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
    } else {
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

  renderInfoBookValues(book: Element) {
    this.renderInfoComponent();

    const parentElement = book.parentElement?.parentElement;
    if (!parentElement) throw new Error('Parent element not found');

    const children: HTMLCollection = parentElement.children;
    if (!children[0]) throw new Error('Child element not found');

    const id = children[0].children[0].textContent;
    const title = children[0].children[1].textContent;
    const author = children[0].children[2].textContent;
    const year = children[0].children[3].textContent;

    if (id) this.$input.id_info.value = id;
    if (title) this.$input.title_info.value = title;
    if (author) this.$input.author_info.value = author;
    if (year) this.$input.year_info.value = year;
  }

  renderInfoComponent() {
    this.$.books_info.classList.toggle('hidden');
  }

  bindAddNewBook(handler: (event: Event) => void) {
    this.$form.book_form.addEventListener('submit', handler);
  }

  bindUpdateBook(handler: (event: Event) => void) {
    this.$.update_book_form.addEventListener('submit', handler);
  }

  bindSearchBook(handler: (event: Event) => void) {
    this.$input.search_input.addEventListener('input', handler);
  }

  bindToggleBooks(handler: (event: Event) => void) {
    this.$.toggle_is_complete.addEventListener('click', handler);
  }

  resetForm() {
    this.$form.book_form.reset();
  }

  bindDeleteBook(handler: (element: Element) => void) {
    this.#delegate(
      this.$.books_table_tbody,
      '[data-act="delete-book-btn"]',
      'click',
      handler
    );
  }

  bindMoveBook(handler: (element: Element) => void) {
    this.#delegate(
      this.$.books_table_tbody,
      '[data-act="move-book-btn"]',
      'click',
      handler
    );
  }

  toggleInfoComponent(handler: (element: Element) => void) {
    this.#delegate(
      this.$.books_table_tbody,
      '[data-act="info-book-btn"]',
      'click',
      handler
    );
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

  toggleStatusBooksBtn(isComplete: boolean) {
    this.$input.search_input.value = '';

    const text = isComplete ? 'Readed' : 'Reading';

    const icon = isComplete ? 'fa-eye' : 'fa-eye-slash';

    this.$.toggle_is_complete.innerHTML = `
      <i class="fa-regular ${icon}"></i>
      <span>${text}</span>
    `;
  }

  #qs(selector: string, parent?: Element) {
    const el = parent
      ? parent.querySelector(selector)
      : document.querySelector(selector);

    if (!el) throw new Error('Could not find element');

    return el;
  }

  #qsForm(selector: string) {
    const el = document.querySelector(selector) as HTMLFormElement;

    if (!el) throw new Error('Could not find Form Element');

    return el;
  }

  #qsInput(selector: string) {
    const el = document.querySelector(selector) as HTMLInputElement;

    if (!el) throw new Error('Could not find input Element');

    return el;
  }

  #delegate(
    el: Element,
    selector: string,
    eventKey: string,
    handler: (el: Element) => void
  ) {
    el.addEventListener(eventKey, (event) => {
      if (!event.target || !(event.target instanceof Element))
        throw new Error('Event target not found, or is not Element type');
      if (event.target.matches(selector)) {
        handler(event.target);
      }
    });
  }
}
