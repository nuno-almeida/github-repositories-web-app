import Bookmark from "./Bookmark";
import "./Card.scss";
import GithubIcons from "./GithubIcons";
import { formatCounterDisplayValue } from "./helpers";
import useViewport from "../../../hooks/useViewport";
import useQueryRepository from "../../../hooks/useQueryRepository";

const FullName = ({ text = "" }) => {
  const index = text.indexOf("/");

  if (index > -1) {
    return (
      <h6 className="text-title">
        {text.substring(0, index + 1)}
        <strong>{text.substring(index + 1)}</strong>
      </h6>
    );
  }

  return <h6 className="text-title">{text}</h6>;
};

const Counters = ({ value, label, name }) => {
  if (!value && value !== 0) {
    return null;
  }

  return (
    <div className="d-flex gap-1">
      <div style={{ marginTop: "-4px" }}>
        <GithubIcons name={name} />
      </div>
      <div className="d-flex flex-column">
        <div className="small counters-value">
          {formatCounterDisplayValue(value)}
        </div>
        <div className="small counters-label">{label}</div>
      </div>
    </div>
  );
};

const getCountersGap = ({ isSmall, isMedium }) =>
  isSmall ? "gap-1" : isMedium ? "gap-2" : "gap-3";

const Card = ({ item, styles, idPrefix = "" }) => {
  const {
    id,
    full_name,
    description,
    html_url,
    owner,
    stargazers_count,
    forks_count,
  } = item;

  const avatar_url = owner?.avatar_url;

  const { isSmall, isMedium } = useViewport();

  // Get additional data of the repo
  // Only called here, in order to make the HTTP request for the repos being rendered
  // Otherwise is not necessary to call this
  const { data } = useQueryRepository({ id });
  const subscribers_count = data?.subscribers_count;

  const clickCardHandler = () => window.open(html_url);

  return (
    <div
      className="card p-4 zoom card-width"
      style={{ ...styles }}
      onClick={clickCardHandler}
      id={idPrefix + "_" + id}
    >
      <div className="d-flex flex-column h-100 justify-content-between">
        <div className="d-flex justify-content-between">
          <div className="d-flex flex-column" style={{ width: "85%" }}>
            <FullName text={full_name} />
            <p className="small text-description">{description}</p>
          </div>
          <div className="pt-4">
            {!!avatar_url && (
              <img
                className="avatar"
                loading="lazy"
                src={avatar_url}
                alt={full_name}
              />
            )}
          </div>
          <Bookmark
            item={item}
            styles={{
              position: "absolute",
              right: 12,
              top: 12,
              zIndex: 10,
            }}
          />
        </div>
        <div className={`d-flex pt-1 ${getCountersGap({ isSmall, isMedium })}`}>
          <Counters
            value={subscribers_count}
            label="watching"
            name={"watchers"}
          />
          <Counters value={stargazers_count} label="stars" name={"stars"} />
          <Counters value={forks_count} label="forks" name={"forks"} />
        </div>
      </div>
    </div>
  );
};

export default Card;
