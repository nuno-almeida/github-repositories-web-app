import { useQuery } from "@tanstack/react-query";
import { fetchRespositories } from "../gateways/repositories";
import { API_DATA_STALE_TIME } from "../utils/constants";
import { useContext, useEffect, useState } from "react";
import CarrouselPaginationContext from "../contexts/CarrouselPaginationContext";

const useQueryRepositories = ({ topicQueryText = "", sortQueryText = "" }) => {
  const { totalPagesCountRef, page } = useContext(CarrouselPaginationContext);
  const [items, setItems] = useState([]);

  const { isLoading, error, data } = useQuery({
    queryKey: [`get_repositories_${topicQueryText}_${sortQueryText}_${page}`],
    queryFn: () =>
      fetchRespositories({ topic: topicQueryText, sort: sortQueryText, page }),
    staleTime: API_DATA_STALE_TIME,
  });

  // PAGINATION
  // the items returned from this hook are the items or all the fechted pages
  useEffect(() => {
    const {
      items: responseItems,
      totalPagesCount,
      page: pageResponse,
    } = data || {};

    if (!!responseItems) {
      setItems((existingsItems) => [...existingsItems, ...responseItems]);

      if (pageResponse === 1) {
        totalPagesCountRef.current = totalPagesCount;
      }
    }
  }, [data, totalPagesCountRef]);

  return {
    items,
    loading: isLoading,
    errorMessage: error?.message,
  };
};

export default useQueryRepositories;
