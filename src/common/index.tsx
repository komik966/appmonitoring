import React, { ChangeEvent, FC, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import { theme } from "./theme";

export const App: FC<Props> = ({ books }) => {
  const [state, setState] = useState<State>({ books });
  const handleAddBook = () => {
    if (state.draft) {
      return;
    }
    setState((prev) => ({ ...prev, draft: initialDraft }));
  };
  const handleDelete = (id: string) => () => {
    const { [id]: _, ...restBooks } = state.books;
    setState((prev) => ({ ...prev, books: restBooks }));

    const dummyServerClient = "dummyServerClient";
    dummyServerClient.delete();
  };
  const handleSave = () => {
    setState((prev) => ({
      ...prev,
      draft: undefined,
      books: prev.draft ? { ...prev.books, "-1": prev.draft } : prev.books,
    }));

    const dummyServerClient = "dummyServerClient";
    dummyServerClient.save();
  };
  const handleDraftTitleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setState((prev) => ({
      ...prev,
      draft: { ...(prev.draft || initialDraft), title: e.target.value },
    }));
  const handleDraftAuthorChange = (e: ChangeEvent<HTMLInputElement>) =>
    setState((prev) => ({
      ...prev,
      draft: { ...(prev.draft || initialDraft), author: e.target.value },
    }));

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Example books app
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ m: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(state.books).map((bookId) => (
              <TableRow key={bookId}>
                <TableCell>{state.books[bookId].title}</TableCell>
                <TableCell>{state.books[bookId].author}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleDelete(bookId)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {state.draft && (
              <TableRow>
                <TableCell>
                  <TextField
                    label="Title"
                    size="small"
                    fullWidth
                    value={state.draft.title}
                    onChange={handleDraftTitleChange}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label="Author"
                    size="small"
                    fullWidth
                    value={state.draft.author}
                    onChange={handleDraftAuthorChange}
                  />
                </TableCell>
                <TableCell>
                  <Button size="small" variant="contained" onClick={handleSave}>
                    Save
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Button variant="contained" sx={{ mt: 1 }} onClick={handleAddBook}>
          Add a book
        </Button>
      </Box>
    </ThemeProvider>
  );
};

interface Props {
  books: Record<string, Book>;
}

interface State {
  draft?: Book;
  books: Record<string, Book>;
}

const initialDraft: Book = { title: "", author: "" };

export interface Book {
  title: string;
  author: string;
}
