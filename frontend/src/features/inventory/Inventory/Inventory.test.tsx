import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Inventory from './Inventory';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';

test('renders inventory category tabs', () => {
  render(
    <MemoryRouter>
      <I18nextProvider i18n={i18n}>
        <Inventory />
      </I18nextProvider>
    </MemoryRouter>
  );
  expect(screen.getByText(/Fermentables/i)).toBeDefined();
  expect(screen.getByText(/Hops/i)).toBeDefined();
  expect(screen.getByText(/Yeast/i)).toBeDefined();
});
