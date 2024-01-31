import { useContext } from "react";
import UserSettingsContext from "../../../contexts/UserSettingsContext";
import { TopicsConfigurations } from "../../../utils/app-configuration";

export const ToggleTopicsSection = () => {
  const { topics: userSettingsTopicsMap, toggleTopic } =
    useContext(UserSettingsContext);

  return (
    <div className="d-flex flex-column p-3">
      <h5>Toggle topics to show</h5>

      <div className="d-flex flex-wrap gap-3">
        {Object.keys(TopicsConfigurations).map((key) => {
          const topicConfiguration = TopicsConfigurations[key];

          if (!topicConfiguration.visible) {
            return null;
          }

          return (
            <div
              key={key}
              className={`badge p-2 ${
                !!userSettingsTopicsMap.get(key)
                  ? "bg-secondary"
                  : "bg-body-secondary text-dark"
              }`}
              onClick={() => toggleTopic(key)}
              style={{ cursor: "pointer" }}
            >
              <span className="p-3">{topicConfiguration.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ToggleTopicsSection;
