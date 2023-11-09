import { useEffect, useState } from "react";

const Dashboard = () => {
  const [sidebarHeight, setSidebarHeight] = useState(600);
  useEffect(() => {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
      setSidebarHeight(sidebar.offsetHeight);
    }
  }, []);
  return (
    <div className="bg-[#f9fafb] rounded-lg min-h-[80vh]">
      <div className="w-full relative" style={{ height: sidebarHeight - 100 }}>
        <iframe
          src="https://mixpanel.com/project/2195193/view/139237/app/boards/embed#id=586298"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
    </div>
  );
};

export default Dashboard;
