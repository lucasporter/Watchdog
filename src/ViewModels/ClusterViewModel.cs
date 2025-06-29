using System.Collections.ObjectModel;
using Watchdog.Models;

namespace Watchdog.ViewModels
{
    public class ClusterViewModel
    {
        private readonly Cluster _cluster;

        public string Name => _cluster.Name;
        public bool IsPlaceholder { get; set; }

        public ObservableCollection<MonitoredNodeViewModel> Nodes { get; }

        public ClusterViewModel(Cluster cluster)
        {
            _cluster = cluster;
            Nodes = new ObservableCollection<MonitoredNodeViewModel>(
                cluster.Nodes.Select(n => new MonitoredNodeViewModel(n))
            );
        }

        public void AddNode(MonitoredNode node)
        {
            _cluster.Nodes.Add(node);
            Nodes.Add(new MonitoredNodeViewModel(node));
        }

        public static ClusterViewModel AddTabPlaceholder =>
            new ClusterViewModel(new Cluster { Name = "+" }) { IsPlaceholder = true };
    }
}
