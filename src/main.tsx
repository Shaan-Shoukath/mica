import React from "react";
import ReactDOM from "react-dom/client";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";
import App from "./App";
import { ThemeProvider } from "./components/theme-provider";
import { APP_SOFT_RELOAD_EVENT } from "./lib/reload-app";

function Bootstrap() {
  const [reloadKey, setReloadKey] = React.useState(0);
  React.useEffect(() => {
    const handler = () => setReloadKey((k) => k + 1);
    window.addEventListener(APP_SOFT_RELOAD_EVENT, handler);
    return () => window.removeEventListener(APP_SOFT_RELOAD_EVENT, handler);
  }, []);
  return <App key={reloadKey} />;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <DndProvider backend={HTML5Backend}>
    <React.StrictMode>
      <ThemeProvider>
        <Bootstrap />
      </ThemeProvider>
    </React.StrictMode>
  </DndProvider>,
);
