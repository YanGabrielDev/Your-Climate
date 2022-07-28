import { createContext, ReactNode, useMemo, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

type TypeColorMode = "light" | "dark";

type AuxPros = {
  children: ReactNode;
};

interface ColorMode {
  toggleColorMode: () => void;
}

export const ColorModeContext = createContext<ColorMode>({
  toggleColorMode: () => {},
});

function ToogleColorMode({ children }: AuxPros) {
  const [mode, setMode] = useState<TypeColorMode>("light");
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                primary: {
                  main: "#076DDD",
                },
                success: {
                  main: "#06B966",
                },
                error: {
                  main: "#C43152",
                },
                warning: {
                  main: "#FFAD33",
                },
              }
            : {
                primary: {
                  main: "#6AA7EB",
                },
                success: {
                  main: "#6AD5A3",
                },
                error: {
                  main: "#DC8397",
                },
                warning: {
                  main: "#FFCE85",
                },
              }),
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default ToogleColorMode;
