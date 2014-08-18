## Author: Mo McRoberts <mo.mcroberts@bbc.co.uk>
##
## Copyright (c) 2014 BBC
##
##  Licensed under the Apache License, Version 2.0 (the "License");
##  you may not use this file except in compliance with the License.
##  You may obtain a copy of the License at
##
##      http://www.apache.org/licenses/LICENSE-2.0
##
##  Unless required by applicable law or agreed to in writing, software
##  distributed under the License is distributed on an "AS IS" BASIS,
##  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
##  See the License for the specific language governing permissions and
##  limitations under the License.

## These are the make rules for building this tree as part of the RES
## website - https://bbcarchdev.github.io/res/

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
