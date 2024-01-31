import { createContext, useRef, useState } from "react";

const CarrouselPaginationContext = createContext();

export const CarrouselPaginationProvider = ({ children }) => {
  // current page (when increased the data for the new page will be retrieved)
  const [page, setPage] = useState(1);
  // the array index of the element displayed in the carrousel most left
  const mostLeftVisibleItemIndexRef = useRef(0);
  // total pages for the request
  const totalPagesCountRef = useRef(1);
  // flag to avoid  undesired updates of page state value
  // when making a setPage this becomes true (only when true is possibly to update the state)
  // this flag only becomes true when clicking in the next button
  const canSetNextPageRef = useRef(false);

  return (
    <CarrouselPaginationContext.Provider
      value={{
        canSetNextPageRef,
        totalPagesCountRef,
        mostLeftVisibleItemIndexRef,
        page,
        setPage: (page) => {
          if (canSetNextPageRef.current) {
            canSetNextPageRef.current = false;
            setPage(page);
          }
        }
      }}
    >
      {children}
    </CarrouselPaginationContext.Provider>
  );
};

export default CarrouselPaginationContext;
