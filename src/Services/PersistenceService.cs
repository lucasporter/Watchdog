using System;
using System.IO;
using System.Text.Json;
using Watchdog.Models;

namespace Watchdog.Services
{
    public static class PersistenceService
    {
        private static readonly string SavePath = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
            "Watchdog", "data.json");

        public static WatchdogData Load()
        {
            try
            {
                if (File.Exists(SavePath))
                {
                    string json = File.ReadAllText(SavePath);
                    var data = JsonSerializer.Deserialize<WatchdogData>(json);
                    return data ?? new WatchdogData();
                }
            }
            catch (Exception ex)
            {
                // Optionally log the error
            }

            return new WatchdogData(); // fallback to empty
        }

        public static void Save(WatchdogData data)
        {
            try
            {
                Directory.CreateDirectory(Path.GetDirectoryName(SavePath)!);
                string json = JsonSerializer.Serialize(data, new JsonSerializerOptions
                {
                    WriteIndented = true
                });
                File.WriteAllText(SavePath, json);
            }
            catch (Exception ex)
            {
                // Optionally log the error
            }
        }
    }
}
