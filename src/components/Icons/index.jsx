export default function Icon({ iconType: IconType, roundedType = "full" }) {
  return (
    <div className={`w-12 h-12 flex items-center justify-center rounded-${roundedType} bg-tertiary-color`}>
      <IconType />
    </div>
  );
}
