import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// ─── Notification Handler ─────────────────────────────────────────────────────

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ─── Permission ───────────────────────────────────────────────────────────────

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'LMS Notifications',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      });
    }
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

// ─── Notification Triggers ────────────────────────────────────────────────────

/**
 * Fires immediately when user bookmarks their 5th course.
 */
export async function scheduleBookmarkMilestone(): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You're on fire! 🔥",
        body: "You've bookmarked 5 courses. Time to start learning!",
        sound: true,
      },
      trigger: null, // immediate
    });
  } catch {
    // Graceful degradation — notification is non-critical
  }
}

/**
 * Schedules a re-engagement reminder 24 hours from now.
 * Cancels any previously scheduled reminder before setting a fresh one.
 */
export async function scheduleReEngagementReminder(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Don't lose your streak 📚",
        body: "You haven't visited your courses today. Keep up the momentum!",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 24 * 60 * 60,
        repeats: false,
      },
    });
  } catch {
    // Non-critical — app works fine without re-engagement notifications
  }
}

/**
 * Cancels the re-engagement reminder (call when user opens the app).
 */
export async function cancelReEngagementReminder(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // Silent
  }
}
