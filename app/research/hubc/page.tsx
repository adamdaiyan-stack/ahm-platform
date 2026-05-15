// app/research/hubc/page.tsx
// Legacy route — redirects to the dynamic slug-based research system.
import { redirect } from "next/navigation";
export default function HUBCRedirect() {
  redirect("/research/hubc-initiation-buy-may-2026");
}
