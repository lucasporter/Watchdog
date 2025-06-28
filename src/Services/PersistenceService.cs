using System;
using System.IO;
using System.Text.Json;
using Watchdog.Models;

namespace Watchdog.Services
{
    public static class PersistenceService
    {
        private static readonly string DataDirectory = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data");
        private static readonly string DataFile = Path.Combine(DataDirectory, "persisted_data.json");

        public static WatchdogData LoadData()
        {
            try
            {
                if (!File.Exists(DataFile))
                {
                    return new WatchdogData(); // return blank structure
                }

                var json = File.ReadAllText(DataFile);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                return JsonSerializer.Deserialize<WatchdogData>(json, options) ?? new WatchdogData();
            }
            catch (Exception ex)
            {
                // TODO: Add logging if needed
                return new WatchdogData(); // fallback to blank data
            }
        }

        public static void SaveData(WatchdogData data)
        {
            try
            {
                if (!Directory.Exists(DataDirectory))
                {
                    Directory.CreateDirectory(DataDirectory);
                }

                var json = JsonSerializer.Serialize(data, new JsonSerializerOptions
                {
                    WriteIndented = true
                });

                File.WriteAllText(DataFile, json);
            }
            catch (Exception ex)
            {
                // TODO: Add logging if needed
            }
        }
    }
}

