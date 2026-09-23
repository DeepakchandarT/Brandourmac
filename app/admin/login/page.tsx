import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Image from "next/image";
import AdminLoginForm from "@/components/AdminLoginForm";
import { ADMIN_COOKIE, adminConfigured, readAdminSession } from "@/lib/admin-auth";
import "../admin.css";
export const dynamic="force-dynamic";
export default function AdminLogin(){if(readAdminSession(cookies().get(ADMIN_COOKIE)?.value))redirect("/admin");return <main className="admin-login"><a className="admin-back" href="/" aria-label="BrandMyReach home"><Image src="/brand/brandmyreach-wordmark.png" alt="BrandMyReach" width={190} height={42}/></a><AdminLoginForm configured={adminConfigured()}/></main>;}
