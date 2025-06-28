using System.Collections.ObjectModel;
using System.Windows.Input;
using Watchdog.Models;

namespace Watchdog.ViewModels
{
    public class ClusterViewModel
    {
        public string Name { get; }
        public ClusterStatus Status => _cluster.Status;

        public ObservableCollection<MonitoredNodeViewModel> Nodes { get; }

        public ICommand RunAllTestsCommand { get; }

        private readonly Cluster _cluster;

        public ClusterViewModel(Cluster cluster)
        {
            _cluster = cluster;
            Name = cluster.Name;

            Nodes = new ObservableCollection<MonitoredNodeViewModel>();
            foreach (var node in cluster.Nodes)
            {
                Nodes.Add(new MonitoredNodeViewModel(node));
            }

            RunAllTestsCommand = new RelayCommand(RunAllTests);
        }

        private void RunAllTests()
        {
            foreach (var node in Nodes)
            {
                node.RunAllTests();
            }
        }
    }
}

