import { PROJECT_TYPE_STYLES, MAX_DISPLAYED_TAGS } from "@/constants/ui";

export const formatProjectType = (isPrivate: boolean): string => {
  return isPrivate ? "Private" : "Public";
};

export const getProjectTypeStyles = (isPrivate: boolean): string => {
  return isPrivate ? PROJECT_TYPE_STYLES.PRIVATE : PROJECT_TYPE_STYLES.PUBLIC;
};

export const truncateTags = (
  tags: string[],
  maxCount: number = MAX_DISPLAYED_TAGS
) => {
  const displayedTags = tags.slice(0, maxCount);
  const remainingCount = tags.length - maxCount;

  return {
    displayed: displayedTags,
    remaining: remainingCount > 0 ? remainingCount : 0,
    hasMore: remainingCount > 0,
  };
};

export const formatActivityCount = (count: number): string => {
  return `${count} events`;
};
