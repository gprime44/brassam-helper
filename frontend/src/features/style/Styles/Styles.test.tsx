/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Styles from './Styles';
import { styleApi } from '../../../services/api';

vi.mock('../../../services/api', () => ({
  styleApi: {
    getStyles: vi.fn(),
  },
}));

describe('Styles Component', () => {
  it('should fetch and display styles', async () => {
    const mockStyles = {
      content: [
        { id: 1, name: 'Ordinary Bitter', category: 'British Bitter', styleId: '11A', abvMin: 3.2, abvMax: 3.8 },
      ],
      last: true,
    };

    (styleApi.getStyles as any).mockResolvedValue(mockStyles);

    render(<Styles onSelectItem={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('Ordinary Bitter')).toBeDefined();
    });
  });

  it('should search styles when typing', async () => {
    (styleApi.getStyles as any).mockResolvedValue({ content: [], last: true });

    render(<Styles onSelectItem={() => {}} />);

    const searchInput = screen.getByPlaceholderText(/chercher|search/i);
    fireEvent.change(searchInput, { target: { value: 'IPA' } });

    await waitFor(() => {
      expect(styleApi.getStyles).toHaveBeenCalledWith('IPA', 0);
    });
  });
});
