<?php

/*
 Author: Mo McRoberts <mo.mcroberts@bbc.co.uk>

 Copyright (c) 2014 BBC

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/


error_reporting(E_ALL);
ini_set('display_errors', 'On');

$stderr = fopen('php://stderr', 'w');
	
if(count($argv) < 2)
{
	fprintf($stderr, "Usage: %s TEMPLATE [OPTIONS]\n", $argv[0]);
	exit(1);
}
if(count($argv) > 2)
{
	for($c = 2; $c < $argc; $c++)
	{
		switch($argv[$c])
		{
			case 'nofonts':
				define('NOFONTS', true);
				break;
			default:
				fprintf($stderr, "%s: invalid option '%s'\n", $argv[0], $argv[$c]);
				exit(1);
		}
	}
}

require($argv[1]);

/* Return the path to a sample */
function samplepath($name)
{
	if(substr($name, 0, 1) == '/')
	{
		return $name;
	}
	return dirname(__FILE__) . '/../components/' . $name;
}

/* Emit a literal sample with no decoration */
function literal($file)
{
	echo file_get_contents(samplepath($file));
}

/* Emit a literal sample block */
function sample($file)
{
	echo '<aside class="example">' . file_get_contents(samplepath($file)) . '</aside>';
}

function _e($text)
{
	return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
}

/* Emit a code block */
function code($language, $file, $html = false)
{
	$buffer = file_get_contents(samplepath($file));
	if(!$html)
	{
		switch($language)
		{
		case 'html':
		case 'xml':
		case 'docbook':
			$buffer = pretty_html($buffer);
			break;
		default:
			$buffer = htmlspecialchars($buffer, ENT_NOQUOTES, 'UTF-8');
		}
	}
	echo '<pre class="code ' . $language . '"><code>' . $buffer . '</code></pre>';
}

/* Pretty-print some HTML */
function pretty_html($html)
{
	/* Note that this is not intended to be foolproof; it's entirely possible
	 * that a poorly-crafted sample will cause invalid output, but samples
	 * are a trusted source in this context.
	 */
	$html = str_replace('&', '&amp;', $html);
	$c = 0;
	while(true)
	{
		while(true)
		{
			$s = strpos($html, '<', $c);
			$e = strpos($html, '>', $c);
			if($e === false || ($s !== false && $e > $s))
			{
				break;
			}
			$html = substr($html, 0, $e) . '&gt;' . substr($html, $e + 1);
		}
		if($s === false)
		{
			break;
		}
		if($e !== false)
		{
			$tag = substr($html, $s + 1, $e - $s - 1);
			$buf = pretty_html_tag($tag);
			$html = substr($html, 0, $s) . $buf . substr($html, $e + 1);
			$c = $s + strlen($buf);
		}
		else
		{
			$tag = substr($html, $s);
			$html = substr($html, 0, $s) . pretty_html_tag($tag);
			break;
		}
	}
	return $html;
}

function pretty_html_tag($tag)
{
	if(substr($tag, 0, 1) == '/')
	{
		return '&lt;/<span class="keyword">' . htmlspecialchars(substr($tag, 1), ENT_NOQUOTES, 'UTF-8') . '</span>&gt;';
	}
	$tag = htmlspecialchars($tag, ENT_NOQUOTES, 'UTF-8');
	$matches = array();
	preg_match('!^\s*(\S+)(\s+(.+))?$!misU', $tag, $matches);
	$tag = '&lt;<span class="keyword">' . $matches[1] . '</span>';
	$list = array();
	if(isset($matches[3]))
	{
		$attrs = $matches[3];
		$c = 0;
		$l = strlen($attrs);
		while($c < $l)
		{
			$s = strcspn($attrs, "= \t\r\n", $c);
			if(!$s)
			{
				$c++;
				continue;
			}
			$name = substr($attrs, $c, $s);
			$ch = substr($attrs, $c + $s, 1);
			$a = '<span class="keyword">' . $name . '</span>';
			$c += $s + 1;
			if($ch == '=')
			{
				$c++;
				/* Attribute has a value */
				$q = substr($attrs, $c - 1, 1);
				$start = $c;
				if($q == '"' || $q == '\'')
				{
					$vlen = strcspn($attrs, $q, $c);
					$c++;
				}
				else
				{
					$vlen = strcspn($attrs, "\t\r\n " , $c);
				}
				$a .= '="<span class="string">' . substr($attrs, $start, $vlen) . '</span>"';
				$c += $vlen;
			}
			$list[] = $a;
		}
		if(count($list))
		{
			$tag .= ' ' . implode(' ', $list);
		}
	}
	$tag .= '&gt;';
	return $tag;
}

function page_header($title = null, $class = null, $promovideo = null, $secondarynav = null)
{
	if(strlen($title))
	{
		$page_title = $title . ' — Research &amp; Education Space';
	}
	else
	{
		$page_title = $title = 'Research &amp; Education Space';
	}
	if(strlen($class))
	{
		$bodyclassattr = ' class="' . _e($class) . '"';
	}
	else
	{
		$bodyclassattr = ' class="' . _e($class) . '"';
	}	
	if(strlen($promovideo))
	{
		$promovideoiframe = '
<div id="mediaPlayer" style="height: 1300px; width: 740px;"></div>
<script>
require(["bump-3"], function($) {
  console.log("loaded!");
  var settings = {
    responsive: true,
    product: "res",
    mediaProfile: "pc",
    allowCasting: true,
    preferHtmlOnDesktop: true,
    preferHtmlOnMobile: true,
    noTracking: true,
		ui: {
			colour: "#268bd2"
		},
    playlistObject: {
      title: "Test",
      summary: "This is a test item",
      holdingImageURL: "http://ichef.bbci.co.uk/images/ic/$recipe/p03f516x.png",
      items: [
        {
          vpid: "p03dty31",
          duration: 1170
        }
      ]
    }
  };
  var mediaPlayer = $("#mediaPlayer").player(settings);
  mediaPlayer.load();
});
</script>
';
	}
	else
	{
		$promovideoiframe = '';
	}
	if(strlen($secondarynav))
	{
		$secondarynavtemplate = '
		<nav class="secondarynav">
		<div class="inner">
		<ul>
		<li><a href="https://bbcarchdev.github.io/res/guides">Guides</a></li>
		<li><a href="//acropolis.org.uk">Developer API</a></li>
		<li><a href="https://bbcarchdev.github.io/res/tools">Tools</a></li>
		<li><a href="https://bbcarchdev.github.io/res/code">Source code</a></li>
		</ul></div></nav>';
	}
	else
	{
		$secondarynavtemplate = '';
	}
	include(dirname(__FILE__) . '/../templates/header.php');
}

function page_footer()
{
	include(dirname(__FILE__) . '/../templates/footer.php');
}
