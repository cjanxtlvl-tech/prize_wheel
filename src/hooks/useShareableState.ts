import { useEffect, useCallback } from 'react';
import { AppState } from '../types';
import {
  encodeStateToUrl,
  getStateFromQueryParams,
} from '../utils/stateEncoding';

/**
 * Hook to manage shareable URL state
 * Encodes/decodes app state from URL query parameters
 */
export function useShareableState(state: AppState) {
  // Load state from URL on mount
  useEffect(() => {
    const urlState = getStateFromQueryParams();
    if (urlState) {
      // Signal parent component to update state with URL data
      window.dispatchEvent(
        new CustomEvent('loadStateFromUrl', { detail: urlState })
      );
    }
  }, []);

  // Create shareable link
  const createShareLink = useCallback((): string => {
    const encoded = encodeStateToUrl(state);
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?state=${encoded}`;
  }, [state]);

  // Copy share link to clipboard
  const copyShareLink = useCallback(async (): Promise<boolean> => {
    try {
      const link = createShareLink();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(link);
        return true;
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = link;
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        return success;
      }
    } catch (error) {
      console.error('Failed to copy share link:', error);
      return false;
    }
  }, [createShareLink]);

  // Update URL without page reload
  const updateUrl = useCallback((): void => {
    try {
      const link = createShareLink();
      window.history.replaceState({ state }, '', link);
    } catch (error) {
      console.error('Failed to update URL:', error);
    }
  }, [createShareLink]);

  return {
    createShareLink,
    copyShareLink,
    updateUrl,
  };
}
