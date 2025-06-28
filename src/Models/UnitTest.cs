using System;

namespace Watchdog.Models
{
    public class UnitTest
    {
        public string Name { get; set; }
        public string Command { get; set; }
        public string ExpectedResult { get; set; }
        public string ActualResult { get; set; }
        public DateTime? LastRun { get; set; }

        public TestStatus Status =>
            string.IsNullOrEmpty(ActualResult)
                ? TestStatus.NotRun
                : ActualResult == ExpectedResult
                    ? TestStatus.Passing
                    : TestStatus.Failing;
    }
}

