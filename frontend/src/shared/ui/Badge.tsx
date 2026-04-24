export const Badge = ({
  children,
  type = "success",
}: {
  children: React.ReactNode;
  type?: "success" | "danger";
}) => (
  <span
    className={`text-[10px] font-bold px-2 py-1 rounded-full ${
      type === "success"
        ? "bg-green-100 text-green-600"
        : "bg-red-100 text-red-600"
    }`}
  >
    {children}
  </span>
);
