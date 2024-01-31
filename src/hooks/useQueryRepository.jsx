import { useQuery } from "@tanstack/react-query";
import { fetchRespositoryById } from "../gateways/repositories";
import { API_DATA_STALE_TIME } from "../utils/constants";

// Gets a repository by id
// as there is additional data that is returned by this endpoint that is not present in get repos by topic (like subscribers_count)
const useQueryRepository = ({ id }) => {
  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: [`get_repository_${id}`],
    queryFn: () => fetchRespositoryById(id),
    staleTime: API_DATA_STALE_TIME,
  });

  return {
    data,
    loading: isLoading || isFetching,
    errorMessage: error?.message,
  };
};

export default useQueryRepository;
