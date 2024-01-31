import { useCallback, useEffect, useState } from "react";
import { CARD_MIN_WIDTH_PX } from "../../../utils/constants";
import { getDocumentWidth } from "../../../utils/helpers";
import AlertDialog from "../../utils/AlertDialog";
import Loading from "../../utils/Loading";
import Carrousel from "../carrousel/Carrousel";

// add just a mergin of more 2 elements
const getItemsToRenderCount = () =>
  Math.ceil(getDocumentWidth() / CARD_MIN_WIDTH_PX) + 2;

const Content = ({
  id,
  loading = false,
  items = [],
  errorMessage = "",
  emptyMessage = "",
}) => {
  const [itemsToRenderCount, setItemsToRenderCount] = useState(() =>
    getItemsToRenderCount()
  );

  const updateItemsToRenderCount = useCallback(() => {
    setItemsToRenderCount(getItemsToRenderCount());
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateItemsToRenderCount);
    return () => window.removeEventListener("resize", updateItemsToRenderCount);
  }, [updateItemsToRenderCount]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5 m-5">
        <Loading />
      </div>
    );
  }

  if (!!errorMessage) {
    return (
      <div className="mx-3">
        <AlertDialog type="danger" message={errorMessage} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-3">
        <AlertDialog type="dark" message={emptyMessage} />
      </div>
    );
  }

  return (
    <Carrousel
      key={"carrousel_" + id}
      items={items}
      id={"carrousel_" + id}
      itemsToRenderCount={itemsToRenderCount}
    />
  );
};

const RepositoriesList = ({
  id,
  header,
  items = [],
  loading = false,
  errorMessage = "",
  emptyMessage = "",
}) => {
  return (
    <div className="d-flex flex-column py-2">
      {header}
      <Content
        items={items}
        id={id}
        loading={loading}
        errorMessage={errorMessage}
        emptyMessage={emptyMessage}
      />
    </div>
  );
};

export default RepositoriesList;
