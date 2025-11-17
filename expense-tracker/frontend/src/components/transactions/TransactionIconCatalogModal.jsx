import React, { useState } from 'react';
import { FaTimes, FaSearch } from 'react-icons/fa';

import GcashIcon from '../../assets/extra icons/finance/arcticons_gcash.svg';
import BankIcon from '../../assets/extra icons/finance/clarity_bank-solid.svg';
import MoneyIcon from '../../assets/extra icons/finance/fluent_money-16-regular.svg';
import SavingsIcon from '../../assets/extra icons/finance/fluent_savings-32-regular.svg';
import PesoIcon from '../../assets/extra icons/finance/formkit_peso.svg';
import PhoneFinanceIcon from '../../assets/extra icons/finance/gridicons_phone.svg';
import MoneyHandIcon from '../../assets/extra icons/finance/grommet-icons_money.svg';
import MoneyHandLineIcon from '../../assets/extra icons/finance/majesticons_money-hand-line.svg';
import MoneyBagOutlineIcon from '../../assets/extra icons/finance/material-symbols_money-bag-outline.svg';
import SavingsAltIcon from '../../assets/extra icons/finance/material-symbols_savings.svg';
import FinanceIcon from '../../assets/extra icons/finance/mdi_finance.svg';
import CreditCardIcon from '../../assets/extra icons/finance/mynaui_credit-card-solid.svg';
import PaypalIcon from '../../assets/extra icons/finance/ri_paypal-fill.svg';
import DollarIcon from '../../assets/extra icons/finance/solar_dollar-bold-duotone.svg';
import EuroIcon from '../../assets/extra icons/finance/solar_euro-bold-duotone.svg';
import MoneyBagIcon from '../../assets/extra icons/finance/solar_money-bag-bold-duotone.svg';
import WalletIcon from '../../assets/extra icons/finance/stash_wallet-duotone.svg';
import CryptoIcon from '../../assets/extra icons/finance/streamline-ultimate_crypto-encryption-key.svg';
import YenBagIcon from '../../assets/extra icons/finance/streamline_bag-yen-remix.svg';
import CreditCard2Icon from '../../assets/extra icons/finance/streamline_credit-card-2-remix.svg';
import AnalyticsIcon from '../../assets/extra icons/finance/tdesign_chart-analytics.svg';

import TaxiIcon from '../../assets/extra icons/transportation/cil_taxi.svg';
import BusSideIcon from '../../assets/extra icons/transportation/fa7-solid_bus-side.svg';
import CarSportIcon from '../../assets/extra icons/transportation/famicons_car-sport.svg';
import MotorcycleIcon from '../../assets/extra icons/transportation/fontisto_motorcycle.svg';
import SailBoatIcon from '../../assets/extra icons/transportation/fontisto_sait-boat.svg';
import MotorbikeIcon from '../../assets/extra icons/transportation/healthicons_basic-motorcycle.svg';
import BoatIcon from '../../assets/extra icons/transportation/ion_boat-sharp.svg';
import CarIcon from '../../assets/extra icons/transportation/lucide_car.svg';
import CableCarIcon from '../../assets/extra icons/transportation/mdi_cable-car.svg';
import JeepneyIcon from '../../assets/extra icons/transportation/mdi_jeepney.svg';
import AirplaneIcon from '../../assets/extra icons/transportation/mingcute_airplane-line.svg';
import JeepIcon from '../../assets/extra icons/transportation/simple-icons_jeep.svg';
import TaxiBoldIcon from '../../assets/extra icons/transportation/streamline-ultimate_taxi-bold.svg';
import EarthAirplaneIcon from '../../assets/extra icons/transportation/streamline_earth-airplane.svg';
import BusIcon from '../../assets/extra icons/transportation/tabler_bus-filled.svg';
import CarCraneIcon from '../../assets/extra icons/transportation/tabler_car-crane-filled.svg';
import TrainIcon from '../../assets/extra icons/transportation/tabler_train-filled.svg';
import TrainAltIcon from '../../assets/extra icons/transportation/vaadin_train.svg';
import HelicopterIcon from '../../assets/extra icons/transportation/wpf_helicopter.svg';

