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

srcdir ?= .
TEMPLATES ?= $(srcdir)/templates/header.php $(srcdir)/templates/footer.php
GENFILES ?= $(srcdir)/templates/generate.php $(TEMPLATES)

index.html: $(srcdir)/templates/index.phtml $(GENFILES)
	$(GENERATE) $< > $@

code.html: $(srcdir)/templates/code.phtml $(GENFILES)
	$(GENERATE) $< > $@

guides.html: $(srcdir)/templates/guides.phtml $(GENFILES)
	$(GENERATE) $< > $@

tools.html: $(srcdir)/templates/tools.phtml $(GENFILES)
	$(GENERATE) $< > $@

education.html: $(srcdir)/templates/education.phtml $(GENFILES)
	$(GENERATE) $< > $@

collections.html: $(srcdir)/templates/collections.phtml $(GENFILES)
	$(GENERATE) $< > $@

developers.html: $(srcdir)/templates/developers.phtml $(GENFILES)
	$(GENERATE) $< > $@

faq.html: $(srcdir)/templates/faq.phtml $(GENFILES)
	$(GENERATE) $< > $@

products.html: $(srcdir)/templates/products.phtml $(GENFILES)
	$(GENERATE) $< > $@
