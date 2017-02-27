export type State = {
  loggedIn: boolean,
  userId: number,
  isLoggingIn: boolean,
  loginErrors: Error[],
  isRegistering: boolean,
  registerErrors: Error[],
};
