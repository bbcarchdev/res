## Author: Mo McRoberts <mo.mcroberts@bbc.co.uk>
##
## Copyright (c) 2014 BBC
##
## Licensed under the terms of the Open Government Licence, version 2.0.
## You may obtain a copy of the license at:
##
## https://www.nationalarchives.gov.uk/doc/open-government-licence/version/2/

SUBDIRS = templates

reshtdoc_DATA = index.html code.html guides.html tools.html

dist_reshtdoc_DATA = local.css *.png

TEMPLATES = templates/header.php templates/footer.php

index.html: $(srcdir)/templates/index.phtml $(srcdir)/templates/generate.php $(TEMPLATES)
	$(PHP) -f $(srcdir)/templates/generate.php $< > $@

code.html: $(srcdir)/templates/code.phtml $(srcdir)/templates/generate.php $(TEMPLATES)
	$(PHP) -f $(srcdir)/templates/generate.php $< > $@

guides.html: $(srcdir)/templates/guides.phtml $(srcdir)/templates/generate.php $(TEMPLATES)
	$(PHP) -f $(srcdir)/templates/generate.php $< > $@

tools.html: $(srcdir)/templates/tools.phtml $(srcdir)/templates/generate.php $(TEMPLATES)
	$(PHP) -f $(srcdir)/templates/generate.php $< > $@