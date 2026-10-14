import { useEffect, useState } from 'react';
import { DEFAULT_ROOMS, ROOMS_SETTING_KEY } from '../data/roomsDefaults';

const API_URL = import.meta.env.VITE_API_URL;

export const loadRooms = async () => {
    try {
        const r = await fetch(`${API_URL}/api/app-settings/${ROOMS_SETTING_KEY}`);
        if (!r.ok) return DEFAULT_ROOMS;
        const { value } = await r.json();
        return value ? JSON.parse(value) : DEFAULT_ROOMS;
    } catch {
        return DEFAULT_ROOMS;
    }
};

export const useRooms = () => {
    const [rooms, setRooms] = useState(null);
    useEffect(() => { loadRooms().then(setRooms); }, []);
    return rooms;
};
