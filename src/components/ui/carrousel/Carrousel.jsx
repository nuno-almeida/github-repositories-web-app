import React, { useContext, useMemo, useState } from "react";
import Card from "../card/Card";
import "./Carrousel.css";
import useCarrouselNextButton from "../../../hooks/useCarrouselNextButton";
import { isElementWithinViewportWidth } from "../../../utils/helpers";
import CarrouselPaginationContext from "../../../contexts/CarrouselPaginationContext";

const getVisibleItemsCount = ({ id, itemsToRender }) => {
  let count = 0;

  for (let index = 0; index < itemsToRender.length; index++) {
    isElementWithinViewportWidth({ id: id + "_" + itemsToRender[index].id }) &&
      count++;
  }

  return count === 0 ? 1 : count;
};

const CarrouselNavigationBtn = ({ onClickHandler, direction = "" }) => (
  <button
    className={`border navigation-btn ${
      direction === "prev" ? "navigation-btn-prev" : "navigation-btn-next"
    }`}
    onClick={onClickHandler}
    style={{
      ...(direction === "prev" && { position: "absolute" }),
    }}
  >
    <span
      className={`d-flex h-50 ${
        direction === "prev"
          ? "carousel-control-prev-icon"
          : "carousel-control-next-icon"
      } `}
      style={{ marginLeft: "-0.4em", filter: "invert(100%)" }}
    />
  </button>
);

const CarrouselPrevButton = ({
  id,
  itemsToRender,
  setItemsToRender,
  items,
  carrouselItemsCount,
  mostLeftVisibleItemIndexRef,
}) => {
  const handleClickPrev = () => {
    const visibleItemsCount = getVisibleItemsCount({ id, itemsToRender });

    let newLeftIndex = mostLeftVisibleItemIndexRef.current - visibleItemsCount;

    if (newLeftIndex < 0) {
      newLeftIndex = 0;
    }

    mostLeftVisibleItemIndexRef.current = newLeftIndex;

    setItemsToRender(
      items.slice(newLeftIndex, newLeftIndex + carrouselItemsCount)
    );
  };

  if (mostLeftVisibleItemIndexRef.current <= 0) {
    return null;
  }

  return (
    <CarrouselNavigationBtn onClickHandler={handleClickPrev} direction="prev" />
  );
};

const CarrouselNextButton = ({
  id,
  carrouselItemsCount,
  mostLeftVisibleItemIndexRef,
  itemsToRender,
  items,
  canSetNextPageRef,
  setItemsToRender,
}) => {
  const itemsIds = useMemo(
    () => itemsToRender.map((item) => item.id),
    [itemsToRender]
  );

  const { showNextBtn } = useCarrouselNextButton({
    id,
    itemsIds, // items ids that are to be rendered
    lastItemId: items.slice(-1)[0].id, // last item form the all list
  });

  const handleClickNext = () => {
    const visibleItemsCount = getVisibleItemsCount({ id, itemsToRender });

    let newLeftIndex = mostLeftVisibleItemIndexRef.current + visibleItemsCount;

    // in case will remaing more items than the ones existing in the list to render
    // then advance the slider just the necessary to fill the slider with all elements
    if (newLeftIndex + visibleItemsCount > items.length - 1) {
      newLeftIndex = items.length - visibleItemsCount;
    }

    mostLeftVisibleItemIndexRef.current = newLeftIndex;
    canSetNextPageRef.current = true;

    setItemsToRender(
      items.slice(newLeftIndex, newLeftIndex + carrouselItemsCount)
    );
  };

  if (!showNextBtn) {
    return null;
  }

  return (
    <CarrouselNavigationBtn onClickHandler={handleClickNext} direction="next" />
  );
};

const Carrousel = ({ items = [], id, itemsToRenderCount }) => {
  const { mostLeftVisibleItemIndexRef, canSetNextPageRef } = useContext(
    CarrouselPaginationContext
  );

  // render just a set of the all items in order to not polute the HTML and slower the app
  // behaviour like virtual scrolling
  const carrouselItemsCount = itemsToRenderCount || items.length;

  const [itemsToRender, setItemsToRender] = useState(() =>
    items.slice(
      mostLeftVisibleItemIndexRef.current,
      mostLeftVisibleItemIndexRef.current + carrouselItemsCount
    )
  );

  return (
    <div id={id} className="d-flex gap-2">
      <CarrouselPrevButton
        id={id}
        itemsToRender={itemsToRender}
        setItemsToRender={setItemsToRender}
        items={items}
        carrouselItemsCount={carrouselItemsCount}
        mostLeftVisibleItemIndexRef={mostLeftVisibleItemIndexRef}
      />

      <div className="d-flex gap-2 p-3" style={{ overflow: "hidden" }}>
        {itemsToRender.map((item) => (
          <Card idPrefix={id} key={item.id} item={item} />
        ))}
      </div>

      <CarrouselNextButton
        id={id}
        carrouselItemsCount={carrouselItemsCount}
        mostLeftVisibleItemIndexRef={mostLeftVisibleItemIndexRef}
        itemsToRender={itemsToRender}
        items={items}
        canSetNextPageRef={canSetNextPageRef}
        setItemsToRender={setItemsToRender}
      />
    </div>
  );
};

export default Carrousel;
