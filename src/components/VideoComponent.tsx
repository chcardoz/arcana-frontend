export default function VideoComponent(props: { src: string }) {
  return (
    <iframe
      src={props.src}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="aspect-square min-h-full rounded-lg"
    />
  );
}
