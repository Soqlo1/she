// В начале файла добавьте:
const isDark = typeof window !== 'undefined' && 
  window.Telegram?.WebApp?.colorScheme === 'dark';

// Обновите стили:
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#1f1f1f' : '#fff',
  },
  monthContainer: {
    padding: 10,
    backgroundColor: isDark ? '#1f1f1f' : '#fff',
    marginBottom: 10,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    color: isDark ? '#999' : '#666',
    fontSize: 12,
  },
  dayText: {
    color: isDark ? '#fff' : '#333',
    fontSize: 16,
  },
  // ... остальные стили остаются без изменений
});