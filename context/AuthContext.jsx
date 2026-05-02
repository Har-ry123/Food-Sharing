import { createContext } from 'react';

export const AuthContext = createContext({
  user: null,
  login: () => {},
  register: () => {},
  logout: () => {},
  socket: null,
  foodItems: [],
  setFoodItems: () => {},
  stats: {},
  fetchStats: () => {}
}); 