const Checkbox = ({ checked }: { checked: boolean }) => {
  return <i className={`checkbox icon-coche ${checked ? "checked" : ""}`} />;
};

export default Checkbox;
