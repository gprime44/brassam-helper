import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import Dashboard from './Dashboard';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';

test('renders welcome message', () => {
  render(
    <I18nextProvider i18n={i18n}>
      <Dashboard />
    </I18nextProvider>
  );
  const linkElement = screen.getByText(/Welcome to Brassam Helper/i);
  expect(linkElement).toBeDefined();
});
