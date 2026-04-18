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
    <div className="flex items-center justify-center space-x-3 mb-6 bg-white/5 p-3 rounded-2xl border border-white/5 backdrop-blur-sm max-w-xs mx-auto">
      <CalendarIcon size={18} className="text-gold" />
      <div className="relative">
        <input
          type="date"
          value={dateString}
          onChange={handleChange}
          className="bg-transparent text-white text-sm font-bold focus:outline-none cursor-pointer [color-scheme:dark]"
        />
      </div>
    </div>
  );
};
