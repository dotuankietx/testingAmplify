import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  ThemedLayoutV2,
  ThemedTitleV2,
  useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { authProvider } from "./authProvider";
import { AppIcon } from "./components/app-icon";
import { Login } from "./pages/login";
import TrainingCrud from "./pages/training";
import UserCrud from "./pages/user";
import ConversationCrud from "./pages/conversation";
import GoalConfigCrud from "./pages/goalConfig";
import GoalCrud from "./pages/goal";
import { FULL_API_URL, dataProvider } from "./dataProvider";
import { Header, SideBar } from "./components";
import { BASE_PATH } from "./constants/app";
import { useTranslation } from "react-i18next";
import { QueryClient } from "@tanstack/react-query";
import Dashboard from "./pages/dashboard";
import { MainLayout } from "./components/layout/main-layout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {},
  },
});

function App() {
  const { t, i18n } = useTranslation();
  const notificationProvider = useNotificationProvider();
  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <DevtoolsProvider>
          <Refine
            dataProvider={dataProvider(FULL_API_URL)}
            authProvider={authProvider}
            i18nProvider={i18nProvider}
            routerProvider={routerBindings}
            notificationProvider={notificationProvider}
            options={{
              reactQuery: {
                clientConfig: queryClient,
              },
              warnWhenUnsavedChanges: true,
            }}
            resources={[
              {
                name: "user",
                list: BASE_PATH + "/user",
                show: BASE_PATH + "/user/show/:id",
              },
              {
                name: "conversation",
                list: BASE_PATH + "/conversation",
                show: BASE_PATH + "/conversation/show/:id",
              },
            ]}
          >
            <Routes>
              <Route
                element={
                  <Authenticated
                    key="authenticated-inner"
                    fallback={<CatchAllNavigate to="/login" />}
                  >
                    <MainLayout
                      Header={() => <Header />}
                      Sider={() => <SideBar />}
                      Title={({ collapsed }) => (
                        <ThemedTitleV2
                          collapsed={collapsed}
                          text="Admin Panel"
                          icon={<AppIcon />}
                        />
                      )}
                    >
                      <Outlet />
                    </MainLayout>
                  </Authenticated>
                }
              >
                <Route
                  index
                  element={<Navigate to={`${BASE_PATH}/dashboard`} />}
                />
                <Route
                  path={`${BASE_PATH}/dashboard`}
                  element={<Dashboard />}
                />
                <Route
                  path={BASE_PATH}
                  element={<Navigate to={`${BASE_PATH}/dashboard`} />}
                />
                <Route path={`${BASE_PATH}/user`}>
                  <Route index element={<UserCrud.CrudList />} />
                  <Route path="show/:id" element={<UserCrud.CrudShow />} />
                </Route>
                <Route path={`${BASE_PATH}/training-data`}>
                  <Route index element={<TrainingCrud.CrudList />} />
                </Route>
                <Route path={`${BASE_PATH}/conversation`}>
                  <Route index element={<ConversationCrud.CrudList />} />
                  <Route
                    path="show/:id"
                    element={<ConversationCrud.CrudShow />}
                  />
                  <Route
                    path="show/:id"
                    element={<ConversationCrud.CrudShow />}
                  />
                </Route>
                <Route path={`${BASE_PATH}/goal-config`}>
                  <Route index element={<GoalConfigCrud.CrudList />} />
                </Route>
                <Route path={`${BASE_PATH}/goal`}>
                  <Route index element={<GoalCrud.CrudList />} />
                </Route>
                <Route path="*" element={<ErrorComponent />} />
              </Route>
              <Route
                element={
                  <Authenticated
                    key="authenticated-outer"
                    fallback={<Outlet />}
                  >
                    <NavigateToResource />
                  </Authenticated>
                }
              >
                <Route path="/login" element={<Login />} />
              </Route>
            </Routes>

            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
          <DevtoolsPanel />
        </DevtoolsProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
