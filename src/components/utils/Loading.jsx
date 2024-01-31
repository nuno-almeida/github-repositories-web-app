import useViewport from "../../hooks/useViewport";

const Loading = () => {
  const { isLarge } = useViewport();

  return (
    <div
      className={`spinner-border ${!isLarge ? "spinner-border-sm" : ""}`}
      role="status"
    ></div>
  );
};

export default Loading;
