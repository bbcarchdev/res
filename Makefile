PACKAGE = res-website/res

sysconfdir ?= /etc
webdir ?= /var/www

INSTALL ?= install

FILES = \
	code.html guides.html index.html tools.html \
	local.css \
	246-route@2x.png 519-tools-1@2x.png 521-dropzone@2x.png 583-broadcast@2x.png \
	bbclogo.png bufvclogo.png jisclogo.png masthead.png

GENERATOR = templates/generate.php
GENFILES = $(GENERATOR) templates/header.php templates/footer.php

all: $(FILES)

clean:
	rm -f index.html code.html guides.html tools.html

install:
	$(INSTALL) -m 755 -d $(DESTDIR)$(webdir)/$(PACKAGE)
	for i in $(FILES) ; do $(INSTALL) -m 644 $$i $(DESTDIR)$(webdir)/$(PACKAGE) ; done

index.html: templates/index.phtml $(GENFILES)
	php -f $(GENERATOR) $< > $@

code.html: templates/code.phtml $(GENFILES)
	php -f $(GENERATOR) $< > $@

guides.html: templates/guides.phtml $(GENFILES)
	php -f $(GENERATOR) $< > $@

tools.html: templates/tools.phtml $(GENFILES)
	php -f $(GENERATOR) $< > $@
