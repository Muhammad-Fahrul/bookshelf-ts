import { BookType, GlobalStateType } from './types';

const initialState: GlobalStateType = {
  books: [],
  isComplete: false,
};

class Book {
  id;
  title;
  author;
  year;
  isComplete;
  constructor({ id, title, author, year, isComplete = false }: BookType) {
    this.id = +id;
    this.title = title;
    this.author = author;
    this.year = +year;
    this.isComplete = isComplete;
  }
}

export default class Store extends EventTarget {
  constructor(readonly storageKey: string) {
    super();
    this.storageKey = storageKey;
  }

  get state() {
    const state = this.#getState();
    return {
      ...state,
      books: state.books.reverse(),
    };
  }

  addNewBook(title: string, author: string, year: number, isComplete: boolean) {
    const stateClone = structuredClone(this.#getState());

    const id =
      stateClone.books.length > 0
        ? stateClone.books[stateClone.books.length - 1].id + 1
        : 1;

    const newBook: BookType = new Book({
      id,
      title,
      author,
      year,
      isComplete,
    });

    stateClone.books.push(newBook);
    this.#saveState(stateClone);
  }

  deleteBook(id: number) {
    const stateClone: GlobalStateType = structuredClone(this.#getState());

    const newBooks = {
      ...stateClone,
      books: stateClone.books.filter((book) => book.id !== id),
    };

    this.#saveState(newBooks);
  }

  moveBook(id: number) {
    const stateClone: GlobalStateType = structuredClone(this.#getState());

    const currentBook = stateClone.books.filter((book) => book.id === id)[0];

    const movingBook = {
      ...currentBook,
      isComplete: !currentBook.isComplete,
    };

    const newBooks = {
      ...stateClone,
      books: [...stateClone.books.filter((book) => book.id !== id), movingBook],
    };

    this.#saveState(newBooks);
  }

  updateBook(id: number, title: string, author: string, year: number) {
    const stateClone: GlobalStateType = structuredClone(this.#getState());

    const currentBook = stateClone.books.filter((book) => book.id === id)[0];

    const updatedBook = {
      ...currentBook,
      title,
      author,
      year: year,
    };

    const newBooks = {
      ...stateClone,
      books: [
        ...stateClone.books.filter((book) => Number(book.id) !== Number(id)),
        updatedBook,
      ],
    };

    this.#saveState(newBooks);
  }

  toggleIsComplete() {
    const stateClone = structuredClone(this.#getState());

    stateClone.isComplete = !stateClone.isComplete;
    this.#saveState(stateClone);
  }

  #saveState(
    stateOrFn: ((prev: GlobalStateType) => GlobalStateType) | GlobalStateType
  ) {
    const prevState = this.#getState();

    let newState;

    switch (typeof stateOrFn) {
      case 'function':
        newState = stateOrFn(prevState);
        break;
      case 'object':
        newState = stateOrFn;
        break;
      default:
        throw new Error('Invalid argument passed to saveBooks');
    }

    window.localStorage.setItem(this.storageKey, JSON.stringify(newState));
    this.dispatchEvent(new Event('statechange'));
  }

  #getState(): GlobalStateType {
    const item = window.localStorage.getItem(this.storageKey);
    return item ? JSON.parse(item) : initialState;
  }
}
