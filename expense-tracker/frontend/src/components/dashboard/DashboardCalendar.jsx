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

const DashboardCalendar = ({ onDateRangeChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isSelectingRange, setIsSelectingRange] = useState(false);

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

        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-gray-600 py-1"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const inRange = isDateInRange(day);
            const isStart = isStartDate(day);
            const isEnd = isEndDate(day);
            
            return (
              <div
                key={index}
                onClick={() => handleDayClick(day)}
                className={`flex items-center justify-center text-sm transition ${
                  day === null
                    ? ""
                    : isStart || isEnd
                    ? "bg-green-600 text-white font-bold cursor-pointer w-10 h-10 rounded-full mx-auto"
                    : inRange
                    ? "bg-green-200 text-gray-800 font-semibold cursor-pointer py-2"
                    : "hover:bg-gray-100 cursor-pointer rounded py-2"
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardCalendar;