import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk

class MainWindow(Gtk.Window):

	def __init__(self):
		Gtk.Window.__init__(self, title="Cirkit")