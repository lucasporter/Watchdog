using System.Windows;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;
using Watchdog.Models;
using Watchdog.ViewModels;
using System.Collections.ObjectModel;

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

            LoadClusterTabs();
        }

        private void LoadClusterTabs()
        {
            ClusterTabs.Items.Clear();

            if (_viewModel.Clusters.Count == 0)
            {
                ClusterTabs.Items.Add(CreateClusterTab("Unnamed Cluster", new ObservableCollection<MonitoredNodeViewModel>()));
                return;
            }

            foreach (var cluster in _viewModel.Clusters)
            {
                ClusterTabs.Items.Add(CreateClusterTab(cluster.Name, cluster.Nodes));
            }
        }

        private TabItem CreateClusterTab(string name, ObservableCollection<MonitoredNodeViewModel> nodes)
        {
            var tab = new TabItem { Header = name };

            var grid = new Grid();
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(200) }); // Sidebar
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(1, GridUnitType.Star) }); // Main area

            // Sidebar
            var sidebar = new StackPanel
            {
                Background = System.Windows.Media.Brushes.DimGray,
                Margin = new Thickness(5)
            };
            sidebar.Children.Add(new TextBlock
            {
                Text = "Sidebar",
                Foreground = System.Windows.Media.Brushes.White,
                FontSize = 16,
                Margin = new Thickness(10)
            });
            Grid.SetColumn(sidebar, 0);
            grid.Children.Add(sidebar);

            // Node grid
            var nodeGrid = new UniformGrid
            {
                Columns = 4,
                Margin = new Thickness(10)
            };

            foreach (var node in nodes)
            {
                var border = new Border
                {
                    BorderThickness = new Thickness(1),
                    BorderBrush = System.Windows.Media.Brushes.Gray,
                    Margin = new Thickness(5),
                    Padding = new Thickness(5)
                };

                var content = new StackPanel();
                content.Children.Add(new TextBlock
                {
                    Text = node.Hostname,
                    Foreground = System.Windows.Media.Brushes.White,
                    FontWeight = FontWeights.Bold
                });
                content.Children.Add(new TextBlock
                {
                    Text = $"Status: {node.Status}",
                    Foreground = System.Windows.Media.Brushes.LightGray,
                    FontSize = 12
                });

                border.Child = content;
                nodeGrid.Children.Add(border);
            }

            Grid.SetColumn(nodeGrid, 1);
            grid.Children.Add(nodeGrid);

            tab.Content = grid;
            return tab;
        }
    }
}

