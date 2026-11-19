export type VehicleType = 'Car' | 'Bike' | 'Others';
export type RentalDuration =
  | '12 Hours'
  | '24 Hours'
  | '48 Hours'
  | '5 Days'
  | '1 Week'
  | '1 Month'
  | 'Others';

export interface CarModel {
  id: string;
  name: string;
  price12h: number;
  price24h: number;
  image: string;
  alt: string;
  shortNote: string;
}

export const BRAND_CONFIG = {
  name: 'Satapathy Tour and Travels',
  tagline: 'SELF-DRIVE BIKE AND CAR RENTALS',
  locationSummary: 'All Over Rourkela, Odisha',
  locationDescription:
    'Service and convenient self-drive pickup available all over Rourkela. Connect with us on phone, WhatsApp, or email to coordinate your exact pickup point in Rourkela.',
  phoneDisplay: '+91 78548 88381',
  phoneHref: 'tel:+917854888381',
  whatsappNumber: '917854888381',
  whatsappBaseUrl: 'https://wa.me/917854888381',
  email: 'rklselfdrivecarz@gmail.com',
  emailHref: 'mailto:rklselfdrivecarz@gmail.com',
  instagramHandle: 'rklselfdrivecarz',
  instagramUrl: 'https://www.instagram.com/rklselfdrivecarz/',
  logoPath: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_6.00.56_PM_1d6810db.jpeg',
  heroImage: '/src/assets/images/hero_automotive_rental_1795091053905.jpg',
  bikeHeroImage: '/src/assets/images/bike_coming_soon_1795091053999.jpg',
  aboutImage: '/src/assets/images/about_automotive_drive_1795091054333.jpg',
  negotiableNotice: 'All prices are negotiable. Contact us for the best available rental price.',
  bikeComingSoonMessage:
    'Hello Satapathy Tour and Travels, I am interested in your upcoming self-drive bike rental service. Please let me know when it becomes available.',
} as const;

export const CAR_MODELS: CarModel[] = [
  {
    id: 'swift-dzire',
    name: 'Swift Dzire',
    price12h: 1500,
    price24h: 2000,
    image: '/src/assets/images/car_swift_dzire_1795091054222.jpg',
    alt: 'White Maruti Suzuki Swift Dzire self-drive rental car',
    shortNote: 'Compact sedan package for comfortable self-drive journeys.',
  },
  {
    id: 'baleno',
    name: 'Baleno',
    price12h: 1300,
    price24h: 1800,
    image: '/src/assets/images/car_baleno_1795091053644.jpg',
    alt: 'Metallic blue Maruti Suzuki Baleno self-drive rental hatchback',
    shortNote: 'Refined hatchback package suited for city and highway drives.',
  },
  {
    id: 'fronx',
    name: 'Fronx',
    price12h: 1600,
    price24h: 2300,
    image: '/src/assets/images/car_fronx_1795091054217.jpg',
    alt: 'Metallic bronze-grey Maruti Suzuki Fronx self-drive crossover car',
    shortNote: 'Modern crossover SUV stance for versatile self-drive travel.',
  },
  {
    id: 'swift',
    name: 'Swift',
    price12h: 1200,
    price24h: 1800,
    image: '/src/assets/images/car_swift_1795091054156.jpg',
    alt: 'Pearl white Maruti Suzuki Swift self-drive rental hatchback',
    shortNote: 'Agile hatchback package built for effortless daily drives.',
  },
];

export const RENTAL_DURATIONS: RentalDuration[] = [
  '12 Hours',
  '24 Hours',
  '48 Hours',
  '5 Days',
  '1 Week',
  '1 Month',
  'Others',
];

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function getCarById(id: string): CarModel | undefined {
  return CAR_MODELS.find((car) => car.id === id || car.name.toLowerCase() === id.toLowerCase());
}
