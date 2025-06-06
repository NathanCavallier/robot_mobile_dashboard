// filepath: [RobotStateDisplay.test.tsx](http://_vscodecontentref_/2)
/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RobotStateDisplay from '../../src/components/features/robot-status/RobotStateDisplay';
import * as useRobotHook from '../../src/hooks/useRobotState';

afterEach(() => {
  jest.resetAllMocks();
});

describe('RobotStateDisplay', () => {
  it('shows loading skeleton when robot state is loading', () => {
    jest.spyOn(useRobotHook, 'useRobot').mockReturnValue({
      robotState: null,
      robotConfig: null,
      isLoadingState: true,
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
    } as any);

    render(<RobotStateDisplay />);

    expect(screen.queryByText('État Général du Robot')).not.toBeInTheDocument();
  });

  it('displays error message when error occurs', () => {
    jest.spyOn(useRobotHook, 'useRobot').mockReturnValue({
      robotState: null,
      robotConfig: null,
      isLoadingState: false,
      isLoadingConfig: false,
      errorState: 'oops',
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
    } as any);

    render(<RobotStateDisplay />);

    expect(
      screen.getByText(/Erreur de chargement de l'état du robot/i)
    ).toBeInTheDocument();
  });

  it('renders robot information when data available', () => {
    jest.spyOn(useRobotHook, 'useRobot').mockReturnValue({
      robotState: {
        _id: '1',
        robotId: '1',
        lastSeen: '2024-01-01T00:00:00Z',
        batteryLevel: 80,
        motorStatus: 'OK',
        cameraStatus: 'ACTIVE',
        currentMode: 'AUTONOMOUS',
        connectionStatus: 'CONNECTED',
        createdAt: '',
        updatedAt: '',
      },
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
    } as any);

    render(<RobotStateDisplay />);

    expect(screen.getByText('État Général du Robot')).toBeInTheDocument();
    expect(screen.getByText('80')).toBeInTheDocument();
  });
});
