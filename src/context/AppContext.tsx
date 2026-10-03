import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DOCTORS, Doctor } from '../data/doctors';

export interface BookedAppointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorRating: number;
  doctorReviews: number;
  doctorAvatar: any;
  date: string;
  time: string;
  consultationType: 'Video Call' | 'In-Person Clinic Visit' | 'Audio Call';
  fee: number;
  currency: string;
  reason?: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  bookedAt: string;
}

interface AppContextType {
  doctors: Doctor[];
  favoriteDoctorIds: string[];
  toggleFavorite: (doctorId: string) => void;
  isFavorite: (doctorId: string) => boolean;
  appointments: BookedAppointment[];
  bookAppointment: (appointment: Omit<BookedAppointment, 'id' | 'bookedAt' | 'status'>) => BookedAppointment;
  cancelAppointment: (id: string) => void;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => void;
  selectedSpecialty: string;
  setSelectedSpecialty: (specialty: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  unreadNotifications: number;
  clearNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favoriteDoctorIds, setFavoriteDoctorIds] = useState<string[]>(['dr-sushma-shrestha']);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [unreadNotifications, setUnreadNotifications] = useState<number>(2);

  const [appointments, setAppointments] = useState<BookedAppointment[]>([
    {
      id: 'apt-initial-1',
      doctorId: 'dr-sushma-shrestha',
      doctorName: 'Dr. Sushma Shrestha',
      doctorSpecialty: 'General Physician',
      doctorRating: 4.8,
      doctorReviews: 120,
      doctorAvatar: require('@/assets/images/doctors/sushma.jpg'),
      date: 'Thu, 25 Sep 2025',
      time: '10:00 AM',
      consultationType: 'Video Call',
      fee: 700,
      currency: 'Rs.',
      reason: 'General health checkup and routine blood pressure screening.',
      status: 'Upcoming',
      bookedAt: '2025-09-20',
    },
  ]);

  const toggleFavorite = (doctorId: string) => {
    setFavoriteDoctorIds((prev) =>
      prev.includes(doctorId) ? prev.filter((id) => id !== doctorId) : [...prev, doctorId]
    );
  };

  const isFavorite = (doctorId: string) => favoriteDoctorIds.includes(doctorId);

  const bookAppointment = (data: Omit<BookedAppointment, 'id' | 'bookedAt' | 'status'>): BookedAppointment => {
    const newAppointment: BookedAppointment = {
      ...data,
      id: `apt-${Date.now()}`,
      status: 'Upcoming',
      bookedAt: new Date().toISOString(),
    };
    setAppointments((prev) => [newAppointment, ...prev]);
    return newAppointment;
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'Cancelled' as const } : apt))
    );
  };

  const rescheduleAppointment = (id: string, newDate: string, newTime: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, date: newDate, time: newTime, status: 'Upcoming' as const } : apt
      )
    );
  };

  const clearNotifications = () => {
    setUnreadNotifications(0);
  };

  return (
    <AppContext.Provider
      value={{
        doctors: DOCTORS,
        favoriteDoctorIds,
        toggleFavorite,
        isFavorite,
        appointments,
        bookAppointment,
        cancelAppointment,
        rescheduleAppointment,
        selectedSpecialty,
        setSelectedSpecialty,
        searchQuery,
        setSearchQuery,
        unreadNotifications,
        clearNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
