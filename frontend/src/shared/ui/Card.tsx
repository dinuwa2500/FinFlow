interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  theme?: "default" | "danger" | "primary" | "warning";
  className?: string;
}

export const Card = ({
  children,
  theme = "default",
  className = "",
  ...props
}: CardProps) => {
  const themeStyles = {
    default: "border-border bg-background",
    danger: "border-danger/20 bg-danger/5",
    primary: "border-primary/20 bg-primary/5",
    warning: "border-warning/20 bg-warning/5",
  };

  return (
    <div
      className={`border rounded-xl p-6 shadow-sm ${themeStyles[theme]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
