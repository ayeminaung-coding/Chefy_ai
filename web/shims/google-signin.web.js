/**
 * Web shim for @react-native-google-signin/google-signin
 *
 * On web, Google Sign-In is handled by Firebase's signInWithPopup() directly
 * inside authStore.ts. This shim stubs the native module so webpack doesn't
 * crash trying to resolve native bindings.
 */
export const GoogleSignin = {
    configure: () => { },
    hasPlayServices: async () => true,
    signIn: async () => { throw new Error('Use Firebase signInWithPopup on web'); },
    signOut: async () => { },
};

export const statusCodes = {
    SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
    IN_PROGRESS: 'IN_PROGRESS',
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
};
