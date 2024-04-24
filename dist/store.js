var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Store_instances, _Store_saveState, _Store_getState;
const initialState = {
    books: [],
    isComplete: false,
};
class Book {
    constructor({ id, title, author, year, isComplete = false }) {
        this.id = +id;
        this.title = title;
        this.author = author;
        this.year = +year;
        this.isComplete = isComplete;
    }
}
class Store extends EventTarget {
    constructor(storageKey) {
        super();
        _Store_instances.add(this);
        this.storageKey = storageKey;
        this.storageKey = storageKey;
    }
    get state() {
        const state = __classPrivateFieldGet(this, _Store_instances, "m", _Store_getState).call(this);
        return Object.assign(Object.assign({}, state), { books: state.books.reverse() });
    }
    addNewBook(title, author, year, isComplete) {
        const stateClone = structuredClone(__classPrivateFieldGet(this, _Store_instances, "m", _Store_getState).call(this));
        const id = stateClone.books.length > 0
            ? stateClone.books[stateClone.books.length - 1].id + 1
            : 1;
        const newBook = new Book({
            id,
            title,
            author,
            year,
            isComplete,
        });
        stateClone.books.push(newBook);
        __classPrivateFieldGet(this, _Store_instances, "m", _Store_saveState).call(this, stateClone);
    }
    deleteBook(id) {
        const stateClone = structuredClone(__classPrivateFieldGet(this, _Store_instances, "m", _Store_getState).call(this));
        const newBooks = Object.assign(Object.assign({}, stateClone), { books: stateClone.books.filter((book) => book.id !== id) });
        __classPrivateFieldGet(this, _Store_instances, "m", _Store_saveState).call(this, newBooks);
    }
    moveBook(id) {
        const stateClone = structuredClone(__classPrivateFieldGet(this, _Store_instances, "m", _Store_getState).call(this));
        const currentBook = stateClone.books.filter((book) => book.id === id)[0];
        const movingBook = Object.assign(Object.assign({}, currentBook), { isComplete: !currentBook.isComplete });
        const newBooks = Object.assign(Object.assign({}, stateClone), { books: [...stateClone.books.filter((book) => book.id !== id), movingBook] });
        __classPrivateFieldGet(this, _Store_instances, "m", _Store_saveState).call(this, newBooks);
    }
    updateBook(id, title, author, year) {
        const stateClone = structuredClone(__classPrivateFieldGet(this, _Store_instances, "m", _Store_getState).call(this));
        const currentBook = stateClone.books.filter((book) => book.id === id)[0];
        const updatedBook = Object.assign(Object.assign({}, currentBook), { title,
            author, year: year });
        const newBooks = Object.assign(Object.assign({}, stateClone), { books: [
                ...stateClone.books.filter((book) => Number(book.id) !== Number(id)),
                updatedBook,
            ] });
        __classPrivateFieldGet(this, _Store_instances, "m", _Store_saveState).call(this, newBooks);
    }
    toggleIsComplete() {
        const stateClone = structuredClone(__classPrivateFieldGet(this, _Store_instances, "m", _Store_getState).call(this));
        stateClone.isComplete = !stateClone.isComplete;
        __classPrivateFieldGet(this, _Store_instances, "m", _Store_saveState).call(this, stateClone);
    }
}
_Store_instances = new WeakSet(), _Store_saveState = function _Store_saveState(stateOrFn) {
    const prevState = __classPrivateFieldGet(this, _Store_instances, "m", _Store_getState).call(this);
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
}, _Store_getState = function _Store_getState() {
    const item = window.localStorage.getItem(this.storageKey);
    return item ? JSON.parse(item) : initialState;
};
export default Store;
