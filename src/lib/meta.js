// Display names and colours for the project a role belongs to.
export const PROJECT_META = {
  polycode: { name: 'PolyCode', accent: '#FACC15' },
  'digital-logics-studio': { name: 'Digital Logics Studio', accent: '#8B7CF6' },
  'calculus-runtime': { name: 'Calculus Runtime', accent: '#38BDF8' },
  foundation: { name: 'Across the foundation', accent: '#F472B6' },
};

export const projectMeta = (slug) => PROJECT_META[slug] || PROJECT_META.foundation;

export const hostOf = (url) => {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
};
