import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/AdminDashboard";
import { ADMIN_COOKIE, readAdminSession } from "@/lib/admin-auth";
import { analyticsDashboard } from "@/lib/analytics";
import { isPublished } from "@/lib/campaign";
import { getDraftSponsor, getPublishedSponsor } from "@/lib/sponsor";
import "./admin.css";
export const dynamic="force-dynamic";
export default async function AdminPage(){
  if(!readAdminSession(cookies().get(ADMIN_COOKIE)?.value))redirect("/admin/login");
  const [analytics,draft,published,campaignOpen]=await Promise.all([analyticsDashboard(),getDraftSponsor(),getPublishedSponsor(),isPublished()]);
  return <AdminDashboard initialAnalytics={analytics} initialDraft={draft} initialPublished={published} initialCampaignOpen={campaignOpen}/>;
}
