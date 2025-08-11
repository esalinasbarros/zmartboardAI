import { useState, useEffect, useCallback } from 'react';
import { usersApi } from '../services/users.api';
import type { UserSearchResponse } from '../services/users.api';

interface UseUserSearchReturn {
  searchResults: UserSearchResponse | null;
  isSearching: boolean;
  searchError: string | null;
  search: (query: string) => void;
  clearResults: () => void;
}

export const useUserSearch = (debounceMs: number = 300): UseUserSearchReturn => {
  const [searchResults, setSearchResults] = useState<UserSearchResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Debounced search effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      setSearchError(null);
      return;
    }
    
    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);

      try {
        if (searchQuery.length > 3) {
          const results = await usersApi.searchUsers(searchQuery);
          setSearchResults(results);
        }
      } catch (error) {
        setSearchError(error instanceof Error ? error.message : 'Error al buscar usuarios');
        setSearchResults(null);
      } finally {
        setIsSearching(false);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, debounceMs]);

  const search = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const clearResults = useCallback(() => {
    setSearchResults(null);
    setSearchError(null);
    setSearchQuery('');
  }, []);

  return {
    searchResults,
    isSearching,
    searchError,
    search,
    clearResults,
  };
};