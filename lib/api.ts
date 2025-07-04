// API utility functions for interacting with the Django backend

const API_URL = 'http://localhost:12001/api';

// Function to handle API errors
const handleApiError = (error: any) => {
  console.error('API Error:', error);
  throw error;
};

// Generic fetch function with authentication
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  // Get token from localStorage (in a real app, you'd use a more secure method)
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Token ${token}` } : {}),
    ...options.headers,
  };
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

// Authentication functions
export const loginUser = async (username: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}-token-auth/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Login failed');
    }
    
    const data = await response.json();
    
    // Store token in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', data.token);
    }
    
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const logoutUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
};

// Trading strategy functions
export const getStrategies = () => {
  return fetchWithAuth(`${API_URL}/strategies/`);
};

export const createStrategy = (strategyData: any) => {
  return fetchWithAuth(`${API_URL}/strategies/`, {
    method: 'POST',
    body: JSON.stringify(strategyData),
  });
};

export const updateStrategy = (id: string, strategyData: any) => {
  return fetchWithAuth(`${API_URL}/strategies/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(strategyData),
  });
};

export const deleteStrategy = (id: string) => {
  return fetchWithAuth(`${API_URL}/strategies/${id}/`, {
    method: 'DELETE',
  });
};

// Exchange functions
export const getExchanges = () => {
  return fetchWithAuth(`${API_URL}/exchanges/`);
};

export const createExchange = (exchangeData: any) => {
  return fetchWithAuth(`${API_URL}/exchanges/`, {
    method: 'POST',
    body: JSON.stringify(exchangeData),
  });
};

// Trade functions
export const getTrades = () => {
  return fetchWithAuth(`${API_URL}/trades/`);
};

export const executeTrade = (tradeData: any) => {
  return fetchWithAuth(`${API_URL}/trade/execute/`, {
    method: 'POST',
    body: JSON.stringify(tradeData),
  });
};

// Market data functions
export const getMarketData = (params: { exchange?: string, symbol?: string, data_type?: string } = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.exchange) queryParams.append('exchange', params.exchange);
  if (params.symbol) queryParams.append('symbol', params.symbol);
  if (params.data_type) queryParams.append('data_type', params.data_type);
  
  const queryString = queryParams.toString();
  
  return fetchWithAuth(`${API_URL}/market/simulated/?${queryString}`);
};

// Portfolio functions
export const getPortfolio = () => {
  return fetchWithAuth(`${API_URL}/portfolio/`);
};

// WebSocket connection for real-time data
export const createTradingSocket = (roomName: string = 'default') => {
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${wsProtocol}//${window.location.hostname}:12001/ws/trading/${roomName}/`;
  
  const socket = new WebSocket(wsUrl);
  
  socket.onopen = () => {
    console.log('WebSocket connection established');
    
    // Subscribe to market data
    socket.send(JSON.stringify({
      type: 'subscribe',
      symbol: 'BTC/USDT',
    }));
  };
  
  socket.onclose = (event) => {
    console.log('WebSocket connection closed', event);
  };
  
  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  return socket;
};