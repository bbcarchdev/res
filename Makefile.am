## Author: Mo McRoberts <mo.mcroberts@bbc.co.uk>
##
## Copyright (c) 2014-2017 BBC
##
## Licensed under the terms of the Open Government Licence, version 2.0.
## You may obtain a copy of the license at:
##
## https://www.nationalarchives.gov.uk/doc/open-government-licence/version/2/

SUBDIRS = templates

# Remember to update buildrules.make if this list changes
reshtdoc_DATA = index.html code.html guides.html tools.html education.html collections.html products.html faq.html developers.html
dist_reshtdoc_DATA = local.css *.png

CLEANFILES = $(reshtdoc_DATA)

HTML = $(reshtdoc_DATA)

include common.make
