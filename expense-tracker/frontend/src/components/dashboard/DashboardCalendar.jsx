import React, { useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];

const getDaysInMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }
  return days;
};

const DashboardCalendar = ({ onDateRangeChange, viewType = "Monthly" }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isSelectingRange, setIsSelectingRange] = useState(false);

  React.useEffect(() => {
    const today = new Date();
    let start, end;

    switch (viewType) {
      case "Daily":
        start = new Date(today);
        end = new Date(today);
        break;
      case "Weekly":
        const dayOfWeek = today.getDay();
        start = new Date(today);
        start.setDate(today.getDate() - dayOfWeek);
        end = new Date(today);
        end.setDate(today.getDate() + (6 - dayOfWeek));
        break;
      case "Monthly":
      default:
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
    }

    setStartDate(start);
    setEndDate(end);
    if (onDateRangeChange) {
      onDateRangeChange({ start, end });
    }
  }, [viewType]);

  const changeMonth = (direction) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1)
    );
  };

  const handleDayClick = (day) => {
    if (!day) return;

    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    if (startDate && clickedDate.toDateString() === startDate.toDateString()) {
      setStartDate(null);
      setEndDate(null);
      setIsSelectingRange(false);
     
      if (onDateRangeChange) {
        onDateRangeChange(null, null);
      }
      return;
    }

    if (endDate && clickedDate.toDateString() === endDate.toDateString()) {
      setEndDate(null);
      setIsSelectingRange(false);
      return;
    }

    if (!startDate || (startDate && endDate)) {

      setStartDate(clickedDate);
      setEndDate(null);
      setIsSelectingRange(true);
    } else {

      if (clickedDate < startDate) {
        setEndDate(startDate);
        setStartDate(clickedDate);
      } else {
        setEndDate(clickedDate);
      }
      setIsSelectingRange(false);

      if (onDateRangeChange) {
        const start = clickedDate < startDate ? clickedDate : startDate;
        const end = clickedDate < startDate ? startDate : clickedDate;
        onDateRangeChange(start, end);
      }
    }
  };

  const isDateInRange = (day) => {
    if (!day || !startDate) return false;
    
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    
    if (endDate) {
      return date >= startDate && date <= endDate;
    }
    
    return date.toDateString() === startDate.toDateString();
  };

  const isStartDate = (day) => {
    if (!day || !startDate) return false;
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return date.toDateString() === startDate.toDateString();
  };

  const isEndDate = (day) => {
    if (!day || !endDate) return false;
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return date.toDateString() === endDate.toDateString();
  };

  const calendarDays = getDaysInMonth(currentDate);

  return (
    <div
      className="bg-white p-6 shadow-md flex flex-col justify-between h-full"
      style={{ borderRadius: "30px" }}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {viewType} View
            </span>
            <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs font-medium rounded-full">
              Active
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => changeMonth(-1)}
            className="p-1 hover:bg-gray-100 rounded transition"
          >
            <IoChevronBack className="text-gray-600" />
          </button>
          <h3 className="text-lg font-bold text-green-600">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button
            onClick={() => changeMonth(1)}
            className="p-1 hover:bg-gray-100 rounded transition"
          >
            <IoChevronForward className="text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-gray-600 py-1"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const inRange = isDateInRange(day);
            const isStart = isStartDate(day);
            const isEnd = isEndDate(day);
            
            return (
              <div
                key={index}
                onClick={() => handleDayClick(day)}
                className={`relative flex items-center justify-center text-sm transition h-8 mt-1 ${
                  day === null
                    ? ""
                    : inRange
                    ? "bg-green-100 cursor-pointer"
                    : "hover:bg-gray-50 cursor-pointer rounded-lg"
                } ${
                  inRange && isStart ? "rounded-l-lg" : ""
                } ${
                  inRange && isEnd ? "rounded-r-lg" : ""
                }`}
              >
                {day && (isStart || isEnd) && (
                  <div className="w-8 h-8 bg-green-500 text-white font-medium rounded-full flex items-center justify-center relative z-10">
                    {day}
                  </div>
                )}
                {day && !isStart && !isEnd && inRange && (
                  <span className="text-gray-900 font-medium">{day}</span>
                )}
                {day && !inRange && !isStart && !isEnd && (
                  <span className="text-gray-600 font-normal">{day}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardCalendar;