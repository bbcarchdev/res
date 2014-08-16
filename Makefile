PACKAGE = res-website/res

sysconfdir ?= /etc
webdir ?= /var/www

INSTALL ?= install

FILES = \
	code.html guides.html index.html tools.html \
	local.css \
	246-route@2x.png 519-tools-1@2x.png 521-dropzone@2x.png 583-broadcast@2x.png \
	bbclogo.png bufvclogo.png jisclogo.png masthead.png

all:
	
install:
	$(INSTALL) -m 755 -d $(DESTDIR)$(webdir)/$(PACKAGE)
	for i in $(FILES) ; do $(INSTALL) -m 644 $$i $(DESTDIR)$(webdir)/$(PACKAGE) ; done