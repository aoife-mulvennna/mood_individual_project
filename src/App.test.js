import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';  // Add this import
import App from './App';


test('renders App component without crashing', () => {
  render(<App />);
  expect(screen.getByText(/QUB Student Pulse/i)).toBeInTheDocument();
});



/**
 * Test: Renders App component and verifies initial content
 *
 * This test ensures that the App component renders the expected elements
 * on the initial load, such as the welcome message and login link.
 */
test('renders welcome message and login link on initial load', () => {
  // Render the App component
  render(<App />);

  // Check if the welcome message is rendered
  expect(screen.getByText(/Welcome to QUB Student Pulse/i)).toBeInTheDocument();

  // Check if the login link is rendered
  expect(screen.getByText(/Log In/i)).toBeInTheDocument();

  // Check if the "Create an Account" link is rendered
  expect(screen.getByText(/Create an Account/i)).toBeInTheDocument();
});