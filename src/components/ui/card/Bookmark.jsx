import { useContext } from "react";
import "./Bookmark.css";
import MyBookmarksContext from "../../../contexts/MyBookmarksContext";

const Bookmark = ({ item, styles = {} }) => {
  const {
    items: bookmarkedItems,
    add,
    remove,
  } = useContext(MyBookmarksContext);

  const bookmarked = bookmarkedItems.has(item.id);

  const onClickHandler = (event) => {
    event.stopPropagation();
    bookmarked ? remove(item.id) : add(item);
  };

  return (
    <button
      style={{ ...styles }}
      onClick={onClickHandler}
      className="bookmark-btn"
    >
      <i
        className={`fa-${bookmarked ? "solid" : "regular"} fa-star`}
        style={{ fontSize: "1.3em" }}
      ></i>
    </button>
  );
};

export default Bookmark;
