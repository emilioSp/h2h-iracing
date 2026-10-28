// Defines dashboard identifiers when routers and broadcasting select an overlay.
export const dashboardType = {
  H2H: 'H2H',
  WEATHER: 'WEATHER',
  CAR: 'CAR',
  FUEL: 'FUEL',
  SPOTTER: 'SPOTTER',
  TRAFFIC: 'TRAFFIC',
} as const;

export type DashboardType = (typeof dashboardType)[keyof typeof dashboardType];
