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
using System.Windows.Navigation;
using System.Windows.Shapes;
using WpfApp1.Windows.Database;
using WpfApp1.UserControls.View;

namespace WpfApp1
{
    /// <summary>
    /// Interaktionslogik für MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private bool isClicked = false;
        public Window connectDialog;
        public Window manageConnectionsDialog;

        public Guilds Guilds
        {
            get
            {
                return GuildsView;
            }
        }

        public MainWindow()
        {
            InitializeComponent();
            // Start Bot Initialization
            AvinaBot.Initialize();
        }

        // Open Database Connect Dialog
        private void CommandBinding_Executed(object sender, ExecutedRoutedEventArgs e)
        {

        }

        // Open Database Manage Connections Dialog
        private void Database_ManageConnections_Executed(object sender, ExecutedRoutedEventArgs e)
        {

        }

        // Set flag for drag
        private void Menu_MouseDown(object sender, MouseButtonEventArgs e)
        {
            if (e.ChangedButton == MouseButton.Left)
                isClicked = true;
        }

        // Start Dragging
        private void Menu_MouseMove(object sender, MouseEventArgs e)
        {
            if (isClicked)
            {
                try
                {
                    DragMove();
                }
                catch (InvalidOperationException ex)
                {
                    Console.WriteLine(ex.Message);
                    isClicked = false;
                }
            }
        }

        // Set flag for drag
        private void Menu_MouseUp(object sender, MouseButtonEventArgs e)
        {
            if (e.ChangedButton == MouseButton.Left)
                isClicked = false;
        }

        // Close Window
        private void CloseWindow(object sender, RoutedEventArgs e)
        {
            Application.Current.Shutdown();
        }

        // Minimize Window
        private void MinimizeWindow(object sender, RoutedEventArgs e)
        {
            WindowState = WindowState.Minimized;
        }

        // Maximize Window
        private void MaximizeWindow(object sender, RoutedEventArgs e)
        {
            WindowState = WindowState.Maximized;
            ButtonMaximize.Visibility = System.Windows.Visibility.Hidden;
            ButtonNormalize.Visibility = System.Windows.Visibility.Visible;
        }

        // Normalize Window
        private void NormalizeWindow(object sender, RoutedEventArgs e)
        {
            WindowState = WindowState.Normal;
            ButtonMaximize.Visibility = System.Windows.Visibility.Visible;
            ButtonNormalize.Visibility = System.Windows.Visibility.Hidden;
        }

        // Open Connect Window
        private void OpenConnectDialog(object sender, RoutedEventArgs e)
        {
            if(connectDialog == null)
                connectDialog = new ConnectDatabase(this);
            connectDialog.Show();
        }

        // Open Connect Window
        private void OpenManageConnectionsDialog(object sender, RoutedEventArgs e)
        {
            if (manageConnectionsDialog == null)
                manageConnectionsDialog = new ManageDatabaseConnections(this);
            manageConnectionsDialog.Show();
        }

        // Show GuildsView
        private void ViewGuilds(object sender, RoutedEventArgs e)
        {
            GuildsView.UpdateGuilds();
            GuildsView.Visibility = System.Windows.Visibility.Visible;
        }

        // Hide all UserControls
        private void HideAllUserControls()
        {
            GuildsView.Visibility = System.Windows.Visibility.Hidden;
        }
    }
}
