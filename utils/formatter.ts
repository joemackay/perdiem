// Given a timestamp generate formatted time in string format
export const formatTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}


// Given a timestamp return a string formatted date
export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'long' }); // e.g., "May"
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

// How many minutes or hours ago
export const timeAgo = (past: number) => {
  const now = Math.floor(Date.now() / 1000); // current time in seconds
  const diffMs = now - past; // difference in milliseconds
  const diffMinutes = Math.floor(diffMs / (60));
  const diffHours = Math.floor(diffMs / (60 * 60));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

  // Fallback to date if over 24 hours
  // return timeAgo.toLocaleDateString(); // or use formatDate() from earlier
}

// Given a starting date, generate a sequence of days ahead.
// Todo: Make it accurately calculte days per month
export const generateMonthlySequence = (startNumber: number) => {
  const today = new Date();
  const currentDayOfMonth = today.getDate();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  
  const sequence = [];
  for (let i = 0; i < 31; i++) {
    const day = (currentDayOfMonth + i - 1) % daysInMonth + 1;
    const num = ((startNumber - 1 + i) % 31) + 1;
    sequence.push({ day, number: num });
  }
  
  return sequence;
}

// Deprecated
export const generateDaytimeIntervals12Hr = (startHour: number, startMinute: number, period: string, durationHours = 12) => {
  const intervals = [];
  let currentHour = startHour;
  let currentMinute = startMinute;
  let currentPeriod = period;
  
  // Convert start time to 24-hour format for calculations
  let hour24 = currentHour;
  if (currentPeriod === 'PM' && hour24 !== 12) hour24 += 12;
  if (currentPeriod === 'AM' && hour24 === 12) hour24 = 0;
  
  for (let i = 0; i < durationHours * 4; i++) { // 4 intervals per hour
    // Format start time
    const startHour12 = currentHour === 0 ? 12 : currentHour > 12 ? currentHour - 12 : currentHour;
    const startTime = `${startHour12.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')} ${currentPeriod}`;
    
    // Calculate end time
    let endMinute = currentMinute + 15;
    let endHour = currentHour;
    let endPeriod = currentPeriod;
    
    if (endMinute >= 60) {
      endMinute = endMinute % 60;
      endHour++;
      
      // Handle period changes
      if (endHour === 12) {
        endPeriod = currentPeriod === 'AM' ? 'PM' : 'AM';
      }
      if (endHour > 12) {
        endHour = endHour % 12;
      }
    }
    
    // Format end time
    const endHour12 = endHour === 0 ? 12 : endHour > 12 ? endHour - 12 : endHour;
    const endTime = `${endHour12.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')} ${endPeriod}`;
    
    intervals.push(`${startTime} - ${endTime}`);
    
    // Update current time for next iteration
    currentHour = endHour;
    currentMinute = endMinute;
    currentPeriod = endPeriod;
  }
  
  return intervals;
}

export const generateTimeSchedules = (
  startHour: number,
  startMinute: number,
  durationHours = 12,
  intervalMinutes = 30
) => {
  // console.log('===============')
  // console.log('startHour', startHour)
  // console.log('startMinute', startMinute)
  // console.log('durationHours', durationHours)
  // console.log('intervalMinutes', intervalMinutes)
  const intervals = [];

  // 1. Handle starting time
  // Create a Date object for the starting time
  const now = new Date();
  now.setHours(startHour, startMinute, 0, 0);

  // 2. Round up to the next valid interval
  // Assuming the crrent time is 10:15am and the interval is 30 minutes
  const totalMinutes = now.getHours() * 60 + now.getMinutes(); // 10:15am => 10 * 60 = 600 + 15 = 615
  // console.log('totalMinutes', totalMinutes)
  const roundedMinutes = Math.ceil(totalMinutes / intervalMinutes) * intervalMinutes; // 615/30 = 20.5 => 21 * 30 = 630
  now.setHours(Math.floor(roundedMinutes / 60), roundedMinutes % 60, 0, 0); // 630 => 10:30am

  // 3. Total number of intervals
  const totalIntervals = Math.floor((durationHours * 60) / intervalMinutes); // 12 hours * 60 minutes = 720 minutes / 30 minutes = 24 intervals
  // console.log('totalIntervals', totalIntervals)

  for (let i = 0; i < totalIntervals; i++) {
    const start = new Date(now.getTime() + i * intervalMinutes * 60000); // start = 10:30am + i * 30 minutes //60000 is the number of milliseconds in a minute
    const end = new Date(start.getTime() + intervalMinutes * 60000); // end = start + 30 minutes

    const format = (date: Date) =>
      `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

    intervals.push(`${format(start)} - ${format(end)}`);
  }
  // console.log('intervals', intervals)

  return intervals;
};

// format the time from string 10:46 to integer value 646 to be used for comparison
export const timeToMinutes = (time: string) => {
  if (time !== "") {
    const [hours, minutes] = (time || '00:00').split(':').map(Number);
    return hours * 60 + minutes || 0;
  }
  return 0;
};

// Return the ordinal value of a number eg 1st, 2nd etc
export const getDateOrdinal = (dateNumber: number) => {
  let ordinal;
  switch(dateNumber) {
    case 1:
      ordinal = 'st'
      break;
    case 2:
      ordinal = 'nd'
      break;
    case 3:
      ordinal = 'rd'
      break;
    default:
      ordinal = 'th'
  }
  return ordinal
}