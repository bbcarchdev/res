## Author: Mo McRoberts <mo.mcroberts@bbc.co.uk>
##
## Copyright (c) 2014-2017 BBC
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

# Remember to update Makefile.am if this file list changes

HTML = index.html code.html guides.html tools.html education.html collections.html products.html faq.html developers.html

FILES = $(HTML) \
	local.css \
	246-route@2x.png 519-tools-1@2x.png 521-dropzone@2x.png 583-broadcast@2x.png \
	bbclogo.png bufvclogo.png jisclogo.png masthead.png

top ?= ..
subdir = res

-include $(top)/config.mk

webdir ?= /var/www/res
PHP ?= php
GENERATE = $(PHP) -f templates/generate.php

all: $(FILES)

clean:
	rm -f $(HTML)

install:
	$(INSTALL) -m 755 -d $(DESTDIR)$(webdir)/$(PACKAGE)/$(subdir)
	for i in $(FILES) ; do $(INSTALL) -m 644 $$i $(DESTDIR)$(webdir)/$(PACKAGE)/$(subdir) ; done

include common.make
