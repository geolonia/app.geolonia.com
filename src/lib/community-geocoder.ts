export type CommunityGeocodeResult = {
  addr: string;
  city: string;
  lat: number;
  lng: number;
  level: 0 | 1 | 2 | 3,
  pref: string;
  town: string;
};

export const geocode = async (address: string): Promise<CommunityGeocodeResult> => {
  return new Promise((resolve, reject) => {
    try {
    // @ts-ignore
      window.getLatLng(
        address,
        (latlng: CommunityGeocodeResult) => resolve(latlng),
        (error: Error) => reject(error),
      );
    } catch (error) {
      reject(error);
    }
  });
};
