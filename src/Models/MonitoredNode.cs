using System.Collections.Generic;
using System.Linq;

namespace Watchdog.Models
{
    public class MonitoredNode
    {
        public string Hostname { get; set; }
        public string IPAddress { get; set; }

        public bool IsConnected { get; set; } = false;

        public List<UnitTest> UnitTests { get; set; } = new();

        public NodeStatus Status =>
            !IsConnected ? NodeStatus.Offline :
            UnitTests.All(t => t.Status == TestStatus.Passing) ? NodeStatus.Healthy :
            NodeStatus.Unhealthy;
    }
}

