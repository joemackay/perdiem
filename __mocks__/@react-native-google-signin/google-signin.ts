export const GoogleSignin = {
  configure: jest.fn(),
  hasPlayServices: jest.fn().mockResolvedValue(true),
  signIn: jest.fn().mockResolvedValue({
    idToken: 'mock-id-token',
    user: { name: 'Mock User', email: 'mock@example.com' },
  }),
  signOut: jest.fn(),
  isSignedIn: jest.fn().mockResolvedValue(false),
};

export const statusCodes = {
  SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
  IN_PROGRESS: 'IN_PROGRESS',
  PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
};

export const GoogleSigninButton = () => null;