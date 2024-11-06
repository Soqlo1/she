import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native-web';
import { CycleDay } from './CycleTypes';

interface CalendarProps {
  selectedDate: Date;
  cycleDays: CycleDay[];
  predictedDays: CycleDay[];
  onDateSelect: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  cycleDays,
  predictedDays,
  onDateSelect,
}) => {
  const [months, setMonths] = useState<Date[]>([]);
  const isDark = typeof window !== 'undefined' && 
    window.Telegram?.WebApp?.colorScheme === 'dark';

  useEffect(() => {
    const generateMonths = () => {
      const monthsArray: Date[] = [];
      const startDate = new Date(2024, 8, 1); // 1 сентября 2024
      const endDate = new Date(2025, 7, 31); // 31 августа 2025
      
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        monthsArray.push(new Date(currentDate));
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
      
      setMonths(monthsArray);
    };

    generateMonths();
  }, []);

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days: Date[] = [];
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const paddingDay = new Date(year, month, -i);
      days.push(paddingDay);
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const isPeriodDay = (date: Date): boolean => {
    return cycleDays.some(
      cycleDay => cycleDay.date.toDateString() === date.toDateString()
    );
  };

  const isPredictedDay = (date: Date): boolean => {
    return predictedDays.some(
      cycleDay => cycleDay.date.toDateString() === date.toDateString()
    );
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isPastDay = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isOtherMonth = (date: Date, currentMonth: number): boolean => {
    return date.getMonth() !== currentMonth;
  };

  const renderMonth = (monthDate: Date) => {
    const days = getDaysInMonth(monthDate);
    const monthNames = [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    return (
      <View style={styles.monthContainer} key={monthDate.toISOString()}>
        <Text style={styles.monthTitle}>
          {monthNames[monthDate.getMonth()]} {monthDate.getFullYear()}
        </Text>
        <View style={styles.weekDays}>
          {weekDays.map(day => (
            <Text key={day} style={styles.weekDay}>{day}</Text>
          ))}
        </View>
        <View style={styles.daysContainer}>
          {days.map((date, index) => {
            const isCurrentPeriod = isPeriodDay(date);
            const isPredicted = isPredictedDay(date);
            const todayDay = isToday(date);
            const pastDay = isPastDay(date);
            const otherMonth = isOtherMonth(date, monthDate.getMonth());

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.day,
                  isCurrentPeriod && (pastDay ? styles.pastPeriodDay : styles.currentPeriodDay),
                  isPredicted && styles.predictedDay,
                  todayDay && styles.todayDay,
                  otherMonth && styles.otherMonthDay,
                ]}
                onPress={() => onDateSelect(date)}
                disabled={pastDay}
              >
                <Text style={[
                  styles.dayText,
                  otherMonth && styles.otherMonthDayText
                ]}>
                  {date.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {months.map(month => renderMonth(month))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  monthContainer: {
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 20,
  },
  dayText: {
    color: '#333',
    fontSize: 16,
  },
  currentPeriodDay: {
    backgroundColor: '#FF9EAA',
  },
  pastPeriodDay: {
    backgroundColor: '#FFB6C1',
  },
  predictedDay: {
    backgroundColor: '#FFE6EA',
  },
  todayDay: {
    borderWidth: 2,
    borderColor: '#FF4466',
  },
  otherMonthDay: {
    opacity: 0.3,
  },
  otherMonthDayText: {
    color: '#999',
  },
});

export default Calendar;
