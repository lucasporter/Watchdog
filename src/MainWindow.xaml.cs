using System.Windows;
using System.Windows.Controls;
using Watchdog.Models;
using Watchdog.ViewModels;

namespace Watchdog
{
    public partial class MainWindow : Window
    {
        private readonly MainWindowViewModel _viewModel;

        public MainWindow(WatchdogData data)
        {
            InitializeComponent();
            _viewModel = new MainWindowViewModel(data);
            DataContext = _viewModel;
        }

        private void AddNode_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button btn && btn.Tag is ClusterViewModel clusterVm)
            {
                var dialog = new AddNodeDialog();
                if (dialog.ShowDialog() == true)
                {
                    var newNode = new MonitoredNode
                    {
                        Hostname = dialog.Hostname,
                        IPAddress = dialog.IPAddress
                    };
                    clusterVm.AddNode(newNode);
                }
            }
        }

        private void ClusterTabs_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (_viewModel.ClustersPlus[^1] is ClusterViewModel placeholder &&
                ClusterTabs.SelectedItem == placeholder)
            {
                _viewModel.AddCluster();
                _viewModel.SelectedClusterIndex = _viewModel.ClustersPlus.Count - 2;
            }
        }
    }
}
