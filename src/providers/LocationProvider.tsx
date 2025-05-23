import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
  } from "react";
 /*  import { useAuthContext } from "./AuthProvider"; */
  /* const getFirestore = () => import("@/firebase/firestore");
   */
  export const LocationContext = createContext<{
    locationsContext: any | null;
    currentLocation: any | null;
    //addToLocationContext: () => void;
  }>({
    locationsContext: null,
    currentLocation: null,
    //addToLocationContext: (...params) => void 0,
  });
  
  export const useLocationContext = () => {
    const locationContext = useContext(LocationContext);
    return locationContext;
  };
  
  export const LocationProvider = ({ children }: { children: ReactNode }) => {
    const [locationsContext, setLocationsContext] = useState<any[]>([]);
    const [currentLocation, setCurrentLocation] = useState<any>();
  /*   const { user } = useAuthContext();
   */
    const getCoordinatesFromAddress = async (address: string) => {
      try {
        const encodedAddress = encodeURIComponent(address);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`
        );
  
        if (!response.ok) {
          throw new Error("Réponse du serveur non valide");
        }
  
        const data = await response.json();
        if (data && data.length > 0) {
          const latitude = data[0].lat;
          const longitude = data[0].lon;
  
          return {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
          };
        }
      } catch (error) {
        console.error("Error while retrieving data", error);
        return null;
      }
    };
  
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
          setCurrentLocation({
            country: country,
            region: region,
            city: city,
            countryCode: countryCode,
          });
          setLocationsContext([
            {
              country: country,
              region: region,
              city: city,
              countryCode: countryCode,
            },
          ]);
        }
      } catch (error) {
        console.error("Error while retrieving data", error);
      }
    };
  
    useEffect(() => {
      const getUserLocation = async () => {
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
  
      getUserLocation();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
 /*  
    async function addToLocationContext() {
      const newLocations =
        !user.accountDetails.locations ||
        user.accountDetails.locations === undefined
          ? []
          : user.accountDetails.locations.filter(
              (location: any) =>
                location.city !== currentLocation.city &&
                location.region !== currentLocation.region &&
                location.country !== currentLocation.country
            );
      setLocationsContext([]);
      setLocationsContext([currentLocation, ...newLocations]);
      try {
        const { doc, updateDoc, db } = await getFirestore();
        const userDetailsDocRef = doc(db, "userdetails", user.accountDetailsId);
        await updateDoc(userDetailsDocRef, {
          locations: [currentLocation, ...newLocations],
        });
      } catch (error) {
        console.error("Error update userDetails: ", error);
      } 
    }
    useEffect(() => {
      if (
        user !== undefined &&
        user &&
        currentLocation &&
        currentLocation !== undefined &&
        locationsContext.length > 0
      ) {
        if (user?.accountDetailsId) {
          addToLocationContext();
        }
      }
      
    }, [user, currentLocation]);
   */
    return (
      <LocationContext.Provider
        value={{
          locationsContext,
          currentLocation,
          //addToLocationContext: addToLocationContext,
        }}
      >
        {children}
      </LocationContext.Provider>
    );
  };
  