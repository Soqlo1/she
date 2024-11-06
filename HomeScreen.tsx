import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Calendar from './Calendar';
import { CycleDay } from './CycleTypes';

const HomeScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [cycleDays, setCycleDays] = useState<CycleDay[]>([]);
  const [predictedDays, setPredictedDays] = useState<CycleDay[]>([]);
  const [lastCycleStartDate, setLastCycleStartDate] = useState<Date | null>(null);

  const findFirstDayOfLastCycle = (days: CycleDay[]) => {
    if (days.length === 0) return null;

    const sortedDays = [...days].sort((a, b) => 
      a.date.getTime() - b.date.getTime()
    );

    const cycleStartDays: Date[] = [];
    let currentCycleStart = sortedDays[0].date;
    cycleStartDays.push(new Date(currentCycleStart));

    for (let i = 1; i < sortedDays.length; i++) {
      const dayDiff = Math.floor(
        (sortedDays[i].date.getTime() - sortedDays[i-1].date.getTime()) / 
        (1000 * 60 * 60 * 24)
      );
      
      if (dayDiff > 5) {
        currentCycleStart = sortedDays[i].date;
        cycleStartDays.push(new Date(currentCycleStart));
      }
    }

    return cycleStartDays[cycleStartDays.length - 1];
  };

  const predictNextCycles = (startDate: Date) => {
    const predicted: CycleDay[] = [];
    let currentPredictionDate = new Date(startDate);
    
    for (let cycle = 0; cycle < 6; cycle++) {
      const daysUntilNext = Math.floor(Math.random() * (34 - 28 + 1)) + 28;
      
      currentPredictionDate = new Date(currentPredictionDate.getTime());
      currentPredictionDate.setDate(currentPredictionDate.getDate() + daysUntilNext);

      for (let i = 0; i < 5; i++) {
        const predictedDate = new Date(currentPredictionDate);
        predictedDate.setDate(predictedDate.getDate() + i);
        predicted.push({
          date: predictedDate,
          isPeriod: true,
          isPredicted: true
        });
      }
    }

    setPredictedDays(predicted);
  };

  useEffect(() => {
    const firstDayOfLastCycle = findFirstDayOfLastCycle(cycleDays);
    
    if (firstDayOfLastCycle) {
      if (!lastCycleStartDate || 
          firstDayOfLastCycle.getTime() !== lastCycleStartDate.getTime()) {
        setLastCycleStartDate(firstDayOfLastCycle);
        predictNextCycles(firstDayOfLastCycle);
      }
    } else {
      setPredictedDays([]);
      setLastCycleStartDate(null);
    }
  }, [cycleDays]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    
    const existingDayIndex = cycleDays.findIndex(
      day => day.date.toDateString() === date.toDateString()
    );

    if (existingDayIndex >= 0) {
      const newCycleDays = cycleDays.filter((_, index) => index !== existingDayIndex);
      setCycleDays(newCycleDays);
    } else {
      const newCycleDays = [...cycleDays, { date: date, isPeriod: true }];
      setCycleDays(newCycleDays);
    }
  };

  return (
    <View style={styles.container}>
      <Calendar
        selectedDate={selectedDate}
        cycleDays={cycleDays}
        predictedDays={predictedDays}
        onDateSelect={handleDateSelect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
});

export default HomeScreen;
