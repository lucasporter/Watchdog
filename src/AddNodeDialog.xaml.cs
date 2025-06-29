using System.Windows;

namespace Watchdog
{
    public partial class AddNodeDialog : Window
    {
        public string Hostname { get; private set; } = string.Empty;
        public string IPAddress { get; private set; } = string.Empty;

        public AddNodeDialog()
        {
            InitializeComponent();
        }

        private void Add_Click(object sender, RoutedEventArgs e)
        {
            Hostname = HostnameInput.Text.Trim();
            IPAddress = IPInput.Text.Trim();

            if (!string.IsNullOrEmpty(Hostname) && !string.IsNullOrEmpty(IPAddress))
            {
                DialogResult = true;
                Close();
            }
            else
            {
                MessageBox.Show("Please fill in both fields.", "Validation", MessageBoxButton.OK, MessageBoxImage.Warning);
            }
        }

        private void Cancel_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = false;
            Close();
        }
    }
}
