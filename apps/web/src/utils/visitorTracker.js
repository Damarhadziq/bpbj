export function trackVisit() {
  if (typeof window === 'undefined') return;

  // 1. Check if session is already tracked (per-tab/browser session)
  const isSessionTracked = sessionStorage.getItem('bpbj_session_tracked');
  if (isSessionTracked) return;

  // 2. Mark this session as tracked
  sessionStorage.setItem('bpbj_session_tracked', 'true');

  // 3. Initialize localStorage values if they don't exist
  if (!localStorage.getItem('bpbj_total_visitors')) {
    localStorage.setItem('bpbj_total_visitors', '1248');
    localStorage.setItem('bpbj_visitor_devices', JSON.stringify({ desktop: 812, mobile: 345, tablet: 91 }));
    localStorage.setItem('bpbj_visitor_types', JSON.stringify({ new: 980, returning: 268 }));
  }

  // 4. Increment unique visitor count
  const currentTotal = parseInt(localStorage.getItem('bpbj_total_visitors'), 10);
  const newTotal = currentTotal + 1;
  localStorage.setItem('bpbj_total_visitors', newTotal.toString());

  // 5. Track device type distribution
  const userAgent = navigator.userAgent.toLowerCase();
  let deviceType = 'desktop'; // default

  if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    deviceType = 'tablet';
  } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile|webos/i.test(userAgent)) {
    deviceType = 'mobile';
  }

  const currentDevices = JSON.parse(localStorage.getItem('bpbj_visitor_devices'));
  currentDevices[deviceType] = (currentDevices[deviceType] || 0) + 1;
  localStorage.setItem('bpbj_visitor_devices', JSON.stringify(currentDevices));
  
  // 6. Track visitor type (New vs Returning)
  const isReturning = localStorage.getItem('bpbj_is_returning');
  const currentTypes = JSON.parse(localStorage.getItem('bpbj_visitor_types'));

  if (isReturning) {
    currentTypes.returning += 1;
  } else {
    currentTypes.new += 1;
    localStorage.setItem('bpbj_is_returning', 'true');
  }
  localStorage.setItem('bpbj_visitor_types', JSON.stringify(currentTypes));
}

export function getVisitorData() {
  if (typeof window === 'undefined') {
    return {
      total: 1248,
      devices: { desktop: 812, mobile: 345, tablet: 91 },
      types: { new: 980, returning: 268 }
    };
  }

  // Make sure keys are initialized if they don't exist
  if (!localStorage.getItem('bpbj_total_visitors')) {
    localStorage.setItem('bpbj_total_visitors', '1248');
    localStorage.setItem('bpbj_visitor_devices', JSON.stringify({ desktop: 812, mobile: 345, tablet: 91 }));
    localStorage.setItem('bpbj_visitor_types', JSON.stringify({ new: 980, returning: 268 }));
  }

  return {
    total: parseInt(localStorage.getItem('bpbj_total_visitors') || '1248', 10),
    devices: JSON.parse(localStorage.getItem('bpbj_visitor_devices') || '{"desktop": 812, "mobile": 345, "tablet": 91}'),
    types: JSON.parse(localStorage.getItem('bpbj_visitor_types') || '{"new": 980, "returning": 268}')
  };
}
