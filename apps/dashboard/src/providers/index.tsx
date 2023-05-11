import QueryProvider from "./query";
import TRPCProvider from "./trpc";
import { CookiesProvider } from "react-cookie";

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <CookiesProvider>
      <QueryProvider>
        <TRPCProvider>{children}</TRPCProvider>
      </QueryProvider>
    </CookiesProvider>
  );
};

export default RootProvider;
