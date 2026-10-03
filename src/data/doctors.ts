import { ImageSourcePropType } from 'react-native';

export type SpecialtyKey =
  | 'general'
  | 'cardiology'
  | 'mentalHealth'
  | 'pediatrics'
  | 'neurology'
  | 'dentistry';

export interface SpecialtyItem {
  id: SpecialtyKey;
  name: string;
  iconName: string;
  iconType: 'feather' | 'material' | 'ionicons' | 'font-awesome5' | 'community';
  bg: string;
  iconColor: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  specialtyKey: SpecialtyKey;
  experienceYears: number;
  experienceLabel: string;
  rating: number;
  reviewsCount: number;
  patientsCount: string;
  bio: string;
  fee: number;
  currency: string;
  avatar: ImageSourcePropType;
  banner: ImageSourcePropType;
  availableDays: { id: string; label: string; fullDate: string }[];
  availableSlots: string[];
}

export const SPECIALTIES: SpecialtyItem[] = [
  {
    id: 'general',
    name: 'General',
    iconName: 'stethoscope',
    iconType: 'community',
    bg: '#EBF5FB',
    iconColor: '#0284C7',
  },
  {
    id: 'cardiology',
    name: 'Cardiology',
    iconName: 'heart-pulse',
    iconType: 'community',
    bg: '#FDE8E8',
    iconColor: '#EF4444',
  },
  {
    id: 'mentalHealth',
    name: 'Mental\nHealth',
    iconName: 'brain',
    iconType: 'community',
    bg: '#EEF2FF',
    iconColor: '#6366F1',
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    iconName: 'baby-face-outline',
    iconType: 'community',
    bg: '#FFF1E6',
    iconColor: '#F59E0B',
  },
  {
    id: 'neurology',
    name: 'Neurology',
    iconName: 'pulse',
    iconType: 'community',
    bg: '#F3E8FF',
    iconColor: '#9333EA',
  },
  {
    id: 'dentistry',
    name: 'Dentistry',
    iconName: 'tooth-outline',
    iconType: 'community',
    bg: '#FCE7F3',
    iconColor: '#EC4899',
  },
];

