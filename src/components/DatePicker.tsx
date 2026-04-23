import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

interface DatePickerProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ currentDate, onDateChange }) => {
  const dateString = currentDate.toISOString().split('T')[0];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      onDateChange(newDate);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-sm w-full md:w-auto">
      <CalendarIcon size={16} className="text-gold" />
      <div className="relative">
        <input
          type="date"
          value={dateString}
          onChange={handleChange}
          className="bg-transparent text-white text-xs md:text-sm font-bold focus:outline-none cursor-pointer [color-scheme:dark]"
        />
      </div>
    </div>
  );
};
