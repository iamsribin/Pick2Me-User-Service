import { Coordinates } from '@pick2me/shared/interfaces';

export interface SavedLocation {
  name: string;
  coordinates: Coordinates;
  address: string;
}

interface SavedPlace {
  id?: string;
  name: string;
  coordinates: { lat: number; lng: number };
  address: string;
}
