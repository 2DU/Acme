/**
 * ��Ű������� �����Խ��ϴ�.
 *
 * ��ũ��Ʈ�� ���� ���� ����� ����, ��ó�� �־��ּ���! ���� ������ ��������ϴ�.
 **/

mw.loader.using( ['mediawiki.util', 'mediawiki.notify', 'jquery.client'], function () {
/* Begin of mw.loader.using callback */

/**
 * Map addPortletLink to mw.util 
 *
 * @deprecated: Use mw.util.addPortletLink instead.
 */
mw.log.deprecate( window, 'addPortletLink', mw.util.addPortletLink,
 'Use mw.util.addPortletLink instead' );
 
/**
 * Extract a URL parameter from the current URL
 *
 * @deprecated: Use mw.util.getParamValue with proper escaping
 */
mw.log.deprecate( window, 'getURLParamValue', mw.util.getParamValue, 'Use mw.util.getParamValue instead' );
 
/** 
 * Test if an element has a certain class
 *
 * @deprecated:  Use $(element).hasClass() instead.
 */
mw.log.deprecate( window, 'hasClass', function ( element, className ) {
    return $( element ).hasClass( className );
}, 'Use jQuery.hasClass() instead' );
 
/**
 * @source www.mediawiki.org/wiki/Snippets/Load_JS_and_CSS_by_URL
 * @rev 5
 */
// CSS
var extraCSS = mw.util.getParamValue( 'withCSS' );
if ( extraCSS ) {
	if ( extraCSS.match( /^MediaWiki:[^&<>=%#]*\.css$/ ) ) {
		importStylesheet( extraCSS );
	} else {
		mw.notify( 'Only pages from the MediaWiki namespace are allowed.', { title: 'Invalid withCSS value' } );
	}
}
 
// JS
var extraJS = mw.util.getParamValue( 'withJS' );
if ( extraJS ) {
	if ( extraJS.match( /^MediaWiki:[^&<>=%#]*\.js$/ ) ) {
		importScript( extraJS );
	} else {
		mw.notify( 'Only pages from the MediaWiki namespace are allowed.', { title: 'Invalid withJS value' } );
	}
}
 

/**
 * Import more specific scripts if necessary
 */

if ( mw.config.get( 'wgNamespaceNumber' ) === 6 ) {
    /* file description page scripts */
    importScript( 'MediaWiki:Common.js/file.js' );
}

/* ([[��Ű���:������ ��û/2007�� 5��#��ũ��Ʈ �߰� ��û]]) */
/** Collapsible tables *********************************************************
 *
 *  Description: Allows tables to be collapsed, showing only the header. See
 *               [[:en:Wikipedia:NavFrame]].
 *  Maintainers: [[:en:User:R. Koot]]
 */
 
var autoCollapse = 2;
var collapseCaption = '�����';
var expandCaption = '���̱�';

window.collapseTable = function ( tableIndex ) {
    var Button = document.getElementById( 'collapseButton' + tableIndex );
    var Table = document.getElementById( 'collapsibleTable' + tableIndex );

    if ( !Table || !Button ) {
        return false;
    }

    var Rows = Table.rows;
    var i;

    if ( Button.firstChild.data === collapseCaption ) {
        for ( i = 1; i < Rows.length; i++ ) {
            Rows[i].style.display = 'none';
        }
        Button.firstChild.data = expandCaption;
    } else {
        for ( i = 1; i < Rows.length; i++ ) {
            Rows[i].style.display = Rows[0].style.display;
        }
        Button.firstChild.data = collapseCaption;
    }
};

function createCollapseButtons() {
    var tableIndex = 0;
    var NavigationBoxes = {};
    var Tables = document.getElementsByTagName( 'table' );
    var i;

    function handleButtonLink( index, e ) {
        window.collapseTable( index );
        e.preventDefault();
    }

    for ( i = 0; i < Tables.length; i++ ) {
        if ( $( Tables[i] ).hasClass( 'collapsible' ) ) {

            /* only add button and increment count if there is a header row to work with */
            var HeaderRow = Tables[i].getElementsByTagName( 'tr' )[0];
            if ( !HeaderRow ) continue;
            var Header = HeaderRow.getElementsByTagName( 'th' )[0];
            if ( !Header ) continue;

            NavigationBoxes[ tableIndex ] = Tables[i];
            Tables[i].setAttribute( 'id', 'collapsibleTable' + tableIndex );

            var Button     = document.createElement( 'span' );
            var ButtonLink = document.createElement( 'a' );
            var ButtonText = document.createTextNode( collapseCaption );

            Button.className = 'collapseButton';  /* Styles are declared in Common.css */

            ButtonLink.style.color = Header.style.color;
            ButtonLink.setAttribute( 'id', 'collapseButton' + tableIndex );
            ButtonLink.setAttribute( 'href', '#' );
            $( ButtonLink ).on( 'click', $.proxy( handleButtonLink, ButtonLink, tableIndex ) );
            ButtonLink.appendChild( ButtonText );

            Button.appendChild( document.createTextNode( '[' ) );
            Button.appendChild( ButtonLink );
            Button.appendChild( document.createTextNode( ']' ) );

            Header.insertBefore( Button, Header.firstChild );
            tableIndex++;
        }
    }

    for ( i = 0;  i < tableIndex; i++ ) {
        if ( $( NavigationBoxes[i] ).hasClass( 'collapsed' ) || ( tableIndex >= autoCollapse && $( NavigationBoxes[i] ).hasClass( 'autocollapse' ) ) ) {
            window.collapseTable( i );
        } 
        else if ( $( NavigationBoxes[i] ).hasClass ( 'innercollapse' ) ) {
            var element = NavigationBoxes[i];
            while ((element = element.parentNode)) {
                if ( $( element ).hasClass( 'outercollapse' ) ) {
                    window.collapseTable ( i );
                    break;
                }
            }
        }
    }
}

mw.hook( 'wikipage.content' ).add( createCollapseButtons );

/* ([[��Ű���:������ ��û/2007�� 5��#��ũ��Ʈ �߰� ��û]]) */
/** Dynamic Navigation Bars (experimental) *************************************
 *
 *  Description: See [[:en:Wikipedia:NavFrame]].
 *  Maintainers: UNMAINTAINED
 */
 
// set up the words in your language
/* set up the words in your language */
var NavigationBarHide = '[' + collapseCaption + ']';
var NavigationBarShow = '[' + expandCaption + ']';

/**
 * Shows and hides content and picture (if available) of navigation bars
 * Parameters:
 *     indexNavigationBar: the index of navigation bar to be toggled
 **/
window.toggleNavigationBar = function ( indexNavigationBar, event ) {
    var NavToggle = document.getElementById( 'NavToggle' + indexNavigationBar );
    var NavFrame = document.getElementById( 'NavFrame' + indexNavigationBar );
    var NavChild;

    if ( !NavFrame || !NavToggle ) {
        return false;
    }

    /* if shown now */
    if ( NavToggle.firstChild.data === NavigationBarHide ) {
        for ( NavChild = NavFrame.firstChild; NavChild != null; NavChild = NavChild.nextSibling ) {
            if ( $( NavChild ).hasClass( 'NavContent' ) || $( NavChild ).hasClass( 'NavPic' ) ) {
                NavChild.style.display = 'none';
            }
        }
    NavToggle.firstChild.data = NavigationBarShow;

    /* if hidden now */
    } else if ( NavToggle.firstChild.data === NavigationBarShow ) {
        for ( NavChild = NavFrame.firstChild; NavChild != null; NavChild = NavChild.nextSibling ) {
            if ( $( NavChild ).hasClass( 'NavContent' ) || $( NavChild ).hasClass( 'NavPic' ) ) {
                NavChild.style.display = 'block';
            }
        }
        NavToggle.firstChild.data = NavigationBarHide;
    }

    event.preventDefault();
};

/* adds show/hide-button to navigation bars */
function createNavigationBarToggleButton() {
    var indexNavigationBar = 0;
    var NavFrame;
    var NavChild;
    /* iterate over all < div >-elements */
    var divs = document.getElementsByTagName( 'div' );
    for ( var i = 0; (NavFrame = divs[i]); i++ ) {
        /* if found a navigation bar */
        if ( $( NavFrame ).hasClass( 'NavFrame' ) ) {

            indexNavigationBar++;
            var NavToggle = document.createElement( 'a' );
            NavToggle.className = 'NavToggle';
            NavToggle.setAttribute( 'id', 'NavToggle' + indexNavigationBar );
            NavToggle.setAttribute( 'href', '#' );
            $( NavToggle ).on( 'click', $.proxy( window.toggleNavigationBar, window, indexNavigationBar ) );

            var isCollapsed = $( NavFrame ).hasClass( 'collapsed' );
            /**
             * Check if any children are already hidden.  This loop is here for backwards compatibility:
             * the old way of making NavFrames start out collapsed was to manually add style="display:none"
             * to all the NavPic/NavContent elements.  Since this was bad for accessibility (no way to make
             * the content visible without JavaScript support), the new recommended way is to add the class
             * "collapsed" to the NavFrame itself, just like with collapsible tables.
             */
            for ( NavChild = NavFrame.firstChild; NavChild != null && !isCollapsed; NavChild = NavChild.nextSibling ) {
                if ( $( NavChild ).hasClass( 'NavPic' ) || $( NavChild ).hasClass( 'NavContent' ) ) {
                    if ( NavChild.style.display === 'none' ) {
                        isCollapsed = true;
                    }
                }
            }
            if ( isCollapsed ) {
                for ( NavChild = NavFrame.firstChild; NavChild != null; NavChild = NavChild.nextSibling ) {
                    if ( $( NavChild ).hasClass( 'NavPic' ) || $( NavChild ).hasClass( 'NavContent' ) ) {
                        NavChild.style.display = 'none';
                    }
                }
            }
            var NavToggleText = document.createTextNode( isCollapsed ? NavigationBarShow : NavigationBarHide );
            NavToggle.appendChild( NavToggleText );

            /* Find the NavHead and attach the toggle link (Must be this complicated because Moz's firstChild handling is borked) */
            for( var j = 0; j < NavFrame.childNodes.length; j++ ) {
                if ( $( NavFrame.childNodes[j] ).hasClass( 'NavHead' ) ) {
                    NavToggle.style.color = NavFrame.childNodes[j].style.color;
                    NavFrame.childNodes[j].appendChild( NavToggle );
                }
            }
            NavFrame.setAttribute( 'id', 'NavFrame' + indexNavigationBar );
        }
    }
}

mw.hook( 'wikipage.content' ).add( createNavigationBarToggleButton );

/***** �׸� ���� Ʋ�� �ڵ����� �ҷ��� ********
 * Adds a link to subpages of current page
 * from commons.wikimedia.org
 *  Maintainers: [[User:Yonidebest]], [[User:Dschwen]]
 *  [[�����:Kwj2772]]�� ����
 *  JSconfig items: bool 'loadAutoInformationTemplate'
 *                       (true=enabled (default), false=disabled)
 * JSConfig�� ������� �ʵ��� ������. --[[�����:Klutzy|klutzy]] ([[��������:Klutzy|���]]) 2009�� 9�� 27�� (��) 20:33 (KST)
 ****/
if (mw.config.get('wgCanonicalSpecialPageName') == 'Upload') {
  importScript('MediaWiki:Upload.js');
}

/* ���ͷ�Ƽ�� ����. ���� ��Ű������� ������. -- [[�����:ChongDae]] 2010�� 3�� 28�� (��) 02:08 (KST) */
/**
 * WikiMiniAtlas
 *
 * Description: WikiMiniAtlas is a popup click and drag world map.
 *              This script causes all of our coordinate links to display the WikiMiniAtlas popup button.
 *              The script itself is located on meta because it is used by many projects.
 *              See [[Meta:WikiMiniAtlas]] for more information. 
 * Maintainers: [[User:Dschwen]]
 */
( function () {
    var require_wikiminiatlas = false;
    var coord_filter = /geohack/;
    $( function () {
        $( 'a.external.text' ).each( function( key, link ) {
            if ( link.href && coord_filter.exec( link.href ) ) {
                require_wikiminiatlas = true;
                // break from loop
                return false;
            }
        } );
        if ( $( 'div.kmldata' ).length ) {
            require_wikiminiatlas = true;
        }
        if ( require_wikiminiatlas ) {
            mw.loader.load( '//meta.wikimedia.org/w/index.php?title=MediaWiki:Wikiminiatlas.js&action=raw&ctype=text/javascript' );
        }
    } );
} )();

/*
  *��Ų�� �ҷ����� �ʴ� ������ �־� �Ʒ� ������ �ϴ� ����ϰ� �߰�.
  * ���� ������ �ʿ��� �� ����. [[��Ű���:�����_(���)/2015��_8��#��Ų CSS ����]]
  * [[�����:Ykhwong]] 2015�� 8�� 31��
  */
var skin = mw.config.get('skin');
switch(skin) {
  case 'monobook':
    importStylesheet('�̵����Ű:Monobook.css'); break;
  case 'modern':
    importStylesheet('�̵����Ű:Modern.css'); break;
  case 'vector':
    importStylesheet('�̵����Ű:Vector.css');
    /* [[��Ű���:����� (���)/2015�� 9��#��Ű��������� �� �������� ������ �ֽ��ϴ�.]] ���� [[�����:Ykhwong]] 2015�� 9�� 6�� */
    if ( navigator.appVersion.indexOf("MSIE 9.")!=-1 ) {
        mw.util.addCSS ( 'html, body { padding-top: 2.5em; } ' );
    }
    break;
  case 'cologneblue':
    importStylesheet('�̵����Ű:Cologneblue.css'); break;
  default:
  break;
};

/* ���� ���� ��ũ ��ũ��Ʈ
 * ���� ������ ���� �� �Ϲ� ��ũ�� ���� ���� ��ũ�� �����Ͽ� �Ϲ� ���� �������� ��ȯ�Ǵ� ���� �ּ�ȭ
 * [[�̵����Ű���:Common.js#���� ������ ��ũ��Ʈ]]
 * [[�����:IRTC1015]] 2011�� 1�� 9�� (��) 23:06 (KST)
 */
if ( document.location && document.location.protocol === 'https:' ) {
    /* New secure servers */
    mw.loader.load('//en.wikipedia.org/w/index.php?title=MediaWiki:Common.js/secure new.js&action=raw&ctype=text/javascript');
}

/**
 * Fix for Windows XP Unicode font rendering
 */
if ( navigator.appVersion.search(/windows nt 5/i) !== -1 ) {
    mw.util.addCSS( '.IPA { font-family: "Lucida Sans Unicode", "Arial Unicode MS"; } ' + 
                '.Unicode { font-family: "Arial Unicode MS", "Lucida Sans Unicode"; } ' );
}

/* End of mw.loader.using callback */
} );
/* DO NOT ADD CODE BELOW THIS LINE */
