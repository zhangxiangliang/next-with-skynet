// React
import { FC, useContext } from "react";

// Store
import { AuthContext } from "provider/AuthProvider";

export const AuthButton: FC = () => {
  const { app, user, authenticate, authenticating, logout } =
    useContext(AuthContext);

  const className =
    "inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-palette-600 bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors";

  if (!app) {
    return (
      <button className={className} disabled={true}>
        Waiting for initialising
      </button>
    );
  }

  if (authenticating) {
    return (
      <button className={className} disabled={true}>
        Waiting for authentication
      </button>
    );
  }

  if (!user) {
    return (
      <button className={className} onClick={() => authenticate()}>
        Authenticate
      </button>
    );
  }

  return (
    <button className={className} onClick={logout}>
      Logout
    </button>
  );
};

export default AuthButton;
