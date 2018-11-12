using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

using MySql.Data;
using MySql.Data.MySqlClient;
using System.Data;

namespace WpfApp1.Windows.Database
{
    /// <summary>
    /// Interaction logic for ConnectDatabase.xaml
    /// </summary>
    public partial class ConnectDatabase : Window
    {
        private MainWindow MainWindow;

        private static MySqlConnection _DatabaseConnection;
        public static MySqlConnection DatabaseConnection
        {
            get
            {
                return _DatabaseConnection;
            }
        }

        public ConnectDatabase(MainWindow MainWindow)
        {
            InitializeComponent();
            this.MainWindow = MainWindow;
        }

        public static void ConnectToDB(string connectionString)
        {
            try
            {
                if (_DatabaseConnection != null)
                {
                    _DatabaseConnection.Close();
                }

                _DatabaseConnection = new MySqlConnection(connectionString);

                _DatabaseConnection.Open();
            }
            catch (MySqlException e)
            {
                MessageBox.Show(e.Message, "Connection Failed", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void Connect(object sender, RoutedEventArgs e)
        {
            string host = this.HostText.Text;
            string user = this.UserText.Text;
            string database = this.DatabaseBox.Text;
            int port = 3306;
            if (!Int32.TryParse(this.PortText.Text, out port))
            {
                port = 3306;
            }
            string pwd = this.PasswordText.Password;

            var connString = "server=" + host + ";user=" + user + ";database=" + database + ";port=" + port + ";password=" + pwd;

            try
            {
                if (_DatabaseConnection != null)
                {
                    _DatabaseConnection.Close();
                }

                _DatabaseConnection = new MySqlConnection(connString);

                _DatabaseConnection.Open();

                Close();
            }
            catch (MySqlException ex)
            {
                MessageBox.Show(ex.Message, "Connection Failed", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void DatabaseDropdown(object sender, EventArgs e)
        {
            string host = this.HostText.Text;
            string user = this.UserText.Text;
            int port = 3306;
            if (!Int32.TryParse(this.PortText.Text, out port))
            {
                port = 3306;
            }
            string pwd = this.PasswordText.Password;

            var connString = "server=" + host + ";user=" + user + ";port=" + port + ";password=" + pwd;

            _DatabaseConnection = new MySqlConnection(connString);

            MySqlCommand cmd = new MySqlCommand("SHOW DATABASES", _DatabaseConnection);

            this.DatabaseBox.Items.Clear();

            try
            {
                _DatabaseConnection.Open();
                MySqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    string row = reader.GetValue(0).ToString();
                    DatabaseBox.Items.Add(row);
                }
            }
            catch (MySqlException ex)
            {
                MessageBox.Show(this, ex.Message, ex.Number.ToString());
            }
        }

        private void Window_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            MainWindow.connectDialog = null;
        }
    }
}
