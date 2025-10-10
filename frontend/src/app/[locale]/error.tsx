"use client";
export default function GlobalError({ error }: { error: Error }) {
  return (
    <html>
      <body className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-4xl font-bold text-red-600">500</h1>
        <p className="text-lg text-gray-600 mt-2">Une erreur est survenue</p>
        <pre className="text-sm mt-4">{error.message}</pre>
      </body>
    </html>
  );
}
