import React from "react";
import {render, screen} from "@testing-library/react";
import '@testing-library/jest-dom'
import HowToBuyPage from "./HowToBuyPage";

test('renders Инструкция', () => {
    render(<HowToBuyPage />);
    const linkElement = screen.getByText(/Инструкция/i);
    expect(linkElement).toBeInTheDocument();
});

test('snapshot HowToBuyPage', () => {
    const {asFragment} = render(<HowToBuyPage/>)
    expect(asFragment()).toMatchSnapshot()
})