import ShoppingBagIcon from '../../assets/extra icons/shopping/flowbite_shopping-bag-outline.svg';
import NailPolishIcon from '../../assets/extra icons/shopping/fluent-emoji-high-contrast_nail-polish.svg';
import CameraIcon from '../../assets/extra icons/shopping/gridicons_camera.svg';
import VegetablesIcon from '../../assets/extra icons/shopping/healthicons_vegetables.svg';
import DressIcon from '../../assets/extra icons/shopping/hugeicons_dress-04.svg';
import ShoesIcon from '../../assets/extra icons/shopping/hugeicons_running-shoes.svg';
import HeelsIcon from '../../assets/extra icons/shopping/icon-park-outline_high-heeled-shoes.svg';
import CutIcon from '../../assets/extra icons/shopping/ion_cut.svg';
import BoxFillIcon from '../../assets/extra icons/shopping/lets-icons_box-alt-fill.svg';
import BoxOpenIcon from '../../assets/extra icons/shopping/lets-icons_box-open-fill.svg';
import GiftIcon from '../../assets/extra icons/shopping/lucide_gift.svg';
import FurnitureIcon from '../../assets/extra icons/shopping/maki_furniture.svg';
import ToyIcon from '../../assets/extra icons/shopping/material-symbols_smart-toy-outline-rounded.svg';
import HairDryerIcon from '../../assets/extra icons/shopping/mdi_hair-dryer-outline.svg';
import MonitorPhoneIcon from '../../assets/extra icons/shopping/mdi_monitor-smartphone.svg';
import RingIcon from '../../assets/extra icons/shopping/mdi_ring.svg';
import ToothbrushIcon from '../../assets/extra icons/shopping/mdi_toothbrush-paste.svg';
import FlowerIcon from '../../assets/extra icons/shopping/mingcute_flower-fill.svg';
import GameIcon from '../../assets/extra icons/shopping/mingcute_game-2-fill.svg';
import HatIcon from '../../assets/extra icons/shopping/mingcute_hat-2-line.svg';
import WatchIcon from '../../assets/extra icons/shopping/mingcute_watch-line.svg';
import WorkIcon from '../../assets/extra icons/shopping/pajamas_work.svg';
import CartIcon from '../../assets/extra icons/shopping/solar_cart-large-3-linear.svg';
import SmartphoneIcon from '../../assets/extra icons/shopping/stash_smartphone.svg';
import LaundryIcon from '../../assets/extra icons/shopping/streamline_hotel-laundry-solid.svg';
import LipstickIcon from '../../assets/extra icons/shopping/temaki_lipstick.svg';

import FoodIcon from '../../assets/extra icons/Food & drink/fluent_food-16-filled.svg';
import CakeIcon from '../../assets/extra icons/Food & drink/fluent_food-cake-16-filled.svg';
import FruitIcon from '../../assets/extra icons/Food & drink/game-icons_fruit-bowl.svg';
import WaterIcon from '../../assets/extra icons/Food & drink/material-symbols_water-bottle-outline.svg';
import BreadIcon from '../../assets/extra icons/Food & drink/mdi_bread.svg';
import FoodAltIcon from '../../assets/extra icons/Food & drink/mdi_food.svg';
import CoffeeIcon from '../../assets/extra icons/Food & drink/ph_coffee-bold.svg';
import BeerIcon from '../../assets/extra icons/Food & drink/ri_beer-line.svg';
import FoodPandaIcon from '../../assets/extra icons/Food & drink/simple-icons_foodpanda.svg';
import DrinkIcon from '../../assets/extra icons/Food & drink/tdesign_drink-filled.svg';
import HotDrinkIcon from '../../assets/extra icons/Food & drink/temaki_hot-drink-cup.svg';

import KeyIcon from '../../assets/extra icons/home/bxs_key.svg';
import ToiletIcon from '../../assets/extra icons/home/fa7-solid_toilet.svg';
import LampIcon from '../../assets/extra icons/home/game-icons_ceiling-light.svg';
import CabinetIcon from '../../assets/extra icons/home/hugeicons_cabinet-03.svg';
import DryCleaningIcon from '../../assets/extra icons/home/ic_round-dry-cleaning.svg';
import HammerIcon from '../../assets/extra icons/home/ion_hammer.svg';
import BedIcon from '../../assets/extra icons/home/mdi_bed.svg';
import CouchIcon from '../../assets/extra icons/home/mdi_couch.svg';
import MonitorIcon from '../../assets/extra icons/home/mdi_monitor-smartphone.svg';
import PlantIcon from '../../assets/extra icons/home/mdi_plant.svg';
import PottedPlantIcon from '../../assets/extra icons/home/ph_potted-plant-fill.svg';
import TvIcon from '../../assets/extra icons/home/ph_television-bold.svg';
import BroomIcon from '../../assets/extra icons/home/streamline-plump_clean-broom-wipe-solid.svg';
import PaintIcon from '../../assets/extra icons/home/tabler_paint-filled.svg';
import ToiletPaperIcon from '../../assets/extra icons/home/tabler_toilet-paper.svg';
import HomeIcon from '../../assets/extra icons/home/teenyicons_house-solid.svg';

