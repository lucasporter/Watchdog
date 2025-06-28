namespace Watchdog.Models
{
    public enum TestStatus
    {
        NotRun,
        Passing,
        Failing
    }

    public enum NodeStatus
    {
        Offline,
        Healthy,
        Unhealthy
    }

    public enum ClusterStatus
    {
        Offline,
        Healthy,
        Unhealthy
    }
}

