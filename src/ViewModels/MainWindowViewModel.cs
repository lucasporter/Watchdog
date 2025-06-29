using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Windows.Input;
using Watchdog.Models;

namespace Watchdog.ViewModels
{
    public class MainWindowViewModel : INotifyPropertyChanged
    {
        public ObservableCollection<ClusterViewModel> Clusters { get; set; }

        public ObservableCollection<ClusterViewModel> ClustersPlus =>
            new ObservableCollection<ClusterViewModel>(Clusters.Concat(new[] { AddClusterPlaceholder }));

        public ICommand AddNodeCommand { get; }

        private readonly WatchdogData _data;

        private int _selectedClusterIndex;
        public int SelectedClusterIndex
        {
            get => _selectedClusterIndex;
            set
            {
                if (_selectedClusterIndex != value)
                {
                    _selectedClusterIndex = value;
                    OnPropertyChanged();
                }
            }
        }

        public MainWindowViewModel(WatchdogData data)
        {
            _data = data;

            // Ensure at least one cluster exists
            if (_data.Clusters.Count == 0)
            {
                var defaultCluster = new Cluster
                {
                    Name = "Unnamed Cluster",
                    Nodes = new List<MonitoredNode>()
                };
                _data.Clusters["Unnamed Cluster"] = defaultCluster;
            }

            Clusters = new ObservableCollection<ClusterViewModel>(
                _data.Clusters.Values.Select(c => new ClusterViewModel(c))
            );

            AddNodeCommand = new RelayCommand(param =>
            {
                if (param is ClusterViewModel clusterVm)
                {
                    var newNode = new MonitoredNode
                    {
                        Hostname = "NewNode",
                        IPAddress = "0.0.0.0",
                        IsConnected = false,
                        UnitTests = new List<UnitTest>()
                    };
                    clusterVm.AddNode(newNode);
                }
            });
        }

        public void AddCluster()
        {
            string name = GenerateUniqueClusterName();

            var newCluster = new Cluster
            {
                Name = name,
                Nodes = new List<MonitoredNode>()
            };

            _data.Clusters[name] = newCluster;

            var vm = new ClusterViewModel(newCluster);
            Clusters.Add(vm);

            OnPropertyChanged(nameof(ClustersPlus));
        }

        private string GenerateUniqueClusterName()
        {
            int index = 1;
            string baseName = "New Cluster";

            while (_data.Clusters.ContainsKey($"{baseName} {index}"))
            {
                index++;
            }

            return $"{baseName} {index}";
        }

        private ClusterViewModel AddClusterPlaceholder => new ClusterViewModel(new Cluster { Name = "+" })
        {
            IsPlaceholder = true
        };

        public event PropertyChangedEventHandler? PropertyChanged;
        private void OnPropertyChanged([CallerMemberName] string? name = null) =>
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
    }
}
