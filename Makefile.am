## Author: Mo McRoberts <mo.mcroberts@bbc.co.uk>
##
## Copyright (c) 2014 BBC
##
## Licensed under the terms of the Open Government Licence, version 2.0.
## You may obtain a copy of the license at:
##
## https://www.nationalarchives.gov.uk/doc/open-government-licence/version/2/

SUBDIRS = templates

reshtdoc_DATA = index.html code.html guides.html tools.html education.html collection.html developers.html faq.html tech.html

CLEANFILES = $(reshtdoc_DATA)

dist_reshtdoc_DATA = local.css *.png

TEMPLATES = templates/header.php templates/footer.php

GENERATE = $(PHP) -f $(srcdir)/templates/generate.php

index.html: $(srcdir)/templates/index.phtml $(srcdir)/templates/generate.php $(TEMPLATES)
	$(GENERATE) $< > $@

code.html: $(srcdir)/templates/code.phtml $(srcdir)/templates/generate.php $(TEMPLATES)
	$(GENERATE) $< > $@

guides.html: $(srcdir)/templates/guides.phtml $(srcdir)/templates/generate.php $(TEMPLATES)
	$(GENERATE) $< > $@

tools.html: $(srcdir)/templates/tools.phtml $(srcdir)/templates/generate.php $(TEMPLATES)
	$(GENERATE) $< > $@

education.html: $(srcdir)/templates/education.phtml $(srcdir)/templates/generate.php $(TEMPLATES)
	$(GENERATE) $< > $@

collection.html: $(srcdir)/templates/collection.phtml $(srcdir)/templates/generate.php $(TEMPLATES)
	$(GENERATE) $< > $@

developers.html: $(srcdir)/templates/developers.phtml $(srcdir)/templates/generate.php $(TEMPLATES)
	$(GENERATE) $< > $@

faq.html: $(srcdir)/templates/faq.phtml $(srcdir)/templates/generate.php $(TEMPLATES)
	$(GENERATE) $< > $@

tech.html: $(srcdir)/templates/tech.phtml $(srcdir)/templates/generate.php $(TEMPLATES)
	$(GENERATE) $< > $@
