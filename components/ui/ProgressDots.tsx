interface Props {
  total: number;
  current: number;
}

export default function ProgressDots({ total, current }: Props) {
  return (
    <div className="absolute top-6 left-1/2 flex -translate-x-1/2 gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full transition-colors ${
            i < current ? "bg-rose-500" : "bg-rose-200"
          }`}
        />
      ))}
    </div>
  );
}
