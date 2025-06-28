using System.Collections.ObjectModel;
using Watchdog.Models;

namespace Watchdog.ViewModels
{
    public class MonitoredNodeViewModel
    {
        public string Hostname => _node.Hostname;
        public string IPAddress => _node.IPAddress;

        public bool IsConnected => _node.IsConnected;
        public NodeStatus Status => _node.Status;

        public ObservableCollection<UnitTest> UnitTests { get; }

        private readonly MonitoredNode _node;

        public MonitoredNodeViewModel(MonitoredNode node)
        {
            _node = node;
            UnitTests = new ObservableCollection<UnitTest>(_node.UnitTests);
        }

        // Optional: method to trigger re-check or refresh the status
        public void RefreshStatus()
        {
            // Logic to re-evaluate IsConnected and UnitTest results
            // Can raise events if needed for UI binding
        }

	public void RunAllTests()
        {
            foreach (var test in UnitTests)
            {
                // Simulated test run
                test.ActualResult = test.ExpectedResult; // pretend it passed
                test.LastRun = DateTime.Now;
            }
        }

    }
}

