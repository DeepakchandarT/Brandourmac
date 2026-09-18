import "server-only";
import { readAdminSession, ADMIN_COOKIE } from "./admin-auth";
export function adminFromRequest(request:Request){const value=request.headers.get("cookie")?.match(new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE}=([^;]+)`))?.[1];return readAdminSession(value);}
