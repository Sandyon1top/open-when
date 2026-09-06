// Helpers for managing a saved contacts list in localStorage
export const loadContacts = () => {
  try {
    const data = localStorage.getItem('ow_contacts');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveContact = (name) => {
  if (!name || !name.trim()) return;
  const contacts = loadContacts();
  const trimmed = name.trim();
  if (!contacts.includes(trimmed)) {
    contacts.push(trimmed);
    localStorage.setItem('ow_contacts', JSON.stringify(contacts));
  }
};

export const deleteContact = (name) => {
  const contacts = loadContacts().filter((c) => c !== name);
  localStorage.setItem('ow_contacts', JSON.stringify(contacts));
};
