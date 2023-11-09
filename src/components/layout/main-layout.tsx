import React from "react";
import { Grid, Layout as AntdLayout } from "antd";
import {
  RefineThemedLayoutV2Props,
  ThemedHeaderV2,
  ThemedLayoutContextProvider,
  ThemedSiderV2,
} from "@refinedev/antd";

export const MainLayout: React.FC<RefineThemedLayoutV2Props> = ({
  children,
  Header,
  Sider,
  Title,
  Footer,
  OffLayoutArea,
  initialSiderCollapsed,
}) => {
  const breakpoint = Grid.useBreakpoint();
  const SiderToRender = Sider ?? ThemedSiderV2;
  const HeaderToRender = Header ?? ThemedHeaderV2;
  const isSmall = typeof breakpoint.sm === "undefined" ? true : breakpoint.sm;

  return (
    <ThemedLayoutContextProvider initialSiderCollapsed={initialSiderCollapsed}>
      <AntdLayout style={{ minHeight: "100vh" }}>
        <SiderToRender Title={Title} />
        <AntdLayout>
          <HeaderToRender />
          <AntdLayout.Content>
            <div
              className="lg:ml-64 mt-[70px]"
              style={{
                minHeight: 360,
                padding: isSmall ? 24 : 12,
              }}
            >
              {children}
            </div>
            {OffLayoutArea && <OffLayoutArea />}
          </AntdLayout.Content>
          {Footer && <Footer />}
        </AntdLayout>
      </AntdLayout>
    </ThemedLayoutContextProvider>
  );
};
