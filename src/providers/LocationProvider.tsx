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
  coords: { latitude: number; longitude: number } | null;
}>({
  locationsContext: null,
  currentLocation: null,
  refreshLocation: () => {},
  coords: null,
});

export const useLocationContext = () => {
  return useContext(LocationContext);
};

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [locationsContext, setLocationsContext] = useState<any[]>([]);
  const [currentLocation, setCurrentLocation] = useState<any>();
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const getAddressFromCoordinates = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );

      if (!response.ok) throw new Error("Réponse du serveur non valide");

      const data = await response.json();
      if (data.address) {
        const country = data.address.country;
        const region = data.address.state;
        const city = data.address.city || data.address.town || data.address.village;
        const countryCode = data.address.country_code;

        const locationObj = {
          country,
          region,
          city,
          countryCode,
          latitude,
          longitude,
        };

        setCurrentLocation(locationObj);
        setLocationsContext([locationObj]);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'adresse", error);
    }
  };

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // 1. Coords immédiats
          setCoords({ latitude, longitude });

          // 2. Localisation minimale
          const locationObj = {
            latitude,
            longitude,
            city: null,
            region: null,
            country: null,
            countryCode: null,
          };
          setLocationsContext([locationObj]);
          setCurrentLocation(locationObj);

          // 3. Résolution d'adresse en fond
          getAddressFromCoordinates(latitude, longitude);
        },
        (error) => {
          console.log("Erreur de géolocalisation", error);
        }
      );
    } else {
      console.log("La géolocalisation n'est pas supportée");
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const refreshLocation = () => {
    getUserLocation();
  };

  return (
    <LocationContext.Provider
      value={{
        locationsContext,
        currentLocation,
        refreshLocation,
        coords,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
