import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Aswin Krishna Photography",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh bg-[#000000] text-[#f2efe9] antialiased">
      {children}
    </div>
  );
}