export const DOCTORS: Doctor[] = [
  {
    id: 'dr-sushma-shrestha',
    name: 'Dr. Sushma Shrestha',
    specialty: 'General Physician',
    specialtyKey: 'general',
    experienceYears: 8,
    experienceLabel: '8 years experience',
    rating: 4.8,
    reviewsCount: 120,
    patientsCount: '1,000+',
    bio: 'Experienced general physician with a focus on preventive care and lifestyle management.',
    fee: 700,
    currency: 'Rs.',
    avatar: require('@/assets/images/doctors/sushma.jpg'),
    banner: require('@/assets/images/doctors/sushma_banner.jpg'),
    availableDays: [
      { id: 'today', label: 'Today', fullDate: 'Thu, 25 Sep 2025' },
      { id: 'tomorrow', label: 'Tomorrow', fullDate: 'Fri, 26 Sep 2025' },
      { id: 'fri-26', label: 'Fri, 26 Sep', fullDate: 'Fri, 26 Sep 2025' },
    ],
    availableSlots: [
      '9:00 AM',
      '10:00 AM',
      '11:00 AM',
      '2:00 PM',
      '3:00 PM',
      '4:00 PM',
    ],
  },
  {
    id: 'dr-ramesh-adhikari',
    name: 'Dr. Ramesh Adhikari',
    specialty: 'General Physician',
    specialtyKey: 'general',
    experienceYears: 8,
    experienceLabel: '8 years experience',
    rating: 4.8,
    reviewsCount: 96,
    patientsCount: '1,200+',
    bio: 'Dedicated general physician specializing in family medicine, hypertension, and preventive primary care.',
    fee: 700,
    currency: 'Rs.',
    avatar: require('@/assets/images/doctors/ramesh.jpg'),
    banner: require('@/assets/images/doctors/ramesh.jpg'),
    availableDays: [
      { id: 'today', label: 'Today', fullDate: 'Thu, 25 Sep 2025' },
      { id: 'tomorrow', label: 'Tomorrow', fullDate: 'Fri, 26 Sep 2025' },
      { id: 'fri-26', label: 'Fri, 26 Sep', fullDate: 'Fri, 26 Sep 2025' },
    ],
    availableSlots: [
      '9:30 AM',
      '10:30 AM',
      '1:30 PM',
      '2:30 PM',
      '4:00 PM',
    ],
  },
  {
    id: 'dr-anisha-nepal',
    name: 'Dr. Anisha Nepal',
    specialty: 'General Physician',
    specialtyKey: 'general',
    experienceYears: 6,
    experienceLabel: '6 years experience',
    rating: 4.8,
    reviewsCount: 88,
    patientsCount: '850+',
    bio: 'Compassionate medical practitioner focused on comprehensive women health, wellness routines, and primary diagnosis.',
    fee: 650,
    currency: 'Rs.',
    avatar: require('@/assets/images/doctors/anisha.jpg'),
    banner: require('@/assets/images/doctors/anisha.jpg'),
    availableDays: [
      { id: 'today', label: 'Today', fullDate: 'Thu, 25 Sep 2025' },
      { id: 'tomorrow', label: 'Tomorrow', fullDate: 'Fri, 26 Sep 2025' },
      { id: 'sat-27', label: 'Sat, 27 Sep', fullDate: 'Sat, 27 Sep 2025' },
    ],
    availableSlots: [
      '9:00 AM',
      '11:00 AM',
      '12:00 PM',
      '3:00 PM',
      '4:30 PM',
    ],
  },
  {
    id: 'dr-bibash-thapa',
    name: 'Dr. Bibash Thapa',
    specialty: 'General Physician',
    specialtyKey: 'general',
    experienceYears: 10,
    experienceLabel: '10 years experience',
    rating: 4.8,
    reviewsCount: 142,
    patientsCount: '1,500+',
    bio: 'Senior physician with over 10 years of clinical experience in acute illness treatment and chronic condition follow-ups.',
    fee: 800,
    currency: 'Rs.',
    avatar: require('@/assets/images/doctors/bibash.jpg'),
    banner: require('@/assets/images/doctors/bibash.jpg'),
    availableDays: [
      { id: 'today', label: 'Today', fullDate: 'Thu, 25 Sep 2025' },
      { id: 'tomorrow', label: 'Tomorrow', fullDate: 'Fri, 26 Sep 2025' },
      { id: 'sun-28', label: 'Sun, 28 Sep', fullDate: 'Sun, 28 Sep 2025' },
    ],
    availableSlots: [
      '8:30 AM',
      '10:00 AM',
      '11:30 AM',
      '2:00 PM',
      '5:00 PM',
    ],
  },
  {
    id: 'dr-kusum-gurung',
    name: 'Dr. Kusum Gurung',
    specialty: 'General Physician',
    specialtyKey: 'general',
    experienceYears: 7,
    experienceLabel: '7 years experience',
    rating: 4.8,
    reviewsCount: 78,
    patientsCount: '900+',
    bio: 'Passionate outpatient physician providing comprehensive medical evaluations, dietary guidance, and health screenings.',
    fee: 700,
    currency: 'Rs.',
    avatar: require('@/assets/images/doctors/sushma.jpg'), // using high-res local asset
    banner: require('@/assets/images/doctors/sushma_banner.jpg'),
    availableDays: [
      { id: 'today', label: 'Today', fullDate: 'Thu, 25 Sep 2025' },
      { id: 'tomorrow', label: 'Tomorrow', fullDate: 'Fri, 26 Sep 2025' },
    ],
    availableSlots: [
      '9:00 AM',
      '10:30 AM',
      '1:00 PM',
      '3:30 PM',
    ],
  },
  {
    id: 'dr-prabin-joshi',
    name: 'Dr. Prabin Joshi',
    specialty: 'General Physician',
    specialtyKey: 'general',
    experienceYears: 5,
    experienceLabel: '5 years experience',
    rating: 4.8,
    reviewsCount: 65,
    patientsCount: '750+',
    bio: 'Patient-centric doctor emphasizing early diagnostics, personalized care plans, and health optimization.',
    fee: 650,
    currency: 'Rs.',
    avatar: require('@/assets/images/doctors/ramesh.jpg'),
    banner: require('@/assets/images/doctors/ramesh.jpg'),
    availableDays: [
      { id: 'today', label: 'Today', fullDate: 'Thu, 25 Sep 2025' },
      { id: 'tomorrow', label: 'Tomorrow', fullDate: 'Fri, 26 Sep 2025' },
    ],
    availableSlots: [
      '10:00 AM',
      '11:30 AM',
      '2:00 PM',
      '4:00 PM',
    ],
  },
  {
    id: 'dr-sushil-shrestha',
    name: 'Dr. Sushil Shrestha',
    specialty: 'General Physician',
    specialtyKey: 'general',
    experienceYears: 12,
    experienceLabel: '12 years experience',
    rating: 4.8,
    reviewsCount: 110,
    patientsCount: '1,400+',
    bio: 'Senior physician dedicated to holistic preventive health, adult medicine, and comprehensive diagnostics.',
    fee: 750,
    currency: 'Rs.',
    avatar: require('@/assets/images/doctors/sushil.jpg'),
    banner: require('@/assets/images/doctors/sushil.jpg'),
    availableDays: [
      { id: 'today', label: 'Today', fullDate: 'Thu, 25 Sep 2025' },
      { id: 'tomorrow', label: 'Tomorrow', fullDate: 'Fri, 26 Sep 2025' },
    ],
    availableSlots: [
      '9:00 AM',
      '10:30 AM',
      '2:00 PM',
      '4:30 PM',
    ],
  },
];

