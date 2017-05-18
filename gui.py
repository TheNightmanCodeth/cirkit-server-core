from gtk.main import MainWindow
import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk

#Main window
window = MainWindow()
window.connect("delete-event", Gtk.main_quit)
window.show_all()
Gtk.main()