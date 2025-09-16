import * as React from 'react';
import { render, cleanup } from '@testing-library/react-native';
import { MonoText } from '../StyledText';

// Stabilize theme so it doesn't flip between light/dark in CI
jest.mock('../useColorScheme', () => ({
    useColorScheme: () => 'light',
}));

afterEach(cleanup);

it('renders correctly', () => {
    const { toJSON, unmount } = render(<MonoText>Snapshot test!</MonoText>);
    expect(toJSON()).toMatchSnapshot();
    unmount();
});
