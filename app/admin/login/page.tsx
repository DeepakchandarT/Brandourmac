import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminLoginForm from "@/components/AdminLoginForm";
import { ADMIN_COOKIE, adminConfigured, readAdminSession } from "@/lib/admin-auth";
import "../admin.css";
export const dynamic="force-dynamic";
export default function AdminLogin(){if(readAdminSession(cookies().get(ADMIN_COOKIE)?.value))redirect("/admin");return <main className="admin-login"><a className="admin-back" href="/">DEEPAK / CAMPAIGN</a><AdminLoginForm configured={adminConfigured()}/></main>;}
