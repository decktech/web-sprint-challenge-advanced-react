// Write your tests here
import React from "react";
import{ render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
// import userEvent from '@testing-library/userEvent';
import AppClass from './AppClass'

test('renders without errors', () => {
  render(<AppClass/>);
});

test('6 buttons on screen', () => {
  render(<AppClass/>);

  const buttons = screen.getAllByRole("button")
  expect(buttons).toHaveLength(6)
})

test('coordinates on screen', () => {
  render(<AppClass/>);

  const coordinates = screen.getByText(/coordinates/i)
  expect(coordinates).toBeInTheDocument()
})

test('moved on screen', () => {
  render (<AppClass/>)

  const moved = screen.getByText(/moved/i)
  expect(moved).toBeInTheDocument()
})

test('times on screen', () => {
  render (<AppClass/>)

  const times = screen.getByText(/times/i)
  expect(times).toBeInTheDocument()
})

// test('can type in email input', async () => {
//   render(<AppClass/>)

//   const emailInput = screen.findByPlaceholderText(/type email/i)
//   userEvent.type(emailInput, "asdf")

//   expect(emailInput).toHaveTextContent("asdf")
// })