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
  const locationContext = useContext(LocationContext);
  return locationContext;
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
          setCoords({ latitude, longitude }); // disponible instantanément pour la carte
          getAddressFromCoordinates(latitude, longitude); // résolution de l'adresse en parallèle
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error("La géolocalisation n'est pas supportée");
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
