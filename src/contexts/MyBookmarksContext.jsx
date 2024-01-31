import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext } from "react";
import { fetchRespositoriesByIds } from "../gateways/repositories";
import { API_DATA_STALE_TIME } from "../utils/constants";
import { fetchBookmarksByUserId, updateBookmarksByUserId } from "../gateways/firebase";

const MyBookmarksContext = createContext();

export const MyBookmarksProvider = ({ children, userId }) => {
  const queryClient = useQueryClient();

  const addRepoMutation = useMutation({
    mutationFn: async (repo) => Promise.resolve(repo),
    onSuccess: (data) => {
      queryClient.setQueryData(["bookmarkedRepos"], (old) => {
        const map = new Map(old);
        map.set(data.id, data);
        return map;
      });
    },
  });

  const removeRepoMutation = useMutation({
    mutationFn: async (repoId) => Promise.resolve(repoId),
    onSuccess: (data) => {
      queryClient.setQueryData(["bookmarkedRepos"], (old) => {
        const map = new Map(old);
        map.delete(data);
        return map;
      });
    },
  });

  const { isLoading, error, data } = useQuery({
    queryKey: ["bookmarkedRepos"],
    queryFn: async () => {
      const bookmarkIds = await fetchBookmarksByUserId(userId);
      return fetchRespositoriesByIds(bookmarkIds);
    },
    staleTime: API_DATA_STALE_TIME
  });

  const add = (item) => {
    addRepoMutation.mutateAsync(item);

    const bookmarkIds = [...Array.from(data.keys()), item.id];
    updateBookmarksByUserId({id: userId, data: bookmarkIds});
  };

  const remove = (itemId) => {
    removeRepoMutation.mutateAsync(itemId);

    const bookmarkIds = Array.from(data.keys()).filter(bookmarkId => bookmarkId !== itemId);
    updateBookmarksByUserId({id: userId, data: bookmarkIds});
  };

  return (
    <MyBookmarksContext.Provider
      value={{
        loading: isLoading,
        errorMessage: error?.message,
        items: data || new Map(),
        add,
        remove,
      }}
    >
      {children}
    </MyBookmarksContext.Provider>
  );
};

export default MyBookmarksContext;
