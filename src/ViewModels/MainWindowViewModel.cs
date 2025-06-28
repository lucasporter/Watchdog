using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using Watchdog.Models;

namespace Watchdog.ViewModels
{
    public class MainWindowViewModel : INotifyPropertyChanged
    {
        private ClusterViewModel? _selectedCluster;

        public ObservableCollection<ClusterViewModel> Clusters { get; set; }

        public ClusterViewModel? SelectedCluster
        {
            get => _selectedCluster;
            set
            {
                if (_selectedCluster != value)
                {
                    _selectedCluster = value;
                    OnPropertyChanged();
                }
            }
        }

        public MainWindowViewModel(WatchdogData data)
        {
            Clusters = new ObservableCollection<ClusterViewModel>();

            foreach (var kvp in data.Clusters)
            {
                var clusterVm = new ClusterViewModel(kvp.Value);
                Clusters.Add(clusterVm);
            }

            SelectedCluster = Clusters.FirstOrDefault(); // Select the first one by default
        }

        public event PropertyChangedEventHandler? PropertyChanged;
        protected void OnPropertyChanged([CallerMemberName] string? propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}

