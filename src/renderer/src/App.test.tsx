import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('should render the landing page initially', () => {
    render(<App />);

    expect(screen.getByRole('button', { name: /OPEN FOLDER/i })).toBeInTheDocument();
  });

  it('should have the correct dark mode background', () => {
    const { container } = render(<App />);
    const mainDiv = container.querySelector('div');

    expect(mainDiv).toHaveClass('bg-[#1e1e1e]');
  });
});
