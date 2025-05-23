import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export const LocationContext = createContext<{
  locationsContext: any[] | null;
  currentLocation: any | null;
  refreshLocation: () => void;
}>({
  locationsContext: null,
  currentLocation: null,
  refreshLocation: () => {},
});

export const useLocationContext = () => {
  const locationContext = useContext(LocationContext);
  return locationContext;
};

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [locationsContext, setLocationsContext] = useState<any[]>([]);
  const [currentLocation, setCurrentLocation] = useState<any>();

  const getAddressFromCoordinates = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );

      if (!response.ok) {
        throw new Error("Réponse du serveur non valide");
      }

      const data = await response.json();
      if (data.address) {
        const country = data.address.country;
        const region = data.address.state;
        const city = data.address.city;
        const countryCode = data.address.country_code;

        const locationObj = { country, region, city, countryCode, latitude, longitude };

        setCurrentLocation(locationObj);
        setLocationsContext([locationObj]);
      }
    } catch (error) {
      console.error("Error while retrieving data", error);
    }
  };

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getAddressFromCoordinates(latitude, longitude);
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error("Geolocation is not supported");
    }
  };

  // Initial load
  useEffect(() => {
    getUserLocation();
  }, []);

  // Fonction exposée pour rafraîchir la localisation
  const refreshLocation = () => {
    getUserLocation();
  };

  return (
    <LocationContext.Provider
      value={{
        locationsContext,
        currentLocation,
        refreshLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
