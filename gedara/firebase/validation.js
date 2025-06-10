export const validateFields = (fields) => {
  for (const [name, value] of Object.entries(fields)) {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `${name} is required.`;
    }

    if (typeof value === 'string' && value.includes('/')) {
      return `${name} cannot contain "/" character.`;
    }
  }

  return null;
};
