const normalizeBadgeKey = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[-_\s]+/g, " ");

const normalizeOriginalGoalLabel = (value = "") => {
  const normalizedValue = normalizeBadgeKey(value);

  const goalAliasMap = {
    "worldwide explorer destinations ranking": "World Ranking",
    "best explorer destinations for remote work": "Work From Anywhere",
    "budget friendly explorer destinations": "Increase Your Savings",
    "be with your community": "Find Your Community",
    "advance your career": "Advance Your Career",
  };

  return goalAliasMap[normalizedValue] || value;
};

export const formatAiSearchBadge = (value = "") => {
  const normalizedValue = normalizeBadgeKey(value);

  if (!normalizedValue) return "";

  const strictLabelMap = {
    coworking: "Co-Working",
    "co working": "Co-Working",
    coliving: "Co-Living",
    "co living": "Co-Living",
    meetingroom: "MeetingRooms",
    "meeting room": "MeetingRooms",
  };

  if (strictLabelMap[normalizedValue]) {
    return strictLabelMap[normalizedValue];
  }

  return normalizedValue
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export const dedupeAiSearchBadges = (badges = []) => {
  const seen = new Set();

  return badges
    .map((badge) => formatAiSearchBadge(badge))
    .filter((badge) => {
      if (!badge) return false;

      const badgeKey = normalizeBadgeKey(badge);
      if (seen.has(badgeKey)) return false;

      seen.add(badgeKey);
      return true;
    });
};

export const buildAiSearchBadgesWithLocation = ({
  badges = [],
  selectedStateBadge = "",
}) => {
  const normalizedBadges = dedupeAiSearchBadges(badges);
  const formattedSelectedStateBadge = formatAiSearchBadge(selectedStateBadge);

  if (!formattedSelectedStateBadge) return normalizedBadges;

  const selectedStateKey = normalizeBadgeKey(formattedSelectedStateBadge);
  const badgesWithoutSelectedState = normalizedBadges.filter(
    (badge) => normalizeBadgeKey(badge) !== selectedStateKey,
  );

  return [...badgesWithoutSelectedState, formattedSelectedStateBadge];
};

export const buildAiVerticalsSearchBadges = ({
  locationState = null,
  selectedStateValue = "",
  persistedBadges = [],
}) => {
  const selectedFilters = locationState?.selectedFilters || {};
  const hasAiSearchFilters =
    Boolean(selectedFilters?.goalOption) || Boolean(selectedFilters?.continent);
  const incomingBadges = Array.isArray(locationState?.searchBarBadges)
    ? locationState.searchBarBadges
    : [];

  const selectedContinentBadge = formatAiSearchBadge(selectedFilters.continent);
  const selectedGoalOptionBadge = formatAiSearchBadge(selectedFilters.goalOption);
  const selectedStateLabel =
    locationState?.selectedStateLabel ||
    locationState?.stateLabel ||
    selectedStateValue;
  const selectedStateBadge = formatAiSearchBadge(selectedStateLabel);

  const cleanIncomingBadges = dedupeAiSearchBadges(incomingBadges).filter(
    (badge) => !badge.toLowerCase().startsWith("your broader goal >"),
  );
  const cleanPersistedBadges = dedupeAiSearchBadges(persistedBadges).filter(
    (badge) => !badge.toLowerCase().startsWith("your broader goal >"),
  );

  // Manual/old-school search should keep its original badge order.
  if (!hasAiSearchFilters && cleanIncomingBadges.length > 0) {
    return cleanIncomingBadges;
  }

  const broaderGoalBadgeRaw =
    dedupeAiSearchBadges([...incomingBadges, ...persistedBadges]).find(
      (badge) => badge.toLowerCase().startsWith("your broader goal >"),
    ) || "";
  const broaderGoalBadge = broaderGoalBadgeRaw
    ? broaderGoalBadgeRaw.replace(/^\s*your broader goal\s*>\s*/i, "").trim()
    : "";
  const normalizedBroaderGoalBadge = normalizeOriginalGoalLabel(
    broaderGoalBadge,
  );

  const normalizedIncoming = cleanIncomingBadges.map((badge) =>
    normalizeBadgeKey(badge),
  );

  const orderedBadges = [
    normalizedBroaderGoalBadge,
    selectedContinentBadge,
    selectedGoalOptionBadge,
    selectedStateBadge,
    ...cleanIncomingBadges.filter((badge) => {
      const key = normalizeBadgeKey(badge);
      return (
        key !== normalizeBadgeKey(selectedStateBadge) &&
        key !== normalizeBadgeKey(selectedContinentBadge) &&
        key !== normalizeBadgeKey(selectedGoalOptionBadge)
      );
    }),
  ].filter(Boolean);

  if (orderedBadges.length > 0) {
    return dedupeAiSearchBadges(orderedBadges);
  }

  if (cleanPersistedBadges.length > 0) {
    return cleanPersistedBadges;
  }

  if (normalizedIncoming.length > 0) {
    return cleanIncomingBadges;
  }

  return dedupeAiSearchBadges([
    normalizedBroaderGoalBadge,
    selectedContinentBadge,
    selectedGoalOptionBadge,
    selectedStateBadge,
  ]);
};
