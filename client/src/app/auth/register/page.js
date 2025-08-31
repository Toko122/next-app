"use client";

import React from "react";
import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 md:p-6">
      <RegisterForm />
    </div>
  );
}
