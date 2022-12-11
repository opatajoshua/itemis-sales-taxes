import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Main app", () => {
  render(<App />);
  const titleElement = screen.getByText(/Itemis Coding challenge/i);
  expect(titleElement).toBeInTheDocument();
});
