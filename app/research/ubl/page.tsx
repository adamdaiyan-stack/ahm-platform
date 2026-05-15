// app/research/ubl/page.tsx
// Legacy route — redirects to the dynamic slug-based research system.
import { redirect } from "next/navigation";
export default function UBLRedirect() {
  redirect("/research/ubl-initiation-buy-may-2026");
}
