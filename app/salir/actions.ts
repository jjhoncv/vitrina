"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_SESION } from "@/lib/sesion";

export async function salirAccion() {
  (await cookies()).delete(COOKIE_SESION);
  redirect("/");
}
