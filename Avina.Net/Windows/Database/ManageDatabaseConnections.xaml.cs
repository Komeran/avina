using System;
using System.Collections.Generic;
using System.IO;
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
using System.Runtime.Serialization.Formatters.Binary;
using System.Data;
using MySql.Data.MySqlClient;

namespace WpfApp1.Windows.Database
{
    /// <summary>
    /// Interaction logic for ManageDatabaseConnections.xaml
    /// </summary>
    public partial class ManageDatabaseConnections : Window
    {
        private MainWindow MainWindow;

        private DBConnections savedConnections;

        public ManageDatabaseConnections(MainWindow MainWindow)
        {
            InitializeComponent();
            this.MainWindow = MainWindow;
            LoadConnections();
        }

        private void Window_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            MainWindow.manageConnectionsDialog = null;
        }

        public void SaveConnections()
        {
            try
            {
                if (!Directory.Exists("Data"))
                {
                    Directory.CreateDirectory("Data");
                }
                if (File.Exists("Data/Connections.bin"))
                {
                    File.Delete("Data/Connections.bin");
                }

                FileStream fs = new FileStream("Data/Connections.bin", FileMode.Create);
                BinaryFormatter fmt = new BinaryFormatter();
                fmt.Serialize(fs, savedConnections);
                fs.Close();
            }
            catch (IOException e)
            {
                MessageBox.Show(e.Message, "Could not save Connections");
            }
        }

        public void LoadConnections()
        {
            try
            {
                FileStream fs = new FileStream("Data/Connections.bin", FileMode.Open);
                BinaryFormatter fmt = new BinaryFormatter();
                savedConnections = (DBConnections)fmt.Deserialize(fs);
                fs.Close();
            }
            catch (IOException)
            {
                savedConnections = new DBConnections();
            }
            ConnectionsList.ItemsSource = savedConnections.Connection.DefaultView;
        }

        private void NewClick(object sender, RoutedEventArgs e)
        {
            ClearClick(sender, e);
        }

        private void ClearClick(object sender, RoutedEventArgs e)
        {
            SetCurrentDB("", 3306, "", "", "");
            ConnectionsList.SelectedItem = null;
        }

        private void SaveClick(object sender, RoutedEventArgs e)
        {
            string name = NameText.Text;
            string host = HostText.Text;
            short port;
            if (!short.TryParse(HostText.Text, out port))
            {
                port = 3306;
            }
            string user = UserText.Text;
            string password = PasswordText.Password;
            string database = DatabaseBox.Text;

            if(!SavePassword.IsChecked.Value)
                password = null;
            if(!SaveDatabase.IsChecked.Value)
                database = null;

            foreach (DBConnections.ConnectionRow row in savedConnections.Connection.Rows)
            {
                if (row.name.Equals(name))
                {
                    savedConnections.Connection.RemoveConnectionRow(row);
                    break;
                }
            }

            savedConnections.Connection.AddConnectionRow(host, port, user, password, database, name);

            SaveConnections();
        }

        private void DatabaseDropdown(object sender, EventArgs e)
        {
            string host = HostText.Text;
            string user = UserText.Text;
            int port = 3306;
            if (!Int32.TryParse(PortText.Text, out port))
            {
                port = 3306;
            }
            string pwd = this.PasswordText.Password;

            var connString = "server=" + host + ";user=" + user + ";port=" + port + ";password=" + pwd;

            MySqlConnection _DatabaseConnection = new MySqlConnection(connString);

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

        private void ConnectionsList_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            DBConnections.ConnectionRow selected = null;
            if (ConnectionsList.SelectedItem != null)
            {
                selected = (ConnectionsList.SelectedItem as DataRowView).Row as DBConnections.ConnectionRow;
                SetCurrentDB(selected.host, selected.port, selected.user, selected.password, selected.database, selected.password != null, selected.database != null, selected.name);
            }
        }

        private void DeleteClick(object sender, RoutedEventArgs e)
        {
            if (ConnectionsList.SelectedItem != null)
            {
                DBConnections.ConnectionRow selected = (ConnectionsList.SelectedItem as DataRowView).Row as DBConnections.ConnectionRow;
                savedConnections.Connection.RemoveConnectionRow(selected);
            }
            SaveConnections();
        }

        private void TestConnectionClick(object sender, RoutedEventArgs e)
        {
            string host = HostText.Text;
            string user = UserText.Text;
            int port = 3306;
            if (!Int32.TryParse(PortText.Text, out port))
            {
                port = 3306;
            }
            string pwd = PasswordText.Password;
            string database = DatabaseBox.Text;

            var connString = "server=" + host + ";user=" + user + ";port=" + port + ";password=" + pwd + ";database=" + database;

            MySqlConnection _DatabaseConnection = new MySqlConnection(connString);
            try
            {
                _DatabaseConnection.Open();
                _DatabaseConnection.Close();
                MessageBox.Show("Connection successful!", "", MessageBoxButton.OK, MessageBoxImage.Information);
            }
            catch (MySqlException ex)
            {
                MessageBox.Show(ex.Message, "CONNECTION FAILED", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void ConnectClick(object sender, RoutedEventArgs e)
        {
            string host = HostText.Text;
            string user = UserText.Text;
            int port = 3306;
            if (!Int32.TryParse(PortText.Text, out port))
            {
                port = 3306;
            }
            string pwd = PasswordText.Password;
            string database = DatabaseBox.Text;

            var connString = "server=" + host + ";user=" + user + ";port=" + port + ";password=" + pwd + ";database=" + database;
            ConnectDatabase.ConnectToDB(connString);
        }

        public void SetCurrentDB(string host, short port, string user, string password, string database, bool savePassword, bool saveDatabase, string name)
        {
                NameText.Text = name;
                HostText.Text = host;
                PortText.Text = port + "";
                UserText.Text = user;
                PasswordText.Password = password;
                DatabaseBox.Text = database;
                SavePassword.IsChecked = savePassword;
                SaveDatabase.IsChecked = saveDatabase;
        }

        public void SetCurrentDB(string host, short port, string user, string password, string database)
        {
            SetCurrentDB(host, port, user, password, database, false, false, "");
        }
    }
}
