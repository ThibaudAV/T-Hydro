export type Config = {
  wateringSchedules: WateringSchedule[];
};

export type ConfigJson = {
  wateringSchedules: Omit<WateringSchedule, '_id'>[];
};

export type WateringSchedule = {
  _id: string;
  // Output ID
  outputId: number;
  // Name of the watering time
  name: string;
  // Active or not
  isActive: boolean;
  // Start watering time AAAA-MM-JJ HH:MM:SS
  startWateringDate: string;
  // Frequency of watering in minutes
  frequencyMinutes: number;
  // Duration of watering in seconds
  durationMinutes: number;
};

export type ScheduleLog = {
  dateUnix: number;
  date: string;
  duration: number;
  name: string;
  isActive: boolean;
  _parentWatering: WateringSchedule;
};

export const getScheduleLogForDay = (
  waterings: WateringSchedule[],
  targetDate: Date,
): ScheduleLog[] => {
  const logs: ScheduleLog[] = [];

  // Définir les bornes du jour cible
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setHours(23, 59, 59, 999);

  const startOfDayUnix = Math.floor(startOfDay.getTime() / 1000);
  const endOfDayUnix = Math.floor(endOfDay.getTime() / 1000);

  waterings.forEach((watering) => {
    // if (!watering.isActive) return; // Ignorer les arrosages inactifs

    // Convertir startWateringDate en timestamp Unix
    const startTimestamp = Math.floor(
      new Date(watering.startWateringDate).getTime() / 1000,
    );
    if (isNaN(startTimestamp)) {
      console.warn(
        `⚠️ Format invalide pour ${watering.name}: ${watering.startWateringDate}`,
      );
      return;
    }

    let nextWatering = startTimestamp;
    const frequencySeconds = watering.frequencyMinutes * 60;

    // Générer les logs jusqu'à la fin de la journée cible
    var count = 0;
    while (nextWatering <= endOfDayUnix) {
      count++;
      if (nextWatering >= startOfDayUnix) {
        logs.push({
          dateUnix: nextWatering,
          date: new Date(nextWatering * 1000).toISOString(),
          duration: watering.durationMinutes,
          name: watering.name,
          isActive: watering.isActive ?? true,
          _parentWatering: watering,
        });
      }
      nextWatering += frequencySeconds;
    }
  });

  // Sort logs by date

  return logs.sort((a, b) => a.dateUnix - b.dateUnix);
};

export const getFullScheduleLog = (
  waterings: WateringSchedule[],
  nbOfDaysToLog: number,
): ScheduleLog[] => {
  const logs: ScheduleLog[] = [];

  // Définir les bornes du jour cible
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const startOfDayUnix = Math.floor(startOfDay.getTime() / 1000);

  waterings.forEach((watering) => {
    // if (!watering.isActive) return; // Ignorer les arrosages inactifs

    // Convertir startWateringDate en timestamp Unix
    const startTimestamp = Math.floor(
      new Date(watering.startWateringDate).getTime() / 1000,
    );
    if (isNaN(startTimestamp)) {
      console.warn(
        `⚠️ Format invalide pour ${watering.name}: ${watering.startWateringDate}`,
      );
      return;
    }

    let nextWatering = startTimestamp;
    const frequencySeconds = watering.frequencyMinutes * 60;

    // Générer les logs jusqu'à la fin de la journée cible
    var count = 0;
    while (count < nbOfDaysToLog) {
      count++;
      logs.push({
        dateUnix: nextWatering,
        date: new Date(nextWatering * 1000).toISOString(),
        duration: watering.durationMinutes,
        name: watering.name,
        isActive: watering.isActive ?? true,
        _parentWatering: watering,
      });
      nextWatering += frequencySeconds;
    }
  });

  // Sort logs by date

  return logs.sort((a, b) => a.dateUnix - b.dateUnix);
};

/*

DateUnix;Date;Duration;Name;IsActive
1643700000;2022-02-01 08:00:00;30;1;true
1643700000;2022-02-01 08:00:00;60;2;true
1643700000;2022-02-01 08:00:00;120;3;false

📋 Logs générés :
🕒 2024-02-01T08:00:00.000Z | 🌱 Arrosage Jardin | ⏳ 300 sec
🕒 2024-02-01T09:00:00.000Z | 🌱 Arrosage Jardin | ⏳ 300 sec
🕒 2024-02-01T10:00:00.000Z | 🌱 Arrosage Jardin | ⏳ 300 sec
 */
