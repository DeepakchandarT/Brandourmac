import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/AdminDashboard";
import { ADMIN_COOKIE, readAdminSession } from "@/lib/admin-auth";
import { analyticsDashboard } from "@/lib/analytics";
import { getDraftSponsor, getPublishedSponsor } from "@/lib/sponsor";
import "./admin.css";
export const dynamic="force-dynamic";
export default async function AdminPage(){
  if(!readAdminSession(cookies().get(ADMIN_COOKIE)?.value))redirect("/admin/login");
  const [analytics,draft,published]=await Promise.all([analyticsDashboard(),getDraftSponsor(),getPublishedSponsor()]);
  return <AdminDashboard initialAnalytics={analytics} initialDraft={draft} initialPublished={published}/>;
}
