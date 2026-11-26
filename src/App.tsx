import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme";
import { GlobalStyle } from "./styles/global";
import { AuthProvider } from "./contexts/AuthContext";
import { MonthProvider } from "./contexts/MonthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { AppRoutes } from "./routes";
import "./styles/reset.css";

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ToastProvider>
        <AuthProvider>
          <MonthProvider>
            <AppRoutes />
          </MonthProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
