/* ==========================================================
 * AdminKIT v1.5
 * common.js
 * 
 * http://www.mosaicpro.biz
 * Copyright MosaicPro
 *
 * Built exclusively for sale @Envato Marketplaces
 * ========================================================== */ 

/* Utility functions */
// generate a random number within a range (PHP's mt_rand JavaScript implementation)
function mt_rand(min, max) {
  // http://kevin.vanzonneveld.net
  // +   original by: Onno Marsman
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +   input by: Kongo
  // *     example 1: mt_rand(1, 1);
  // *     returns 1: 1
  var argc = arguments.length;
  if (argc === 0) {
    min = 0;
    max = 2147483647;
  } else if (argc === 1) {
    min = 0;
    max = min;
  } else {
    min = parseInt(min, 10);
    max = parseInt(max, 10);
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// scroll to element animation
function scrollTo(id) {
  if ($(id).length)
    $('html,body').animate({scrollTop: $(id).offset().top},'slow');
}

// handle menu toggle button action
function toggleMenuHidden() {
  $('.container-fluid:first').toggleClass('menu-hidden');
  $('#menu').toggleClass('hidden-phone', function()
  {
    if ($('.container-fluid:first').is('.menu-hidden'))
    {
      if (typeof resetResizableMenu != 'undefined') 
        resetResizableMenu(true);
    }
    else 
    {
      removeMenuHiddenPhone();
      
      if (typeof lastResizableMenuPosition != 'undefined') 
        lastResizableMenuPosition();
    }
    
    if (typeof $.cookie != 'undefined')
      $.cookie('menuHidden', $('.container-fluid:first').is('.menu-hidden'));
  });
  
  if (typeof masonryGallery != 'undefined') 
    masonryGallery(); 
}

function removeMenuHiddenPhone() {
  if (!$('.container-fluid:first').is('.menu-hidden') && $('#menu').is('.hidden-phone'))
    $('#menu').removeClass('hidden-phone');
}

/*
 * Helper function for JQueryUI Sliders Create event
 */
function JQSliderCreate() {
  $(this)
    .removeClass('ui-corner-all ui-widget-content')
    .wrap('<span class="ui-slider-wrap"></span>')
    .find('.ui-slider-handle')
    .removeClass('ui-corner-all ui-state-default');
}

yp.ready(function() {
    
  // Sidebar menu collapsibles
  $('#menu .collapse').on('show', function(e)
  {
    e.stopPropagation();
    $(this).parents('.hasSubmenu:first').addClass('active');
  })
  .on('hidden', function(e)
  {
    e.stopPropagation();
    $(this).parents('.hasSubmenu:first').removeClass('active');
  });
  
  // main menu visibility toggle
  $('.navbar.main .btn-navbar').click(function()
  {
    var disabled = typeof toggleMenuButtonWhileTourOpen != 'undefined' ? toggleMenuButtonWhileTourOpen(true) : false;
    if (!disabled)
      toggleMenuHidden();
  });
  
  // multi-level top menu
  $('.submenu').hover(function()
  {
    $(this).children('ul').removeClass('submenu-hide').addClass('submenu-show');
  }, function()
  {
    $(this).children('ul').removeClass('.submenu-show').addClass('submenu-hide');
  })
  .find("a:first").append(" &raquo; ");
  
  // print
  $('[data-toggle="print"]').click(function(e)
  {
    e.preventDefault();
    window.print();
  });
  
  // collapsible widgets
  $('.widget[data-toggle="collapse-widget"] .widget-body')
    .on('show', function() {
      $(this).parents('.widget:first').attr('data-collapse-closed', "false");
    })
    .on('hidden', function() {
      $(this).parents('.widget:first').attr('data-collapse-closed', "true");
    });
  
  $('.widget[data-toggle="collapse-widget"]').each(function()
  {
    // append toggle button
    $(this).children('.widget-head').append('<span class="collapse-toggle"></span>');///
    
    // make the widget body collapsible
    $(this).children('.widget-body').addClass('collapse');///
    
    // verify if the widget should be opened
    if ($(this).attr('data-collapse-closed') !== "true")
      $(this).find('.widget-body').addClass('in');
    
    // bind the toggle button
    $(this).find('.collapse-toggle').on('click', function() {
      $(this).parents('.widget:first').children('.widget-body').collapse('toggle');
    });
  });
  
  // bind window resize event
  $(window).resize(function()
  {
    /*
    if (!$('#menu').is(':visible') && !$('.container-fluid:first').is('.menu-hidden') && !$('.container-fluid:first').is('.documentation') && !$('.container-fluid:first').is('.login'))
    {
      $('.container-fluid:first').addClass('menu-hidden');
      
      if (Modernizr.touch)
        return;
      
      resetResizableMenu(true);
    }
    else
    {
      if (Modernizr.touch)
        return;
      
      if (!$('#menu').is(':visible') && parseInt($(document).width()) > 767 && !$('.container-fluid:first').is('.menu-hidden'))
      {
        $('.container-fluid:first').removeClass('menu-hidden');
        lastResizableMenuPosition();
      }
    }
    */
  });
  
  // trigger window resize event
  $(window).resize();
  
  // show/hide toggle buttons
  $('[data-toggle="hide"]').click(function() {
    $($(this).attr('data-target')).toggleClass('hide');
    if ($(this).is('.scrollTarget') && !$($(this).attr('data-target')).is('.hide'))
      scrollTo($(this).attr('data-target'));
  });
  
  // handle menu position change
  $('#toggle-menu-position').on('change', function()
  {
    $('.container-fluid:first').toggleClass('menu-right');
    
    if ($(this).prop('checked')) 
      $('.container-fluid:first').removeClass('menu-left');
    else
      $('.container-fluid:first').addClass('menu-left');
    
    if (typeof $.cookie != 'undefined')
      $.cookie('rightMenu', $(this).prop('checked') ? $(this).prop('checked') : null);
    
    if (typeof resetResizableMenu != 'undefined' && typeof lastResizableMenuPosition != 'undefined')
    {
      resetResizableMenu(true);
      lastResizableMenuPosition();
    }
    removeMenuHiddenPhone();
  });
  
  // handle persistent menu position on page load
  if (typeof $.cookie != 'undefined' && $.cookie('rightMenu') && $('#toggle-menu-position').length)
  {
    $('#toggle-menu-position').prop('checked', true);
    $('.container-fluid:first').not('.menu-right').removeClass('menu-left').addClass('menu-right');
  }
  
  // handle layout type change
  $('#toggle-layout').on('change', function()
  {
    if ($(this).prop('checked')) 
    {
      $('.container-fluid:first').addClass('fixed');
    }
    else
      $('.container-fluid:first').removeClass('fixed');
    
    if (typeof $.cookie != 'undefined')
      $.cookie('layoutFixed', $(this).prop('checked') ? $(this).prop('checked') : null);
  });
  
  // handle persistent layout type on page load
  if (typeof $.cookie != 'undefined' && $.cookie('layoutFixed') && $('#toggle-layout').length)
  {
    $('#toggle-layout').prop('checked', true);
    $('.container-fluid:first').addClass('fixed');
  }
  
  // handle persistent menu visibility on page load
  if (typeof $.cookie != 'undefined' && $.cookie('menuHidden') && $.cookie('menuHidden') == 'true' || (!$('.container-fluid').is('.menu-hidden') && !$('#menu').is(':visible')))
    toggleMenuHidden();
  else if ($('#menu').is(':visible')) {
    removeMenuHiddenPhone();
    
    if (typeof lastResizableMenuPosition != 'undefined') 
      lastResizableMenuPosition();
  }
});