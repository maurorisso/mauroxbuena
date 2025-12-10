import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Property Management System",
  description: "Property Management System",
};

const PropertyLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen w-full bg-zinc-50 flex-col  gap-4 flex">
      <main className="flex items-center  container mx-auto justify-center w-full flex-col gap-4">
        {children}
      </main>
    </main>
  );
};

export default PropertyLayout;
