import { useContext, useState } from "react";
import {
  SortingConfigurations,
  TopicsConfigurations,
} from "../../../utils/app-configuration";
import RepositoriesList from "./RepositoriesList";
import UserSettingsContext from "../../../contexts/UserSettingsContext";
import AlertDialog from "../../utils/AlertDialog";
import useQueryRepositories from "../../../hooks/useQueryRepositories";
import { CarrouselPaginationProvider } from "../../../contexts/CarrouselPaginationContext";
import useSectionTopicsInViewport from "../../../hooks/useSectionTopicsInViewport";

const TopicHeader = ({ title, options = [] }) => (
  <div style={{ marginBottom: "-0.5em" }}>
    <div className="btn-group">
      <button className="btn" type="button" style={{ borderStyle: "none" }}>
        <h4 className="m-0">{title}</h4>
      </button>
      <button
        type="button"
        className="btn dropdown-toggle dropdown-toggle-split"
        data-bs-toggle="dropdown"
        style={{ borderStyle: "none" }}
      ></button>

      <ul className="dropdown-menu p-0">
        {options.map((option) => (
          <button
            className={`dropdown-item ${
              option.selected ? "bg-body-secondary" : ""
            }`}
            onClick={option.click}
            key={option.id}
          >
            {option.title}
          </button>
        ))}
      </ul>
    </div>
  </div>
);

const getDropdownOptions = ({ selectedSortById, clickHandler }) => {
  const options = [];

  for (const sortingConfigId of Object.keys(SortingConfigurations)) {
    const option = {
      id: sortingConfigId,
      selected: sortingConfigId === selectedSortById,
      title: SortingConfigurations[sortingConfigId].title,
      click: () =>
        clickHandler(
          sortingConfigId,
          SortingConfigurations[sortingConfigId].sortQueryText
        ),
    };

    options.push(option);
  }

  return options;
};

const TopicContent = ({ id, topicQueryText, title, selectedSortById = "" }) => {
  const { setTopicSortBy } = useContext(UserSettingsContext);
  const [sortQueryText, setSortQueryText] = useState(
    SortingConfigurations[selectedSortById]?.sortQueryText
  );

  const { items, loading, errorMessage } = useQueryRepositories({
    topicQueryText,
    sortQueryText,
  });

  return (
    <RepositoriesList
      id={id + "_" + selectedSortById}
      header={
        <TopicHeader
          title={title}
          options={getDropdownOptions({
            selectedSortById,
            clickHandler: (sortById, sortByText) => {
              let newSortByText = sortByText;
              let newSortById = sortById;

              // in case clicked the selected sort, sorting is not applied
              if (sortById === selectedSortById) {
                newSortByText = "";
                newSortById = "";
              }

              setSortQueryText(newSortByText);
              setTopicSortBy({ topicId: id, sortBy: newSortById });
            },
          })}
        />
      }
      items={items}
      errorMessage={errorMessage}
      loading={loading}
      emptyMessage={`No ${title} repositories to display`}
    />
  );
};

const SelectedTopicsSection = () => {
  const { topics: userSettingsTopicsMap } = useContext(UserSettingsContext);
  const selectedTopicsIds = Array.from(userSettingsTopicsMap.keys());

  const sectionTopicsToRender = useSectionTopicsInViewport({
    sectionTopicIds: selectedTopicsIds.map((topicId) => topicId + "_section"),
  });

  if (selectedTopicsIds.length === 0) {
    return (
      <div className="mx-3">
        <AlertDialog type="dark" message={"No topics selected"} />
      </div>
    );
  }

  return selectedTopicsIds.map((topicId) => {
    const topicConfiguration = TopicsConfigurations[topicId];
    const { categorySectionTitle, topicQueryText } = topicConfiguration;
    const selectedSortById = userSettingsTopicsMap.get(topicId).sortBy || "";

    const sectionTopicId = topicId + "_section";

    return (
      <CarrouselPaginationProvider key={topicId + "_" + selectedSortById}>
        <div id={sectionTopicId} style={{ minHeight: "200px" }}>
          {sectionTopicsToRender.includes(sectionTopicId) && (
            <TopicContent
              id={topicId}
              topicQueryText={topicQueryText}
              title={categorySectionTitle}
              selectedSortById={selectedSortById}
            />
          )}
        </div>
      </CarrouselPaginationProvider>
    );
  });
};

export default SelectedTopicsSection;
