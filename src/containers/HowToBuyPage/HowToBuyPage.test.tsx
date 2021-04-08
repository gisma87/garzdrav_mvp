import React from "react";
import {render, screen} from "@testing-library/react";
import '@testing-library/jest-dom'
import HowToBuyPage from "./HowToBuyPage";

test('renders learn react link', () => {
    render(<HowToBuyPage />);
    const linkElement = screen.getByText(/Инструкция/i);
    expect(linkElement).toBeInTheDocument();
});

