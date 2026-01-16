export default function Loading({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="spinner mb-4"></div>
      <p className="text-gold">{text}</p>
    </div>
  );
}
