import { useState, useEffect } from 'react';

interface Location {
    lat: number;
    lng: number;
}

function getDistance(loc1: Location, loc2: Location) {
    const R = 6371e3; // metres
    const φ1 = loc1.lat * Math.PI / 180;
    const φ2 = loc2.lat * Math.PI / 180;
    const Δφ = (loc2.lat - loc1.lat) * Math.PI / 180;
    const Δλ = (loc2.lng - loc1.lng) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

interface UseLocationReturn {
    location: Location | null;
    error: string | null;
    isLoading: boolean;
    retry: () => void;
    setLocation: (location: Location | null) => void;
}

export function useLocation(): UseLocationReturn {
    const [location, setLocation] = useState<Location | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getLocation = () => {
        setIsLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newLoc = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                setLocation(prev => {
                    if (!prev) return newLoc;
                    const dist = getDistance(prev, newLoc);
                    // Only update if moved more than 5 meters
                    return dist > 5 ? newLoc : prev;
                });
                setIsLoading(false);
            },
            (err) => {
                setError(err.message);
                setIsLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const newLoc = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                setLocation(prev => {
                    if (!prev) return newLoc;
                    const dist = getDistance(prev, newLoc);
                    // Only update if moved more than 5 meters
                    return dist > 5 ? newLoc : prev;
                });
                setIsLoading(false);
            },
            (err) => {
                setError(err.message);
                setIsLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    };

    useEffect(() => {
        const cleanup = getLocation();
        return cleanup;
    }, []);

    return { location, error, isLoading, retry: getLocation, setLocation };
}
