import { createContext, useEffect, useState } from "react";
import {
  fetchTopicsByUserId,
  updateTopicsByUserId,
} from "../gateways/firebase";

const UserSettingsContext = createContext();

export const UserSettingsProvider = ({ children, userId }) => {
  const [topics, setTopics] = useState(new Map());

  useEffect(() => {
    const fetchTopics = async () => {
      const topicsData = (await fetchTopicsByUserId(userId)) || {};
      setTopics(new Map(Object.entries(topicsData)));
    };

    fetchTopics();
  }, [userId]);

  const addTopic = (topicId, sortBy = "") => {
    const newTopics = new Map(topics);
    newTopics.set(topicId, { sortBy });

    setTopics(newTopics);
    updateTopicsByUserId({ id: userId, data: Object.fromEntries(newTopics) });
  };

  const removeTopic = (topicId) => {
    const newTopics = new Map(topics);
    newTopics.delete(topicId);

    setTopics(newTopics);
    updateTopicsByUserId({ id: userId, data: Object.fromEntries(newTopics) });
  };

  const toggleTopic = (topicId) =>
    topics.has(topicId) ? removeTopic(topicId) : addTopic(topicId);

  const setTopicSortBy = ({ topicId, sortBy }) => addTopic(topicId, sortBy);

  return (
    <UserSettingsContext.Provider
      value={{
        topics,
        toggleTopic,
        setTopicSortBy,
      }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
};

export default UserSettingsContext;
