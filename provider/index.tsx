// React
import { FC } from "react";

// Provider
import { AuthProvider } from "provider/AuthProvider";

export const Provider: FC = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default Provider;
