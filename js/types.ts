type BookType = {
  id: number;
  title: string;
  author: string;
  year: number;
  isComplete: boolean;
};

type ItemBookType = {
  id: number;
  title: string;
  author: string;
  year: number;
  isComplete: boolean;
};

type GlobalStateType = {
  books: BookType[];
  isComplete: boolean;
};

export { BookType, GlobalStateType };
