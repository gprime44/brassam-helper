import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import BrewingSessionDetail from './BrewingSessionDetail';
import { brewingApi } from '../../services/api';

vi.mock('../../services/api', () => ({
  brewingApi: {
    getSessionDetail: vi.fn(),
    toggleTask: vi.fn(),
  }
}));

describe('BrewingSessionDetail', () => {
  it('should render session details and tasks', async () => {
    const mockSession = {
      id: 1,
      name: 'Test Batch',
      status: 'MASHING',
      tasks: [
        { id: 101, label: 'Task 1', completed: false, category: 'MASHING', orderIndex: 0 }
      ],
      readings: []
    };
    
    vi.mocked(brewingApi.getSessionDetail).mockResolvedValue(mockSession);
    
    render(<BrewingSessionDetail sessionId={1} />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Batch')).toBeInTheDocument();
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });
  });
});
