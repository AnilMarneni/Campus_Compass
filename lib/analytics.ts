/**
 * CampusCompass Analytics Event Trackers
 * 
 * Abstraction layers to integrate third-party event trackers (e.g. Google Analytics, Mixpanel, Plausible)
 * in the future. Currently prints actions in development logs for verification.
 */

export function trackCollegeView(collegeId: string, collegeName: string) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] Track Event: View College (ID: ${collegeId}, Name: "${collegeName}")`);
  }
  
  // Future: window.gtag('event', 'view_college', { college_id: collegeId, college_name: collegeName });
}

export function trackComparison(collegeIds: string[]) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] Track Event: Compare Colleges (IDs: ${collegeIds.join(', ')})`);
  }

  // Future: window.gtag('event', 'compare_colleges', { college_ids: collegeIds });
}

export function trackSaveCollege(collegeId: string, action: 'save' | 'unsave') {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] Track Event: ${action === 'save' ? 'Save Favorite' : 'Unsave Favorite'} (ID: ${collegeId})`);
  }

  // Future: window.gtag('event', 'saved_college_toggle', { college_id: collegeId, save_action: action });
}
