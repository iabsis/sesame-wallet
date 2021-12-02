interface LoaderProps {
  title?: string;
}

let Loader = ({ title }: LoaderProps) => {
  return (
    <div className="loader-block">
      <div className="loader-1"></div>
      {title && <div className="loader-title">{title}</div>}
    </div>
  );
};

export default Loader;
