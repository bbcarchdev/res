<!DOCTYPE html>
<!--

 Author: Mo McRoberts <mo.mcroberts@bbc.co.uk>

 Copyright (c) 2014-2015 BBC

 Licensed under the terms of the Open Government Licence v2.0

-->
<html>
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
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
	</head>
	<body<?php echo $bodyclassattr; ?>>
		<header>
			<nav class="global"><div class="inner">
					<ul>
						<li class="logo"><a href="/res/"><abbr title="Research &amp; Education Space">RES</abbr></a></li>
						<li><a href="/res/education">Education</a></li>
						<li><a href="/res/collection">Collection holders</a></li>
						<li><a href="/res/developers">Product developers</a></li>
						<li><a href="/res/faq">FAQ</a></li>
					</ul>
			</div></nav>
			<div class="masthead"></div>
			<h1><?php echo $title; ?></h1>
		</header>
	