using System;
using System.Windows;
using Watchdog.Models;
using Watchdog.Services;

namespace Watchdog
{
    public partial class App : Application
    {
        private async void Application_Startup(object sender, StartupEventArgs e)
        {
            var splash = new SplashScreenWindow();
            splash.Show();
            var data = PersistenceService.Load();
            await Task.Delay(1000); // simulate loading time // Optional loading delay
            var mainWindow = new MainWindow(data);
            mainWindow.Show();
            splash.Close();
        }
    }
}
