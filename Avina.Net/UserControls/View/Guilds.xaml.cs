using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data;
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
using System.Windows.Navigation;
using System.Windows.Shapes;
using WpfApp1.Windows.Database;
using Discord;
using Discord.Commands;
using Discord.WebSocket;

namespace WpfApp1.UserControls.View
{
    /// <summary>
    /// Interaction logic for Guilds.xaml
    /// </summary>
    public partial class Guilds : UserControl
    {
        private MainWindow MainWindow;

        public Guilds()
        {
            InitializeComponent();
            MainWindow = Window.GetWindow(this) as MainWindow;
        }

        public void UpdateGuilds() {
            GuildsList.Items.Clear();
            try
            {
                MySqlCommand cmd = new MySqlCommand("SELECT * FROM g_guilds", ConnectDatabase.DatabaseConnection);
                MySqlDataReader reader = cmd.ExecuteReader();
                List<string> snowflakes = new List<string>();
                while (reader.Read())
                {
                    string row = reader.GetValue(0).ToString();
                    snowflakes.Add(row);
                }
                reader.Close();
                Dictionary<string, string> guilds = AvinaBot.GetGuildNames(snowflakes);

                foreach (string snowflake in guilds.Keys)
                {
                    GuildsList.Items.Add(guilds[snowflake]);
                }
            }
            catch (MySqlException e)
            {
                MessageBox.Show(e.Message, e.Number.ToString());
            }/*
            catch (Exception e)
            {
                MessageBox.Show(e.Message + "\n" + e.StackTrace);
            }*/
        }

        public void ClearGuilds()
        {
            GuildsList.DataContext = null;
        }
    }
}
