import { analyticsApi } from '../services/analyticsApi';

const detectDevice = () => {
  if (typeof navigator === 'undefined') return 'desktop';

  const userAgent = navigator.userAgent.toLowerCase();
  const hasTouch = typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1;
  const isTablet = /tablet|ipad|playbook|silk/i.test(userAgent) || (userAgent.includes('macintosh') && hasTouch);
  const isMobile = /mobile|iphone|ipod|android|blackberry|opera mini|iemobile|webos/i.test(userAgent);

  if (isTablet) return 'tablet';
  if (isMobile) return 'mobile';
  return 'desktop';
};

export function trackVisit() {
  if (typeof window === 'undefined') return;

  const sessionKey = 'bpbj_session_tracked';
  if (sessionStorage.getItem(sessionKey)) return;
  sessionStorage.setItem(sessionKey, 'true');

  const returningKey = 'bpbj_is_returning';
  const visitorType = localStorage.getItem(returningKey) ? 'returning' : 'new';
  localStorage.setItem(returningKey, 'true');

  analyticsApi.trackVisit({
    device: detectDevice(),
    visitorType,
  }).catch(() => {
    sessionStorage.removeItem(sessionKey);
  });
}
