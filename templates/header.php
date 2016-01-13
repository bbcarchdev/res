<!DOCTYPE html>
<!--

 Author: Mo McRoberts <mo.mcroberts@bbc.co.uk>

 Copyright (c) 2014-2015 BBC

 Licensed under the terms of the Open Government Licence v2.0

-->
<html>
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta charset="utf-8" />
		<!--[if lt IE 9]><script>document.createElement('header');document.createElement('nav');document.createElement('section');document.createElement('article');document.createElement('aside');document.createElement('footer');</script><![endif]-->
		<title><?php echo $page_title; ?></title>
		<link rel="stylesheet" type="text/css" href="/painting-by-numbers/style.css">
		<link rel="stylesheet" type="text/css" href="/painting-by-numbers/print.css" media="print">
<?php if(!defined('NOFONTS')) {?>
		<link rel="stylesheet" type="text/css" href="//cloud.typography.com/6699852/732262/css/fonts.css">
		<link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Roboto:300,500,300italic,500italic|Inconsolata|Arapey">
<?php } ?>
		<link rel="stylesheet" type="text/css" href="local.css">
		<!--[if lt IE 9]><link rel="stylesheet" type="text/css" href="/painting-by-numbers/ie78.css" /><![endif]-->
    <!--[if lt IE 9]>
        <script src="/res/js/respond.js"></script>
    <![endif]-->
<script type="text/javascript" src="/res/js/modernizr.js"></script>
<script type="text/javascript" src="http://static.bbci.co.uk/frameworks/requirejs/0.13.0/sharedmodules/require.js"></script>
<script type="text/javascript">
bbcRequireMap = {
    "jquery-1.9":"http://static.bbci.co.uk/frameworks/jquery/0.3.0/sharedmodules/jquery-1.9.1",
    "swfobject-2":"http://static.bbci.co.uk/frameworks/swfobject/0.1.10/sharedmodules/swfobject-2",
        "bump-3":"http://emp.bbci.co.uk/emp/bump-3/bump-3"
}
require({ paths: bbcRequireMap,
    waitSeconds: 30 });
</script>

	</head>
	<body<?php echo $bodyclassattr; ?>>
		<header>
			<nav class="global">
				<div class="inner">
					<ul>
						<li class="logo"><a href="/res/"><abbr title="Research &amp; Education Space">RES</abbr></a></li>
						<li><a href="/res/education">Education</a></li>
						<li><a href="/res/collections">Collections</a></li>
						<li><a href="/res/products">Products</a></li>
						<li><a href="/res/faq">FAQ</a></li> 
					</ul>
				</div>
			</nav>
			<div class="masthead">
				<?php echo $promovideoiframe; ?>
			</div>

				<?php echo $secondarynavtemplate; ?>
			<h1><?php echo $title; ?></h1>
		</header>
	