export default function FooterStripe() {
  return (
    <div
      className="h-[6px] w-full"
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, #FFD315 0 36px, #091822 36px 56px)",
      }}
      aria-hidden="true"
    />
  );
}
