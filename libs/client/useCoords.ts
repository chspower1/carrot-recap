import { useEffect, useState } from "react";

interface Coords {
  latitude: number | null;
  longitude: number | null;
}

export default function useCoords() {
  const [coords, setCoords] = useState<Coords>({ latitude: null, longitude: null });
  const onSuccess = ({ coords: { latitude, longitude } }: GeolocationPosition) => {
    console.log({ latitude, longitude });
    setCoords({ latitude, longitude });
  };
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(onSuccess);
  }, []);
  return coords;
}
