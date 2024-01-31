import { API_ITEMS_PER_PAGE } from "../utils/constants";
import { parseLinkHeader } from "@web3-storage/parse-link-header";

const TOKEN = import.meta.env.VITE_REPOSITORIES_API_TOKEN;

export const fetchRespositoryById = async (id) => {
  const response = await fetch("https://api.github.com/repositories/" + id, {
    headers: {
      ...(!!TOKEN && { Authorization: `Bearer ${TOKEN}` }),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to retrieve repository " + id);
  }

  return response.json();
};

export const fetchRespositoriesByIds = async (ids) => {
  const repos = await Promise.all(ids.map((id) => fetchRespositoryById(id)));

  const map = new Map();

  for (const repo of repos) {
    map.set(repo.id, repo);
  }

  return map;
};

export const fetchRespositories = async ({
  topic,
  sort,
  page,
  per_page = API_ITEMS_PER_PAGE,
}) => {
  const response = await fetch(buildGetQuery({ topic, sort, page, per_page }), {
    headers: {
      ...(!!TOKEN && { Authorization: `Bearer ${TOKEN}` }),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to retrieve repositories");
  }

  let totalPagesCount = 1;

  const linkHeader = response.headers.get("Link");
  if (!!linkHeader) {
    const link = parseLinkHeader(linkHeader);
    const lastPage = link?.last?.page;
    if (!!lastPage) {
      totalPagesCount = lastPage;
    }
  }

  const data = await response.json();
  const { items } = data;

  return { items, page, totalPagesCount };
};

const buildGetQuery = ({ topic, sort, page, per_page }) =>
  `https://api.github.com/search/repositories?q=topic:${topic}&page=${page}&per_page=${per_page}${
    !!sort ? "&sort=" + sort : ""
  }`;
