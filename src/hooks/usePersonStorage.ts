import { useState, useEffect, useCallback } from 'react';

export interface Person {
  id: string;
  name: string;
  chatURL: string | null;
  chatDate: string | null;
}

export interface PersonState {
  persons: { [key: string]: Person };
  activePersonId: string;
}

const STORAGE_KEY = 'msproject_persons';
const ACTIVE_PERSON_KEY = 'msproject_active_person_id';

export function usePersonStorage() {
  const [state, setState] = useState<PersonState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const activeId = localStorage.getItem(ACTIVE_PERSON_KEY) || 'ben';
    
    let persons: { [key: string]: Person } = {};
    if (saved) {
      try {
        persons = JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing persons', e);
      }
    }

    if (Object.keys(persons).length === 0) {
      persons['ben'] = { id: 'ben', name: 'Ben', chatURL: null, chatDate: null };
    }

    return { persons, activePersonId: activeId in persons ? activeId : Object.keys(persons)[0] };
  });

  const saveToStorage = useCallback((newState: PersonState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState.persons));
    localStorage.setItem(ACTIVE_PERSON_KEY, newState.activePersonId);
    setState(newState);
  }, []);

  const switchPerson = (id: string) => {
    if (state.persons[id]) {
      saveToStorage({ ...state, activePersonId: id });
    }
  };

  const addPerson = (name: string) => {
    const trMap: { [key: string]: string } = {
      'ğ': 'g', 'ü': 'u', 'ş': 's', 'ı': 'i', 'ö': 'o', 'ç': 'c',
      'Ğ': 'g', 'Ü': 'u', 'Ş': 's', 'İ': 'i', 'Ö': 'o', 'Ç': 'c'
    };
    const id = name.toLowerCase().trim()
      .replace(/[ğüşıöçĞÜŞİÖÇ]/g, (c) => trMap[c] || c)
      .replace(/\s+/g, '_');
    
    if (state.persons[id]) return false;

    const newPersons = { 
      ...state.persons, 
      [id]: { id, name, chatURL: null, chatDate: null } 
    };
    saveToStorage({ persons: newPersons, activePersonId: id });
    return true;
  };

  const deletePerson = (id: string) => {
    if (Object.keys(state.persons).length <= 1) return false;
    
    const newPersons = { ...state.persons };
    delete newPersons[id];
    
    let nextActiveId = state.activePersonId;
    if (id === state.activePersonId) {
      nextActiveId = Object.keys(newPersons)[0];
    }
    
    saveToStorage({ persons: newPersons, activePersonId: nextActiveId });
    return true;
  };

  const savePersonChatURL = (url: string) => {
    const activePerson = state.persons[state.activePersonId];
    if (!activePerson) return false;

    const updatedPerson = {
      ...activePerson,
      chatURL: url,
      chatDate: new Date().toISOString()
    };

    const newPersons = {
      ...state.persons,
      [state.activePersonId]: updatedPerson
    };

    saveToStorage({ ...state, persons: newPersons });
    return true;
  };

  const activePerson = state.persons[state.activePersonId];

  return {
    persons: Object.values(state.persons),
    activePerson,
    switchPerson,
    addPerson,
    deletePerson,
    savePersonChatURL
  };
}
