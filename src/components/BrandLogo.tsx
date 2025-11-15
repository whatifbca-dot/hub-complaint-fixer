interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const BrandLogo = ({ size = "md", className = "" }: BrandLogoProps) => {
  const sizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl md:text-5xl",
  };

  return (
    <div className={`font-bold ${sizes[size]} ${className}`}>
      <span className="bg-foreground text-background px-2 py-1 rounded">BRO</span>
      <span className="text-foreground">TOTYPE</span>
    </div>
  );
};