import DentalIcon from '../../assets/extra icons/health/akar-icons_dental.svg';
import BandaidIcon from '../../assets/extra icons/health/bi_bandaid-fill.svg';
import MedicinesIcon from '../../assets/extra icons/health/game-icons_medicines.svg';
import MedicineBottleIcon from '../../assets/extra icons/health/icon-park-solid_medicine-bottle-one.svg';
import GlassesIcon from '../../assets/extra icons/health/lucide_glasses.svg';
import HealthSafetyIcon from '../../assets/extra icons/health/material-symbols_health-and-safety-outline-rounded.svg';
import InternalMedicineIcon from '../../assets/extra icons/health/medical-icon_i-internal-medicine.svg';
import HealthIcon from '../../assets/extra icons/health/solar_health-bold.svg';
import HospitalBuildingIcon from '../../assets/extra icons/health/streamline-pixel_health-hospital-building-1.svg';
import CheckupDiagnosticIcon from '../../assets/extra icons/health/streamline-ultimate_checkup-diagnostic-bold.svg';
import MedicalReportIcon from '../../assets/extra icons/health/streamline_checkup-medical-report-clipboard.svg';

import TennisIcon from '../../assets/extra icons/workout & sport/cil_tennis.svg';
import SwimmerIcon from '../../assets/extra icons/workout & sport/fa-solid_swimmer.svg';
import SoccerIcon from '../../assets/extra icons/workout & sport/fluent-emoji-high-contrast_soccer-ball.svg';
import MuscleIcon from '../../assets/extra icons/workout & sport/hugeicons_body-part-muscle.svg';
import YogaMatIcon from '../../assets/extra icons/workout & sport/hugeicons_yoga-mat.svg';
import YogaIcon from '../../assets/extra icons/workout & sport/iconoir_yoga.svg';
import BasketballIcon from '../../assets/extra icons/workout & sport/mingcute_basketball-fill.svg';
import RunningIcon from '../../assets/extra icons/workout & sport/streamline-ultimate_group-running.svg';

import AwardIcon from '../../assets/extra icons/Education/fa6-solid_award.svg';
import SchoolBuildingIcon from '../../assets/extra icons/Education/fa6-solid_school.svg';
import BookIcon from '../../assets/extra icons/Education/fa_book.svg';
import SchoolBagIcon from '../../assets/extra icons/Education/game-icons_school-bag.svg';
import SchoolIcon from '../../assets/extra icons/Education/maki_school.svg';
import EducationIcon from '../../assets/extra icons/Education/tdesign_education-filled.svg';

import DogIcon from '../../assets/extra icons/family and pets/fa-solid_dog.svg';
import OldManIcon from '../../assets/extra icons/family and pets/healthicons_old-man-outline-24px.svg';
import OldWomanIcon from '../../assets/extra icons/family and pets/healthicons_old-woman-outline-24px.svg';
import FishIcon from '../../assets/extra icons/family and pets/icon-park-twotone_fish.svg';
import BabyBottleIcon from '../../assets/extra icons/family and pets/lucide-lab_bottle-baby.svg';
import FamilyIcon from '../../assets/extra icons/family and pets/material-symbols_family-restroom-rounded.svg';
import BabyIcon from '../../assets/extra icons/family and pets/mingcute_baby-fill.svg';
import CatIcon from '../../assets/extra icons/family and pets/solar_cat-broken.svg';
import PawIcon from '../../assets/extra icons/family and pets/streamline-plump_pet-paw-solid.svg';

