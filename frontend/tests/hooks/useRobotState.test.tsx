import React from 'react';
import { renderHook } from '@testing-library/react';
import { useRobot } from '../../src/hooks/useRobotState';
import { RobotContext } from '../../src/contexts/RobotContext';

describe('useRobot', () => {
  it('throws when used outside of RobotProvider', () => {
    expect(() => renderHook(() => useRobot())).toThrow(
      'useRobot must be used within a RobotProvider'
    );
  });

  it('returns context value from provider', () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <RobotContext.Provider value={{
        robotState: null,
        robotConfig: null,
        isLoadingState: false,
        isLoadingConfig: false,
        errorState: null,
        errorConfig: null,
        sendCommand: jest.fn(),
        fetchRobotState: jest.fn(),
        fetchRobotConfig: jest.fn(),
        updateRobotConfig: jest.fn(),
        logs: [],
        paginatedLogsInfo: null,
        isLoadingLogs: false,
        errorLogs: null,
        fetchLogs: jest.fn(),
        addLogManually: jest.fn(),
      }}>
        {children}
      </RobotContext.Provider>
    );

    const { result } = renderHook(() => useRobot(), { wrapper });
    expect(result.current).toBeDefined();
  });
});
