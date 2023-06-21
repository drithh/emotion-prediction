import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Page from "./page";
import { Toaster } from "react-hot-toast";
function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Page />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
