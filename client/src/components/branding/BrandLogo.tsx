import bocraLogo from "@/assets/branding/bocra-itu-tight.png";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  framed?: boolean;
};

export default function BrandLogo({
  className = "",
  imageClassName = "",
  framed = false,
}: BrandLogoProps) {
  const frameClassName = framed
    ? "rounded-lg bg-white px-3 py-2 shadow-sm ring-1 ring-white/10"
    : "";

  return (
    <div className={`inline-flex items-center ${className}`.trim()}>
      <div className={frameClassName}>
        <img
          src={bocraLogo}
          alt="BOCRA"
          className={`block w-auto ${imageClassName}`.trim()}
        />
      </div>
    </div>
  );
}
