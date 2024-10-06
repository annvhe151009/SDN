import AdminSidebar from "../components/AdminSidebar";
import AdminTopNav from "../components/AdminTopNav";

function AdminLayout({ children }) {
  return (
    <>
      <AdminSidebar />
      <div style={{ marginLeft: "230px" }}>
        <AdminTopNav />
        {children}
      </div>
    </>
  );
}

export default AdminLayout;
