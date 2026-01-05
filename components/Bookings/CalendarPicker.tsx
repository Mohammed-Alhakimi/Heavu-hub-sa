import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface CalendarPickerProps {
    startDate: string; // ISO format
    endDate: string; // ISO format
    onChange: (start: string, end: string) => void;
    bookedDates: { start: Date; end: Date }[];
    minDate?: string;
    maxDate?: string;
    onClose: () => void;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({
    startDate,
    endDate,
    onChange,
    bookedDates,
    minDate,
    maxDate,
    onClose
}) => {
    const { t, i18n } = useTranslation();
    const [currentMonth, setCurrentMonth] = useState(new Date(startDate || new Date()));

    const daysInMonth = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const date = new Date(year, month, 1);
        const days = [];

        // Pad for start day of week
        const firstDay = date.getDay();
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }, [currentMonth]);

    const isBooked = (date: Date) => {
        return bookedDates.some(range => {
            const start = new Date(range.start);
            const end = new Date(range.end);
            // Reset times for comparison
            date.setHours(0, 0, 0, 0);
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);
            return date >= start && date <= end;
        });
    };

    const isSelected = (date: Date) => {
        if (!date) return false;
        const dStr = date.toISOString().split('T')[0];
        return dStr === startDate || dStr === endDate;
    };

    const isInRange = (date: Date) => {
        if (!date || !startDate || !endDate) return false;
        const dTime = date.getTime();
        const startTime = new Date(startDate).getTime();
        const endTime = new Date(endDate).getTime();
        return dTime > startTime && dTime < endTime;
    };

    const isDisabled = (date: Date) => {
        if (!date) return true;
        const dStr = date.toISOString().split('T')[0];
        if (minDate && dStr < minDate) return true;
        if (maxDate && dStr > maxDate) return true;
        return isBooked(date);
    };

    const handleDateClick = (date: Date) => {
        if (!date || isDisabled(date)) return;

        const dStr = date.toISOString().split('T')[0];

        if (!startDate || (startDate && endDate)) {
            // Start new selection
            onChange(dStr, '');
        } else if (startDate && !endDate) {
            if (dStr < startDate) {
                // Swap if clicked date is before start date
                onChange(dStr, startDate);
            } else if (dStr === startDate) {
                // Deselect if same date
                onChange('', '');
            } else {
                // Check if any date in between is booked
                const current = new Date(startDate);
                let hasConflict = false;
                while (current < date) {
                    current.setDate(current.getDate() + 1);
                    if (isBooked(new Date(current)) && current.getTime() < date.getTime()) {
                        hasConflict = true;
                        break;
                    }
                }

                if (hasConflict) {
                    onChange(dStr, '');
                } else {
                    onChange(startDate, dStr);
                }
            }
        }
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
    };

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden w-full animate-fadeIn transition-all">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                    type="button"
                    onClick={prevMonth}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 transition-colors"
                >
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm">
                    {currentMonth.toLocaleDateString(i18n.language, { month: 'long', year: 'numeric' })}
                </span>
                <button
                    type="button"
                    onClick={nextMonth}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 transition-colors"
                >
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>

            <div className="p-4">
                <div className="grid grid-cols-7 mb-2">
                    {weekDays.map(day => (
                        <div key={day} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {daysInMonth.map((date, idx) => {
                        if (!date) return <div key={`empty-${idx}`} className="aspect-square"></div>;

                        const disabled = isDisabled(date);
                        const selected = isSelected(date);
                        const inRange = isInRange(date);
                        const isStart = date.toISOString().split('T')[0] === startDate;
                        const isEnd = date.toISOString().split('T')[0] === endDate;

                        return (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleDateClick(date)}
                                disabled={disabled}
                                className={`
                                    relative aspect-square rounded-full text-xs font-bold transition-all flex items-center justify-center
                                    ${disabled ? 'text-slate-200 dark:text-slate-700 cursor-not-allowed' : 'text-slate-700 dark:text-slate-200 hover:bg-primary/20'}
                                    ${selected ? 'bg-primary text-slate-900 shadow-md transform scale-105 z-10' : ''}
                                    ${inRange ? 'bg-primary/10 rounded-none' : ''}
                                    ${isStart && endDate ? 'rounded-r-none' : ''}
                                    ${isEnd ? 'rounded-l-none' : ''}
                                `}
                            >
                                {date.getDate()}
                                {isBooked(date) && !selected && (
                                    <div className="absolute top-1 right-1 size-1 bg-red-400 rounded-full"></div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {(startDate || endDate) && (
                    <div className="mt-4 flex justify-end">
                        <button
                            type="button"
                            onClick={() => onChange('', '')}
                            className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-xs">close</span>
                            Clear Dates
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarPicker;
