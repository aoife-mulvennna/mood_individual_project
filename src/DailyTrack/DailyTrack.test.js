import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DailyTrack from './DailyTrack';


/**
 * Test: renders DailyTrack component without crashing
 *
 * This test ensures that the DailyTrack component renders successfully without throwing any errors.
 * The purpose is to confirm that the component can mount in the DOM correctly.
 */
test('renders DailyTrack component without crashing', () => {
    render(<DailyTrack />);
});

// Mock the fetch function globally
global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        { mood_id: 1, mood_name: 'Happy', mood_score: 5 },
        { mood_id: 2, mood_name: 'Sad', mood_score: 1 }
      ]),
    })
  );

  
/**
 * Test: Renders mood options in DailyTrack component
 *
 * This test ensures that the DailyTrack component renders mood options like "Happy" and "Sad"
 * after the mock API call.
 */
test('renders mood options after API call', async () => {
    // Render the DailyTrack component
    render(<DailyTrack />);
  
    // Wait for the moods to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText(/Happy/i)).toBeInTheDocument();
      expect(screen.getByText(/Sad/i)).toBeInTheDocument();
    });
  });