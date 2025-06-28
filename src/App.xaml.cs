using System;
using System.Windows;
using System.Threading.Tasks;
using Watchdog.Models;
using Watchdog.Services;

namespace Watchdog
{
    public partial class App : Application
    {
        private static WatchdogData? _data;

        public static WatchdogData Data => _data ??= new WatchdogData();

        private async void Application_Startup(object sender, StartupEventArgs e)
        {
            var splash = new SplashScreenWindow();
            splash.Show();

            await Task.Delay(1000); // simulate loading time
            _data = PersistenceService.LoadData();

            var mainWindow = new MainWindow(Data);
            mainWindow.Show();

            splash.Close();
        }

        private void Application_Exit(object sender, ExitEventArgs e)
        {
            if (_data != null)
            {
                PersistenceService.SaveData(_data);
            }
        }
    }
}

