// NOTE as the displayed data data changes most ofen is the counters
// and as their values are formatted (e.g 4.3k)
// So, the counter results that the cards display hardly changes
// so the stale time can be a bit higher
// let's assume 60 minutes for example
export const API_DATA_STALE_TIME = 3600000;

// The max allowed by the API is 100
export const API_ITEMS_PER_PAGE = 30;

// This is the min width for cards (happens for small screens, check Card.scss file)
export const CARD_MIN_WIDTH_PX = 250;
