import { useContext } from "react";
import MyBookmarksContext from "../../../contexts/MyBookmarksContext";
import RepositoriesList from "./RepositoriesList";
import { CarrouselPaginationProvider } from "../../../contexts/CarrouselPaginationContext";

const MyBookmarksSection = () => {
  const {
    items: bookmarkedItems,
    loading,
    errorMessage,
  } = useContext(MyBookmarksContext);
  const bookmarkedItemsArray = Array.from(bookmarkedItems.values());

  return (
    <CarrouselPaginationProvider
      key={`my_bookmarks_` + bookmarkedItemsArray.length}
    >
      <RepositoriesList
        id="my_bookmarks"
        header={<h4 className="px-3">My Bookmarks</h4>}
        items={bookmarkedItemsArray}
        loading={loading}
        errorMessage={errorMessage}
        emptyMessage="No bookmarked repositories to display"
      />
    </CarrouselPaginationProvider>
  );
};

export default MyBookmarksSection;
