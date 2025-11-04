"use client";

import { useEffect } from "react";

export default function GlobalError({ error }: { error: Error }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-50">
      <h1 className="text-4xl font-bold text-red-600">500</h1>
      <p className="text-lg text-gray-600 mt-2">Une erreur est survenue</p>
      <pre className="text-sm mt-4 text-gray-700">{error.message}</pre>
    </div>
  );
}
