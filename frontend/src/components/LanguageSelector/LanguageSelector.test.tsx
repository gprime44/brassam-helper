import { render } from '@testing-library/react';
import { expect, test } from 'vitest';
import LanguageSelector from './LanguageSelector';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

test('renders language selector with flag icons', () => {
  const { container } = render(
    <I18nextProvider i18n={i18n}>
      <LanguageSelector />
    </I18nextProvider>
  );
  const svgs = container.querySelectorAll('svg');
  expect(svgs.length).toBe(2);
});
