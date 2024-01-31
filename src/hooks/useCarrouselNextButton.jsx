import { useCallback, useContext, useEffect, useState } from "react";
import { isElementWithinViewportWidth } from "../utils/helpers";
import CarrouselPaginationContext from "../contexts/CarrouselPaginationContext";

// Next button by default is visible
// In case the last item is within the viewport
//    Then if is last page being rendered, hides the buttons
//    Otherwise keeps the button visible and increases the page (to fetch next page data)
const useCarrouselNextButton = ({ id, itemsIds = [], lastItemId }) => {
  const { setPage, page, totalPagesCountRef } = useContext(
    CarrouselPaginationContext
  );

  const [showNextBtn, setShowNextBtn] = useState(true);

  const checkIsInViewport = useCallback(() => {
    // lastItemId not yet present in the list to be rendered then the button is to be displayed
    // otherwise trigger next page or hide the button if is rendered data from last page
    if (itemsIds.includes(lastItemId)) {
      if (page < totalPagesCountRef.current) {
        setShowNextBtn(true);
        setPage(page + 1);
      } else {
        // last page then set visibility checking if items is on viewport
        setShowNextBtn(
          !isElementWithinViewportWidth({ id: id + "_" + lastItemId })
        );
      }
    } else {
      setShowNextBtn(true);
    }
  }, [itemsIds, id, lastItemId, page, setPage, totalPagesCountRef]);

  useEffect(() => {
    window.addEventListener("resize", checkIsInViewport);
    return () => window.removeEventListener("resize", checkIsInViewport);
  }, [checkIsInViewport]);

  useEffect(() => {
    checkIsInViewport();
  }, [checkIsInViewport]);

  return {
    showNextBtn,
  };
};

export default useCarrouselNextButton;
