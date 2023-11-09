import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./styles.css";
import { Toaster } from "react-hot-toast";
import "./i18n";
import { ConfigProvider } from "antd";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <React.Suspense fallback="">
      <ConfigProvider>
        <App />
      </ConfigProvider>
      <Toaster />
    </React.Suspense>
  </React.StrictMode>
);
