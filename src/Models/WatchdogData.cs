using System.Collections.Generic;

namespace Watchdog.Models
{
    public class WatchdogData
    {
        public Dictionary<string, Cluster> Clusters { get; set; } = new();
    }
}

