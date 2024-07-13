export default function Icon({ iconType: IconType }) {
  return (
    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-tertiary-color">
      <IconType />
    </div>
  );
}
