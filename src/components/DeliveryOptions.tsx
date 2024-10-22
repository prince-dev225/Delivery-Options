import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addDays } from 'date-fns';

type DeliveryOption = {
  id: string;
  label: string;
  price: number;
};

const deliveryOptions: DeliveryOption[] = [
  { id: 'next-day', label: 'Next Day Delivery', price: 19.90 },
  { id: 'standard', label: 'Standard Delivery', price: 12.90 },
  { id: 'saturday', label: 'Saturday Delivery', price: 24.40 },
  { id: 'pickup', label: 'Pickup', price: 0 },
];

const DeliveryOptions: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>('saturday');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleOptionChange = (id: string) => {
    setSelectedOption(id);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handlePrevMonth = () => {
    setCurrentDate(addMonths(currentDate, -1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = addDays(monthStart, -monthStart.getDay());
    const endDate = addDays(monthEnd, 6 - monthEnd.getDay());

    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <button
            key={day.toString()}
            onClick={() => handleDateChange(cloneDay)}
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
              isSameMonth(day, monthStart)
                ? isSameDay(day, selectedDate || new Date())
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-200'
                : 'text-gray-400'
            }`}
          >
            {formattedDate}
          </button>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="flex justify-between">
          {days}
        </div>
      );
      days = [];
    }
    return rows;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Delivery Options</h2>
        <button className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-2">Select a delivery method:</p>
        {deliveryOptions.map((option) => (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <label className="flex items-center justify-between p-3 border rounded-lg mb-2 cursor-pointer">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="deliveryOption"
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={() => handleOptionChange(option.id)}
                  className="mr-3"
                />
                <span>{option.label}</span>
              </div>
              <span className="font-semibold">
                {option.price === 0 ? 'Free' : `$${option.price.toFixed(2)}`}
              </span>
            </label>
          </motion.div>
        ))}
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <button onClick={handlePrevMonth} className="text-gray-600 hover:text-gray-800">
            <ChevronLeft size={20} />
          </button>
          <h3 className="text-lg font-semibold">{format(currentDate, 'MMMM yyyy')}</h3>
          <button onClick={handleNextMonth} className="text-gray-600 hover:text-gray-800">
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-800 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        {renderCalendar()}
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Your delivery date is{' '}
          <span className="font-semibold">
            {selectedDate ? format(selectedDate, 'dd MMMM') : 'not selected'}
          </span>
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold"
        >
          Continue
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DeliveryOptions;