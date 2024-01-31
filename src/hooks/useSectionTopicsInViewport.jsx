import { useEffect, useState } from "react";

// This hook is responsible to validate if a topic section is inside the viewport
// In case yes, then marks that section to render
// Otherwise marks it as false
// This allows only to render the content of a section inside the viewport
//    avoiding to call the endpoint to fecth repositories for a topic in case that secton topic is not going to be visible
const useSectionTopicsInViewport = ({ sectionTopicIds }) => {
  const [sectionsInViewportMap, setSectionInViewportMap] = useState(
    sectionTopicIds.reduce(
      (map, sectionTopicId) => ({ ...map, [sectionTopicId]: false }),
      {}
    )
  );

  useEffect(() => {
    // when the topic section enters 10% of the viewport
    // intersection observer API returns isIntersecting true for that target element
    const options = {
      root: null,
      threshold: 0.1,
    };

    const callback = (entries, observer) => {
      Array.from(entries).forEach((entry) => {
        if (entry.isIntersecting) {
          // after the element is set as in viewport
          // in case it leave viewport and later return
          // it does not matter any more as the data for that topic was fetched already
          if (!sectionsInViewportMap[entry.target.id]) {
            setSectionInViewportMap((map) => ({
              ...map,
              [entry.target.id]: true,
            }));
            observer.unobserve(entry.target);
          }
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);
    // observe only the element not marked as in viewport in the state map
    sectionTopicIds.forEach(
      (sectionTopicId) =>
        !sectionsInViewportMap[sectionTopicId] &&
        observer.observe(document.getElementById(sectionTopicId))
    );

    return () => observer.disconnect();
  }, [sectionTopicIds, sectionsInViewportMap]);

  return Object.entries(sectionsInViewportMap)
    .filter((entry) => entry[1])
    .map((entry) => entry[0]);
};

export default useSectionTopicsInViewport;
