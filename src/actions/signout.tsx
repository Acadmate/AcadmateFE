"use client";
import axios from "axios";

/**
 * Signs out the user and clears all application cache data
 * @returns {Promise<boolean|Object>} Success status or response data
 */
export async function signout() {
  const api_url = process.env.NEXT_PUBLIC_API_URL;

  try {
    await clearAllCacheData();
    const response = await axios.post(
      `${api_url}/signout`,
      {},
      {
        withCredentials: true,
        headers: {
          "Cache-Control": "no-cache, no-store"
        }
      }
    );

    console.log("Sign out successful");
    return response.data;
  } catch (error) {
    console.error("Error during sign out:", error);
    try {
      await clearAllCacheData();
      return { success: false, localDataCleared: true };
    } catch (cacheError) {
      console.error("Error clearing cache during failed signout:", cacheError);
      return null;
    }
  }
}

/**
 * Clears all application cache and local storage data
 * @returns {Promise<void>}
 */
async function clearAllCacheData() {
  localStorage.clear();

  if ("caches" in window) {
    try {
      const cacheNames = [
        "calendar-cache",
        "timetable-cache",
        "attendance-cache",
      ];
      
      await Promise.all(cacheNames.map(cacheName => 
        caches.delete(cacheName).catch(err => 
          console.warn(`Failed to delete ${cacheName}:`, err)
        )
      ));

      const keys = await caches.keys();
      await Promise.all(
        keys.filter(key => key.includes("-cache"))
          .map(key => caches.delete(key))
      );
      
      console.log("All cache data cleared");
    } catch (error) {
      console.error("Error clearing cache storage:", error);
      throw error;
    }
  }
}

/**
 * Checks if user is currently signed in based on client-side data
 * @returns {boolean} Whether user appears to be signed in
 */
export function isUserSignedIn() {
  const hasAuthData = Boolean(localStorage.getItem("kill"));
  return hasAuthData;
}