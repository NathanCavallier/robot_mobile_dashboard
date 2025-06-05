import { subscribeToEvent, getSocket as originalGetSocket } from './websocketService';
import type { ServerToClientEvents } from './websocketService';


// filepath: /Users/nathanimogo/Documents/GitHub/robot_mobile_dashboard/frontend/src/services/websocketService.test.ts

describe('subscribeToEvent', () => {
    let onMock: jest.Mock, offMock: jest.Mock;
    const dummyCallback = jest.fn();

    beforeEach(() => {
        onMock = jest.fn();
        offMock = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
        dummyCallback.mockReset();
    });

    it('should register and unregister event handlers when socket is available', () => {
        // Arrange: spy on getSocket to return a fake socket
        const fakeSocket = { on: onMock, off: offMock };
        jest.spyOn(require('./websocketService'), 'getSocket').mockReturnValue(fakeSocket as any);

        // Act: subscribe to an event
        const unsubscribe = subscribeToEvent('robot_state_update', dummyCallback as ServerToClientEvents['robot_state_update']);

        // Assert: on() called with correct args, and unsubscribe works
        expect(onMock).toHaveBeenCalledWith('robot_state_update', dummyCallback);
        expect(typeof unsubscribe).toBe('function');

        // When calling unsubscribe, off() should be called
        unsubscribe!();
        expect(offMock).toHaveBeenCalledWith('robot_state_update', dummyCallback);
    });

    it('should return undefined and warn when socket is not initialized', () => {
        // Arrange: spy on getSocket to return null
        jest.spyOn(require('./websocketService'), 'getSocket').mockReturnValue(null);
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });

        // Act: attempt to subscribe
        const result = subscribeToEvent('new_robot_log', dummyCallback as ServerToClientEvents['new_robot_log']);

        // Assert: returns undefined and logs warning
        expect(result).toBeUndefined();
        expect(consoleWarnSpy).toHaveBeenCalledWith(
            'Socket not initialized, cannot subscribe to event:',
            'new_robot_log'
        );
    });
});