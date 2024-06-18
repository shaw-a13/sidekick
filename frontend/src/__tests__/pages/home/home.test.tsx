import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Home from "../../../pages/home/home";

test("loads and displays greeting", async () => {
  render(<Home />);
  console.log(screen);
});
