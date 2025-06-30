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
            await Task.Delay(1000); // simulate loading time // Optional loading delay
            var data = new WatchdogData();

            var testCluster1 = new Cluster
            {
                Name = "Cluster1",
                Nodes = new List<MonitoredNode>
                {
                    new MonitoredNode { Hostname = "Cluster1Node1", IPAddress = "127.0.0.1", IsConnected = true },
                    new MonitoredNode { Hostname = "Cluster1Node2", IPAddress = "127.0.0.1", IsConnected = true },
                    new MonitoredNode { Hostname = "Cluster1Node3", IPAddress = "127.0.0.1", IsConnected = true },
                    new MonitoredNode { Hostname = "Cluster1Node4", IPAddress = "127.0.0.1", IsConnected = true },
                    new MonitoredNode { Hostname = "Cluster1Node5", IPAddress = "127.0.0.1", IsConnected = true }
                }
            };
            data.Clusters["Cluster1"] = testCluster1;

            var testCluster2 = new Cluster
            {
                Name = "Cluster2",
                Nodes = new List<MonitoredNode>
                {
                    new MonitoredNode { Hostname = "Cluster2Node1", IPAddress = "127.0.0.1", IsConnected = true },
                    new MonitoredNode { Hostname = "Cluster2Node2", IPAddress = "127.0.0.1", IsConnected = true },
                    new MonitoredNode { Hostname = "Cluster2Node3", IPAddress = "127.0.0.1", IsConnected = true },
                    new MonitoredNode { Hostname = "Cluster2Node4", IPAddress = "127.0.0.1", IsConnected = true },
                    new MonitoredNode { Hostname = "Cluster2Node5", IPAddress = "127.0.0.1", IsConnected = true }
                }
            };
            data.Clusters["Cluster2"] = testCluster2;
            
            var mainWindow = new MainWindow(data);
            mainWindow.Show();
            splash.Close();
        }
    }
}
