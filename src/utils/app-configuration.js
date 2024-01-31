// NOTE this configuration could be read from an API in case the configuration is defined por example from a DB
export const TopicsConfigurations = {
  vue: {
    title: "Vue",
    categorySectionTitle: "Top Vue",
    topicQueryText: "vue",
    visible: true,
  },
  ts: {
    title: "Typescript",
    categorySectionTitle: "Top Typescript",
    topicQueryText: "typescript",
    visible: true,
  },
  js: {
    title: "Javascript",
    categorySectionTitle: "Top Javascript",
    topicQueryText: "javascript",
    visible: true,
  },
  go: {
    title: "Go",
    categorySectionTitle: "Top Go",
    topicQueryText: "go",
    visible: true,
  },
  css: {
    title: "CSS",
    categorySectionTitle: "Top CSS",
    topicQueryText: "css",
    visible: true,
  },
  node: {
    title: "Node",
    categorySectionTitle: "Top Node",
    topicQueryText: "node",
    visible: true,
  },
};

export const SortingConfigurations = {
  stars: {
    title: "Sort by stars",
    sortQueryText: "stars",
  },
  forks: {
    title: "Sort by forks",
    sortQueryText: "forks",
  },
  helpWanted: {
    title: "Sort by help wanted issues",
    sortQueryText: "help-wanted-issues",
  },
  updated: {
    title: "Sort by updated",
    sortQueryText: "updated",
  },
};
