// React
import { createContext, FC, useCallback, useEffect, useState } from "react";

// NPM
import { MySky } from "skynet-js";

// Config
import config from "config";

// Utils
import skynet from "utils/skynet";

export interface AuthState {
  app: MySky;
  user: string;
  initialising: boolean;
  authenticating: boolean;

  logout: () => void;
  authenticate: () => void;
}

export const initialAuthState: AuthState = {
  app: null,
  user: "",
  initialising: false,
  authenticating: false,

  logout: () => "",
  authenticate: () => "",
} as any;

export const AuthContext = createContext<AuthState>({ ...initialAuthState });

export const AuthProvider: FC = ({ children }) => {
  const [state, setState] = useState<AuthState>({ ...initialAuthState });

  // Init App and Auth
  useEffect(() => {
    if (state.app) return;
    if (state.initialising) return;

    const execute = async () => {
      setState((state) => ({ ...state, initialising: true }));
      const app = await skynet.loadMySky(config.skynet.domain);
      setState((state) => ({ ...state, app, initialising: false }));
    };

    execute();

    return () => {
      state.app.destroy();
    };
  }, []);

  useEffect(() => {
    if (!state.app) return;

    const execute = async () => {
      setState((state) => ({ ...state, authenticating: true }));
      const isAuthenticated = await state.app.checkLogin();
      const user = isAuthenticated ? await state.app.userID() : "";
      setState((state) => ({ ...state, user, authenticating: false }));
    };

    execute();
  }, [state.app]);

  // Authenticate and login
  const authenticate = useCallback(() => {
    if (!state.app) return;
    if (state.authenticating) return;

    const execute = async () => {
      setState((state) => ({ ...state, authenticating: true }));
      const success = await state.app.requestLoginAccess();
      const user = success ? await state.app.userID() : "";
      setState((state) => ({ ...state, user, authenticating: false }));
    };

    execute();
  }, [state]);

  // Logout
  const logout = useCallback(() => {
    if (!state.app) return;
    const execute = async () => {
      setState((state) => ({ ...state, authenticating: true }));
      await state.app.logout();
      setState((state) => ({ ...state, user: "", authenticating: false }));
    };

    execute();
  }, [state]);

  return (
    <AuthContext.Provider value={{ ...state, authenticate, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
