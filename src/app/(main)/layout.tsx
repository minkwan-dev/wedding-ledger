import { BottomNav } from "@/shared/components/BottomNav";

export default function MainLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="mx-auto min-h-full max-w-lg px-6 pb-28 pt-6">
      {children}
      <BottomNav />
    </div>
  );
}