const TransactionIconCatalogModal = ({ isOpen, onClose, onSelectIcon, currentIcon }) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const iconCategories = [
    {
      name: 'Finances',
      icons: [
        { name: 'Gcash', src: GcashIcon },
        { name: 'Bank', src: BankIcon },
        { name: 'Money', src: MoneyIcon },
        { name: 'Savings', src: SavingsIcon },
        { name: 'Peso', src: PesoIcon },
        { name: 'Phone', src: PhoneFinanceIcon },
        { name: 'Money Hand', src: MoneyHandIcon },
        { name: 'Money Hand Line', src: MoneyHandLineIcon },
        { name: 'Money Bag', src: MoneyBagOutlineIcon },
        { name: 'Savings Alt', src: SavingsAltIcon },
        { name: 'Finance', src: FinanceIcon },
        { name: 'Credit Card', src: CreditCardIcon },
        { name: 'Paypal', src: PaypalIcon },
        { name: 'Dollar', src: DollarIcon },
        { name: 'Euro', src: EuroIcon },
        { name: 'Cash Bag', src: MoneyBagIcon },
        { name: 'Wallet', src: WalletIcon },
        { name: 'Crypto', src: CryptoIcon },
        { name: 'Yen Bag', src: YenBagIcon },
        { name: 'Card', src: CreditCard2Icon },
        { name: 'Analytics', src: AnalyticsIcon },
      ]
    },
    {
      name: 'Transportation',
      icons: [
        { name: 'Taxi', src: TaxiIcon },
        { name: 'Bus', src: BusSideIcon },
        { name: 'Sport Car', src: CarSportIcon },
        { name: 'Motorcycle', src: MotorcycleIcon },
        { name: 'Sailboat', src: SailBoatIcon },
        { name: 'Motorbike', src: MotorbikeIcon },
        { name: 'Boat', src: BoatIcon },
        { name: 'Car', src: CarIcon },
        { name: 'Cable Car', src: CableCarIcon },
        { name: 'Jeepney', src: JeepneyIcon },
        { name: 'Airplane', src: AirplaneIcon },
        { name: 'Jeep', src: JeepIcon },
        { name: 'Taxi Bold', src: TaxiBoldIcon },
        { name: 'Plane', src: EarthAirplaneIcon },
        { name: 'Bus Filled', src: BusIcon },
        { name: 'Tow Truck', src: CarCraneIcon },
        { name: 'Train', src: TrainIcon },
        { name: 'Metro', src: TrainAltIcon },
        { name: 'Helicopter', src: HelicopterIcon },
      ]
    },
    {
      name: 'Shopping',
      icons: [
        { name: 'Shopping Bag', src: ShoppingBagIcon },
        { name: 'Nail Polish', src: NailPolishIcon },
        { name: 'Camera', src: CameraIcon },
        { name: 'Vegetables', src: VegetablesIcon },
        { name: 'Dress', src: DressIcon },
        { name: 'Shoes', src: ShoesIcon },
        { name: 'Heels', src: HeelsIcon },
        { name: 'Cut', src: CutIcon },
        { name: 'Box', src: BoxFillIcon },
        { name: 'Package', src: BoxOpenIcon },
        { name: 'Gift', src: GiftIcon },
        { name: 'Furniture', src: FurnitureIcon },
        { name: 'Toy', src: ToyIcon },
        { name: 'Hair Dryer', src: HairDryerIcon },
        { name: 'Electronics', src: MonitorPhoneIcon },
        { name: 'Ring', src: RingIcon },
        { name: 'Toothbrush', src: ToothbrushIcon },
        { name: 'Flower', src: FlowerIcon },
        { name: 'Game', src: GameIcon },
        { name: 'Hat', src: HatIcon },
        { name: 'Watch', src: WatchIcon },
        { name: 'Work', src: WorkIcon },
        { name: 'Cart', src: CartIcon },
        { name: 'Phone', src: SmartphoneIcon },
        { name: 'Laundry', src: LaundryIcon },
        { name: 'Lipstick', src: LipstickIcon },
      ]
    },
    {
      name: 'Food & Drink',
      icons: [
        { name: 'Food', src: FoodIcon },
        { name: 'Cake', src: CakeIcon },
        { name: 'Fruit', src: FruitIcon },
        { name: 'Water', src: WaterIcon },
        { name: 'Bread', src: BreadIcon },
        { name: 'Meal', src: FoodAltIcon },
        { name: 'Coffee', src: CoffeeIcon },
        { name: 'Beer', src: BeerIcon },
        { name: 'Delivery', src: FoodPandaIcon },
        { name: 'Drink', src: DrinkIcon },
        { name: 'Hot Drink', src: HotDrinkIcon },
      ]
    },
    {
      name: 'Home',
      icons: [
        { name: 'Key', src: KeyIcon },
        { name: 'Toilet', src: ToiletIcon },
        { name: 'Lamp', src: LampIcon },
        { name: 'Cabinet', src: CabinetIcon },
        { name: 'Dry Cleaning', src: DryCleaningIcon },
        { name: 'Hammer', src: HammerIcon },
        { name: 'Bed', src: BedIcon },
        { name: 'Couch', src: CouchIcon },
        { name: 'Monitor', src: MonitorIcon },
        { name: 'Plant', src: PlantIcon },
        { name: 'Potted Plant', src: PottedPlantIcon },
        { name: 'TV', src: TvIcon },
        { name: 'Broom', src: BroomIcon },
        { name: 'Paint', src: PaintIcon },
        { name: 'Toilet Paper', src: ToiletPaperIcon },
        { name: 'Home', src: HomeIcon },
      ]
    },
    {
      name: 'Health',
      icons: [
        { name: 'Dental', src: DentalIcon },
        { name: 'Bandaid', src: BandaidIcon },
        { name: 'Medicines', src: MedicinesIcon },
        { name: 'Medicine Bottle', src: MedicineBottleIcon },
        { name: 'Glasses', src: GlassesIcon },
        { name: 'Health Safety', src: HealthSafetyIcon },
        { name: 'Internal Medicine', src: InternalMedicineIcon },
        { name: 'Health', src: HealthIcon },
        { name: 'Hospital', src: HospitalBuildingIcon },
        { name: 'Checkup', src: CheckupDiagnosticIcon },
        { name: 'Medical Report', src: MedicalReportIcon },
      ]
    },
    {
      name: 'Workout and Sports',
      icons: [
        { name: 'Tennis', src: TennisIcon },
        { name: 'Swimming', src: SwimmerIcon },
        { name: 'Soccer', src: SoccerIcon },
        { name: 'Muscle', src: MuscleIcon },
        { name: 'Yoga Mat', src: YogaMatIcon },
        { name: 'Yoga', src: YogaIcon },
        { name: 'Basketball', src: BasketballIcon },
        { name: 'Running', src: RunningIcon },
      ]
    },
    {
      name: 'Education',
      icons: [
        { name: 'Award', src: AwardIcon },
        { name: 'School Building', src: SchoolBuildingIcon },
        { name: 'Book', src: BookIcon },
        { name: 'School Bag', src: SchoolBagIcon },
        { name: 'School', src: SchoolIcon },
        { name: 'Education', src: EducationIcon },
      ]
    },
    {
      name: 'Family/Pets',
      icons: [
        { name: 'Dog', src: DogIcon },
        { name: 'Old Man', src: OldManIcon },
        { name: 'Old Woman', src: OldWomanIcon },
        { name: 'Fish', src: FishIcon },
        { name: 'Baby Bottle', src: BabyBottleIcon },
        { name: 'Family', src: FamilyIcon },
        { name: 'Baby', src: BabyIcon },
        { name: 'Cat', src: CatIcon },
        { name: 'Paw', src: PawIcon },
      ]
    },
  ];

  const filteredCategories = iconCategories.map(category => ({
    ...category,
    icons: category.icons.filter(icon =>
      icon.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.icons.length > 0);

  const handleSelectIcon = (iconSrc, iconName) => {
    onSelectIcon({
      name: iconName,
      src: iconSrc
    });
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      id="backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 font-poppins p-4"
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[500px] relative overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-green-500 to-green-400 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-white">Icon Catalog</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-1"
            >
              <FaTimes className="text-lg sm:text-xl" />
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
          <div className="relative">
            <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-white pointer-events-none">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <FaSearch className="text-xs sm:text-sm" />
              </div>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for an icon..."
              className="w-full pl-12 sm:pl-16 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4 sm:pb-6">
          {filteredCategories.map((category, idx) => (
            <div key={idx} className="mb-4 sm:mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 sm:mb-3">{category.name}</h3>
              
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                {category.icons.map((icon, iconIdx) => (
                  <button
                    key={iconIdx}
                    type="button"
                    onClick={() => handleSelectIcon(icon.src, icon.name)}
                    className="aspect-square rounded-lg flex items-center justify-center transition-all hover:scale-105 p-1.5 sm:p-2 bg-green-400 hover:bg-green-500"
                    title={icon.name}
                  >
                    <img 
                      src={icon.src} 
                      alt={icon.name}
                      className="w-full h-full object-contain"
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
          
          {filteredCategories.length === 0 && (
            <div className="text-center py-8 sm:py-12 text-gray-400 text-sm sm:text-base">
              No icons found matching "{searchQuery}"
            </div>
          )}
        </div>

        <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-3 sm:pt-4 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => filteredCategories[0]?.icons[0] && handleSelectIcon(filteredCategories[0].icons[0].src, filteredCategories[0].icons[0].name)}
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm sm:text-base"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionIconCatalogModal;
