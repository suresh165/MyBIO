// ==========================================
// VISITOR TRACKING - IP & LOCATION
// ==========================================

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw-ypatVBz4qp_YOwzMwXnSKYkpg1zBBiyMKoG3x_6ELReGaHA5QZcOiApOMKqUnn2S/exec';

// Multiple IP/location API providers (fallback chain)
const IP_APIS = [
  {
    name: 'ipapi.co',
    url: 'https://ipapi.co/json/',
    parser: (data) => ({
      ip: data.ip,
      city: data.city,
      region: data.region,
      country: data.country_name,
      countryCode: data.country_code,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
      isp: data.org,
    })
  },
  {
    name: 'ip-api.com',
    url: 'http://ip-api.com/json/',
    parser: (data) => ({
      ip: data.query,
      city: data.city,
      region: data.regionName,
      country: data.country,
      countryCode: data.countryCode,
      latitude: data.lat,
      longitude: data.lon,
      timezone: data.timezone,
      isp: data.isp,
    })
  },
  {
    name: 'ipify + ipwhois',
    url: 'https://api.ipify.org?format=json',
    secondaryUrl: (ip) => `https://ipwhois.app/json/${ip}`,
    parser: async (data) => {
      const ip = data.ip;
      const geoResponse = await fetch(`https://ipwhois.app/json/${ip}`);
      const geoData = await geoResponse.json();
      return {
        ip: geoData.ip,
        city: geoData.city,
        region: geoData.region,
        country: geoData.country,
        countryCode: geoData.country_code,
        latitude: geoData.latitude,
        longitude: geoData.longitude,
        timezone: geoData.timezone,
        isp: geoData.isp,
      };
    }
  },
  {
    name: 'cloudflare-trace',
    url: 'https://www.cloudflare.com/cdn-cgi/trace',
    parser: (text) => {
      const lines = text.split('\n');
      const data = {};
      lines.forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) data[key.trim()] = value.trim();
      });
      return {
        ip: data.ip,
        city: 'Unknown',
        region: 'Unknown',
        country: 'Unknown',
        countryCode: data.loc || 'Unknown',
        latitude: 'Unknown',
        longitude: 'Unknown',
        timezone: 'Unknown',
        isp: 'Unknown',
      };
    },
    isText: true
  }
];

// Fetch with timeout
async function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Try multiple IP APIs with fallback
async function getLocationData() {
  for (const api of IP_APIS) {
    try {
      const response = await fetchWithTimeout(api.url, {}, 5000);
      
      if (!response.ok) {
        console.warn(`${api.name} returned ${response.status}`);
        continue;
      }
      
      let data;
      if (api.isText) {
        data = await response.text();
      } else {
        data = await response.json();
      }
      
      const parsed = await api.parser(data);
      return parsed;
      
    } catch (error) {
      console.warn(`${api.name} failed:`, error.message);
      continue;
    }
  }
  
  // If all APIs fail, return basic data
  console.warn('All IP APIs failed, using fallback data');
  return {
    ip: 'Unknown',
    city: 'Unknown',
    region: 'Unknown',
    country: 'Unknown',
    countryCode: 'Unknown',
    latitude: 'Unknown',
    longitude: 'Unknown',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown',
    isp: 'Unknown',
  };
}

// Track visitor
async function trackVisitor() {
  try {
    // Get location data with fallbacks
    const locationData = await getLocationData();
    
    // Prepare visitor data
    const visitorData = {
      origin: window.location.origin,
      timestamp: new Date().toISOString(),
      ip: locationData.ip || 'Unknown',
      city: locationData.city || 'Unknown',
      region: locationData.region || 'Unknown',
      country: locationData.country || 'Unknown',
      countryCode: locationData.countryCode || 'Unknown',
      latitude: locationData.latitude || 'Unknown',
      longitude: locationData.longitude || 'Unknown',
      timezone: locationData.timezone || 'Unknown',
      isp: locationData.isp || 'Unknown',
      userAgent: navigator.userAgent,
      language: navigator.language || 'Unknown',
      screenResolution: `${screen.width}x${screen.height}`,
      referrer: document.referrer || 'Direct',
      pageUrl: window.location.href
    };
    
    // Send to Google Sheets
    await sendToGoogleSheets(visitorData);
  } catch (error) {
    console.error('✗ Error tracking visitor:', error);
  }
}

// Send data to Google Sheets
async function sendToGoogleSheets(data) {
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    return true;
  } catch (error) {
    console.error('Error sending to Google Sheets:', error);
    return false;
  }
}

// ==========================================
// CONTACT FORM SUBMISSION
// ==========================================

// Submit contact form data to Google Sheets
async function submitContactForm(formData) {
  try {
    // Get IP address (optional, for tracking purposes)
    let ip = 'Unknown';
    try {
      const ipResponse = await fetchWithTimeout('https://api.ipify.org?format=json', {}, 3000);
      if (ipResponse.ok) {
        const ipData = await ipResponse.json();
        ip = ipData.ip;
      }
    } catch (error) {
      console.warn('Could not fetch IP:', error.message);
    }

    // Prepare contact form data
    const contactData = {
      origin: window.location.origin,
      type: 'contact', // Identifier for the Google Apps Script
      timestamp: new Date().toISOString(),
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      ip: ip,
      userAgent: navigator.userAgent,
      pageUrl: window.location.href
    };

    // Send to Google Sheets
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData)
    });

    return true;
  } catch (error) {
    console.error('✗ Error submitting contact form:', error);
    return false;
  }
}

// Make function available globally
window.submitContactForm = submitContactForm;

// Track on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(trackVisitor, 1000);
  });
} else {
  setTimeout(trackVisitor, 1000);
}