export interface PastAppointmentItem {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  dateStr: string;
  avatar: ImageSourcePropType;
  diagnosis: string;
  prescription: string[];
}

export const PAST_APPOINTMENTS: PastAppointmentItem[] = [
  {
    id: 'past-1',
    doctorId: 'dr-sushma-shrestha',
    doctorName: 'Dr. Sushma Shrestha',
    specialty: 'General Physician',
    dateStr: 'Tue, 9 Sep 2025 · 4:30 PM',
    avatar: require('@/assets/images/doctors/sushma.jpg'),
    diagnosis: 'Seasonal allergic rhinitis and mild dry cough.',
    prescription: [
      'Cetirizine 10mg - Once daily at bedtime for 5 days',
      'Saline Nasal Spray - 2 sprays per nostril twice daily',
      'Steam inhalation twice daily',
    ],
  },
  {
    id: 'past-2',
    doctorId: 'dr-ramesh-adhikari',
    doctorName: 'Dr. Ramesh Adhikari',
    specialty: 'General Physician',
    dateStr: 'Fri, 29 Aug 2025 · 11:30 AM',
    avatar: require('@/assets/images/doctors/ramesh.jpg'),
    diagnosis: 'Routine health screening & Blood Pressure follow-up.',
    prescription: [
      'Amlodipine 5mg - Once daily in morning',
      'Low sodium dietary recommendations',
      'Follow up in 4 weeks',
    ],
  },
  {
    id: 'past-3',
    doctorId: 'dr-sushil-shrestha',
    doctorName: 'Dr. Sushil Shrestha',
    specialty: 'General Physician',
    dateStr: 'Fri, 15 Aug 2025 · 10:00 AM',
    avatar: require('@/assets/images/doctors/sushil.jpg'),
    diagnosis: 'Acute viral pharyngitis with low-grade fever.',
    prescription: [
      'Paracetamol 650mg - As needed for fever or pain (max 3/day)',
      'Warm saltwater gargles 3-4 times daily',
      'Hydration: minimum 2.5L water daily',
    ],
  },
  {
    id: 'past-4',
    doctorId: 'dr-anisha-nepal',
    doctorName: 'Dr. Anisha Nepal',
    specialty: 'General Physician',
    dateStr: 'Mon, 28 Jul 2025 · 2:30 PM',
    avatar: require('@/assets/images/doctors/anisha.jpg'),
    diagnosis: 'Nutritional wellness consultation & Vitamin D deficiency.',
    prescription: [
      'Cholecalciferol (Vitamin D3) 60,000 IU - Once weekly for 8 weeks',
      'Balanced calcium-rich diet plan',
    ],
  },
];
