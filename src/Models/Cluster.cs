using System.Collections.Generic;
using System.Linq;

namespace Watchdog.Models
{
    public class Cluster
    {
        public string Name { get; set; }

        public List<MonitoredNode> Nodes { get; set; } = new();

        public ClusterStatus Status =>
            Nodes.Count == 0 ? ClusterStatus.Offline :
            Nodes.All(n => n.Status == NodeStatus.Healthy) ? ClusterStatus.Healthy :
            Nodes.Any(n => n.Status == NodeStatus.Unhealthy) ? ClusterStatus.Unhealthy :
            ClusterStatus.Offline;
    }
}

